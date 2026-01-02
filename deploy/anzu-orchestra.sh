#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_NAME="$(basename "$PROJECT_DIR" | tr '[:upper:]' '[:lower:]')"  # 转换为小写
DEPLOY_DIR="$SCRIPT_DIR"
LOG_DIR="/var/log/anzu-orchestra"

MIRROR_URLS=(
    "https://gh.llkk.cc/https://github.com/JUFEWPST/JXUFE-CSG-Website"
    "https://github.dpik.top/https://github.com/JUFEWPST/JXUFE-CSG-Website"
)
ORIGINAL_URL="https://github.com/JUFEWPST/JXUFE-CSG-Website"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" >&2
}
success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" >&2
}
warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" >&2
}
error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

check_updates() {
    log "检查远程仓库更新..."

    cd "$PROJECT_DIR" || { error "无法进入项目目录"; return 1; }

    LOCAL_HASH=$(git rev-parse HEAD 2>/dev/null)
    [ -z "$LOCAL_HASH" ] && { error "获取本地 commit hash 失败"; return 1; }

    # 合并镜像和原始仓库，统一循环
    local urls=("${MIRROR_URLS[@]}" "$ORIGINAL_URL")

    for url in "${urls[@]}"; do
        log "尝试从 $url 获取远程 HEAD..."
        if git ls-remote "$url" HEAD >/dev/null 2>&1; then
            REMOTE_HASH=$(git ls-remote "$url" HEAD | awk '{print $1}')
            if [ "$LOCAL_HASH" != "$REMOTE_HASH" ]; then
                log "发现更新: 本地 $LOCAL_HASH -> 远程 $REMOTE_HASH"
                echo "$REMOTE_HASH"   # 只输出纯 hash 到 stdout
                return 0
            else
                log "已是最新版本"
                echo ""               # 无更新时返回空
                return 0
            fi
        else
            warning "无法连接到 $url"
        fi
    done

    warning "所有仓库均无法连接"
    echo ""   # 最终失败也返回空
    return 1
}

pull_latest() {
    local target_hash="$1"
    
    log "拉取最新代码..."
    
    cd "$PROJECT_DIR"
    
    for url in "${MIRROR_URLS[@]}"; do
        log "尝试从镜像站拉取: $url"
        if git fetch "$url" main 2>/dev/null && git reset --hard FETCH_HEAD; then
            success "从镜像站拉取成功"
            return 0
        fi
    done
    
    log "镜像站均失败，尝试原始仓库..."
    if git fetch origin main 2>/dev/null && git reset --hard FETCH_HEAD; then
        success "从原始仓库拉取成功"
        return 0
    fi
    
    error "拉取代码失败"
    return 1
}

build_with_docker() {
    local commit_hash="$1"
    local build_time="$(date -Iseconds)"
    
    log "开始Docker构建..."
    log "构建信息: Builder=AnzuOrchestra, Commit=$commit_hash, Time=$build_time"
    
    cd "$PROJECT_DIR"
    
    log "构建Docker镜像..."
    if docker build \
        -f "$DEPLOY_DIR/Dockerfile" \
        --build-arg NUXT_PUBLIC_BUILDER="AnzuOrchestra" \
        --build-arg NUXT_PUBLIC_BUILD_TIME="$build_time" \
        --build-arg NUXT_PUBLIC_COMMIT_HASH="$commit_hash" \
        -t "$PROJECT_NAME:latest" \
        -t "$PROJECT_NAME:$commit_hash" \
        .; then
        success "Docker镜像构建成功"
        return 0
    else
        error "Docker镜像构建失败"
        return 1
    fi
}

deploy() {
    local commit_hash="$1"
    
    log "开始部署..."
    
    cd "$DEPLOY_DIR"
    
    log "停止现有容器..."
    docker compose down || true
    
    log "启动新容器..."
    if docker compose up -d; then
        success "部署成功"
        
        echo "$(date -Iseconds) - 部署成功 - Commit: $commit_hash" >> "$LOG_DIR/deploy.log"
        
        log "清理旧镜像..."
        docker images "$PROJECT_NAME" --format "{{.CreatedAt}}\t{{.Tag}}" | \
            grep -v "latest" | \
            sort -r | \
            tail -n +6 | \
            cut -f2 | \
            while read tag; do
                docker rmi "$PROJECT_NAME:$tag" 2>/dev/null || true
            done
        
        return 0
    else
        error "部署失败"
        echo "$(date -Iseconds) - 部署失败 - Commit: $commit_hash" >> "$LOG_DIR/deploy.log"
        return 1
    fi
}

main_loop() {
    log "AnzuOrchestra 启动，检查间隔：15分钟"
   
    trap 'log "收到退出信号，正在停止..."; exit 0' INT TERM
   
    while true; do
        log "开始新一轮检查..."
       
        NEW_HASH=$(check_updates)
       
        # 如果 NEW_HASH 为空，说明没有更新或失败，直接等待下一轮
        if [ -z "$NEW_HASH" ]; then
            log "没有发现更新或无法检查，继续等待..."
        else
            log "检测到更新 (commit: $NEW_HASH)，开始处理..."
           
            if ! pull_latest "$NEW_HASH"; then
                error "拉取代码失败，跳过本次更新"
                sleep 900
                continue
            fi
           
            if ! build_with_docker "$NEW_HASH"; then
                error "构建失败，跳过部署"
                sleep 900
                continue
            fi
           
            if ! deploy "$NEW_HASH"; then
                error "部署失败"
                sleep 900
                continue
            fi
           
            success "更新部署完成"
        fi
       
        log "等待15分钟..."
        sleep 900 || break
    done
   
    log "AnzuOrchestra 已停止"
}

show_help() {
    cat << EOF
AnzuOrchestra - 自动化构建部署系统

用法: $0 [命令]

命令:
    start       启动自动化部署服务
    stop        停止自动化部署服务
    status      查看服务状态
    build       手动触发构建
    help        显示此帮助信息

示例:
    $0 start     # 启动自动化服务
    $0 build     # 手动构建当前代码

EOF
}

case "$1" in
    start)
        main_loop
        ;;
    stop)
        log "停止 AnzuOrchestra..."
        pkill -f "anzu-orchestra.sh start" || true
        success "已停止"
        ;;
    status)
        if pgrep -f "anzu-orchestra.sh start" > /dev/null; then
            success "AnzuOrchestra 正在运行"
        else
            warning "AnzuOrchestra 未运行"
        fi
        ;;
    build)
        CURRENT_HASH=$(cd "$PROJECT_DIR" && git rev-parse HEAD)
        build_with_docker "$CURRENT_HASH"
        deploy "$CURRENT_HASH"
        ;;
    help|*)
        show_help
        ;;
esac
