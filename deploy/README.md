# AnzuOrchestra 自动化构建部署系统

## 概述
AnzuOrchestra 是一个自动化构建部署脚本，用于自动拉取、构建和部署 JXUFE-CSG-Website 项目。

## 功能
定时检查远程仓库更新（15分钟一次）、自动拉取最新代码、使用 Docker 构建项目、自动部署、显示构建信息在页面底部

## 文件结构
```
deploy/
├── anzu-orchestra.sh      # 主脚本
├── Dockerfile             # Docker 构建配置
├── docker-compose.yml     # 服务编排配置
└── README.md              # 说明文档
```

## 使用方法

### 1. 设置执行权限
```bash
chmod +x deploy/anzu-orchestra.sh
```

### 2. 启动自动化服务
```bash
sudo deploy/anzu-orchestra.sh start
```

### 3. 手动触发构建
```bash
sudo deploy/anzu-orchestra.sh build
```

### 4. 查看服务状态
```bash
sudo deploy/anzu-orchestra.sh status
```

### 5. 停止服务
```bash
sudo deploy/anzu-orchestra.sh stop
```

### 6. 显示帮助
```bash
deploy/anzu-orchestra.sh help
```

## 构建信息
构建信息会显示在网站页脚：
```
Built by AnzuOrchestra / 2026-01-02T03:30:00+08:00 / #470695
```

## 镜像站配置
优先使用以下镜像站
- https://gh.llkk.cc/
- https://github.dpik.top/

## 日志
日志文件保存在 `/var/log/anzu-orchestra/`

