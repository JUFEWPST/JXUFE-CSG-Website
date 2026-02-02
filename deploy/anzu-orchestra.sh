#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_NAME="$(basename "$PROJECT_DIR" | tr '[:upper:]' '[:lower:]')"  # 转换为小写
DEPLOY_DIR="$SCRIPT_DIR"
LOG_DIR="/var/log/anzu-orchestra"
BRANCH="${BRANCH:-main}"
CHECK_REF="refs/heads/$BRANCH"
CHECK_INTERVAL_SECONDS="${CHECK_INTERVAL_SECONDS:-900}"
CHECK_INTERVAL_TEXT="${CHECK_INTERVAL_TEXT:-15分钟}"
COMPOSE_FILE="${COMPOSE_FILE:-$DEPLOY_DIR/docker-compose.yml}"
IMAGE_NAME="${IMAGE_NAME:-}"
LOCK_FILE="${LOCK_FILE:-$DEPLOY_DIR/anzu-orchestra.lock}"

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

require_cmd() {
    local cmd="$1"
    if ! command -v "$cmd" >/dev/null 2>&1; then
        error "缺少依赖命令: $cmd"
        return 1
    fi
    return 0
}

check_dependencies() {
    require_cmd git
    require_cmd docker
    require_cmd awk
    require_cmd grep
    require_cmd sort
    require_cmd tail
    require_cmd cut

    if ! docker compose version >/dev/null 2>&1; then
        error "Docker Compose 不可用（请确认 docker compose 命令可用）"
        return 1
    fi

    return 0
}

resolve_image_name() {
    if [ -n "$IMAGE_NAME" ]; then
        return 0
    fi

    if [ -f "$COMPOSE_FILE" ]; then
        local compose_image
        compose_image=$(grep -E '^[[:space:]]*image:' "$COMPOSE_FILE" | head -n 1 | awk '{print $2}')
        if [ -n "$compose_image" ]; then
            # 移除可能存在的标签，只保留镜像名称部分
            IMAGE_NAME="${compose_image%%:*}"
            log "使用 compose 中的镜像名: $IMAGE_NAME"
            return 0
        fi
    fi

    IMAGE_NAME="$PROJECT_NAME"
    warning "未能从 compose 读取镜像名，回退为: $IMAGE_NAME"
    return 0
}

ensure_log_dir() {
    if [ -n "$LOG_DIR" ] && [ ! -d "$LOG_DIR" ]; then
        if ! mkdir -p "$LOG_DIR" 2>/dev/null; then
            warning "无法创建日志目录: $LOG_DIR"
            return 1
        fi
    fi
    return 0
}

write_deploy_log() {
    local message="$1"

    if ! ensure_log_dir; then
        return 0
    fi

    if ! echo "$message" >> "$LOG_DIR/deploy.log"; then
        warning "写入日志失败: $LOG_DIR/deploy.log"
    fi
}

acquire_lock() {
    local pid

    if [ -f "$LOCK_FILE" ]; then
        pid=$(cat "$LOCK_FILE" 2>/dev/null || true)
        if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
            error "检测到已有实例运行 (PID: $pid)"
            return 1
        fi
        warning "发现过期锁文件，重新获取锁"
    fi

    if ! echo "$$" > "$LOCK_FILE"; then
        error "无法创建锁文件: $LOCK_FILE"
        return 1
    fi

    return 0
}

release_lock() {
    rm -f "$LOCK_FILE" || true
}

check_updates() {
    log "检查远程仓库更新..."

    cd "$PROJECT_DIR" || { error "无法进入项目目录"; return 1; }

    local local_hash
    local_hash=$(git rev-parse HEAD 2>/dev/null)
    [ -z "$local_hash" ] && { error "获取本地 commit hash 失败"; return 1; }

    # 合并镜像和原始仓库，统一循环
    local urls=("${MIRROR_URLS[@]}" "$ORIGINAL_URL")

    for url in "${urls[@]}"; do
        log "尝试从 $url 获取远程 $CHECK_REF..."
        local remote_line
        remote_line=$(git ls-remote "$url" "$CHECK_REF" 2>/dev/null | head -n 1 || true)
        if [ -n "$remote_line" ]; then
            local remote_hash
            remote_hash=$(echo "$remote_line" | awk '{print $1}')
            if [ "$local_hash" != "$remote_hash" ]; then
                log "发现更新: 本地 $local_hash -> 远程 $remote_hash"
                echo "$remote_hash"   # 只输出纯 hash 到 stdout
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

    if [ -z "$target_hash" ]; then
        error "目标 commit hash 为空，取消拉取"
        return 1
    fi

    log "拉取最新代码..."

    cd "$PROJECT_DIR"

    for url in "${MIRROR_URLS[@]}"; do
        log "尝试从镜像站拉取: $url"
        if git fetch "$url" "$BRANCH" 2>/dev/null && git reset --hard FETCH_HEAD; then
            local current_hash
            current_hash=$(git rev-parse HEAD 2>/dev/null || true)
            if [ "$current_hash" = "$target_hash" ]; then
                success "从镜像站拉取成功"
                return 0
            else
                warning "拉取成功但 commit 不一致: 期望 $target_hash，实际 $current_hash"
                return 1
            fi
        fi
    done

    log "镜像站均失败，尝试原始仓库..."
    if git fetch "$ORIGINAL_URL" "$BRANCH" 2>/dev/null && git reset --hard FETCH_HEAD; then
        local current_hash
        current_hash=$(git rev-parse HEAD 2>/dev/null || true)
        if [ "$current_hash" = "$target_hash" ]; then
            success "从原始仓库拉取成功"
            return 0
        else
            warning "拉取成功但 commit 不一致: 期望 $target_hash，实际 $current_hash"
            return 1
        fi
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
        --build-arg NUXT_PUBLIC_BUILD_INFO_BUILDER="AnzuOrchestra" \
        --build-arg NUXT_PUBLIC_BUILD_INFO_BUILD_TIME="$build_time" \
        --build-arg NUXT_PUBLIC_BUILD_INFO_COMMIT_HASH="$commit_hash" \
        -t "$IMAGE_NAME:latest" \
        -t "$IMAGE_NAME:$commit_hash" \
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

        write_deploy_log "$(date -Iseconds) - 部署成功 - Commit: $commit_hash"

        log "清理旧镜像..."
        docker images "$IMAGE_NAME" --format "{{.CreatedAt}}\t{{.Tag}}" | \
            grep -v "latest" | \
            sort -r | \
            tail -n +6 | \
            cut -f2 | \
            while read tag; do
                docker rmi "$IMAGE_NAME:$tag" 2>/dev/null || true
            done

        return 0
    else
        error "部署失败"
        write_deploy_log "$(date -Iseconds) - 部署失败 - Commit: $commit_hash"
        return 1
    fi
}

main_loop() {
    log "AnzuOrchestra 启动，检查间隔：$CHECK_INTERVAL_TEXT"

    trap 'log "收到退出信号，正在停止..."; release_lock; exit 0' INT TERM

    if ! check_dependencies; then
        error "依赖检查失败，退出"
        return 1
    fi

    resolve_image_name

    ensure_log_dir || true

    while true; do
        log "开始新一轮检查..."

        local new_hash
        if ! new_hash=$(check_updates); then
            warning "检查远程更新失败，稍后重试"
            new_hash=""
        fi

        # 如果 NEW_HASH 为空，说明没有更新或失败，直接等待下一轮
        if [ -z "$new_hash" ]; then
            log "没有发现更新或无法检查，继续等待..."
        else
            log "检测到更新 (commit: $new_hash)，开始处理..."

            if ! pull_latest "$new_hash"; then
                error "拉取代码失败，跳过本次更新"
                sleep "$CHECK_INTERVAL_SECONDS"
                continue
            fi

            if ! build_with_docker "$new_hash"; then
                error "构建失败，跳过部署"
                sleep "$CHECK_INTERVAL_SECONDS"
                continue
            fi

            if ! deploy "$new_hash"; then
                error "部署失败"
                sleep "$CHECK_INTERVAL_SECONDS"
                continue
            fi

            success "更新部署完成"
        fi

        log "等待$CHECK_INTERVAL_TEXT..."
        sleep "$CHECK_INTERVAL_SECONDS" || break
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
        if ! acquire_lock; then
            exit 1
        fi
        main_loop
        ;;
    stop)
        log "停止 AnzuOrchestra..."
        pkill -f "anzu-orchestra.sh start" || true
        release_lock
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
        if ! check_dependencies; then
            exit 1
        fi
        resolve_image_name
        ensure_log_dir || true
        CURRENT_HASH=$(cd "$PROJECT_DIR" && git rev-parse HEAD)
        build_with_docker "$CURRENT_HASH"
        deploy "$CURRENT_HASH"
        ;;
    help|*)
        show_help
        ;;
esac
