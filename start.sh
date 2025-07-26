#!/bin/bash

echo "🎨 启动 ColorCraft Pro 开发服务器..."
echo "================================"

# 检查依赖是否已安装
if [ ! -d "node_modules" ]; then
    echo "📦 首次运行，安装依赖..."
    npm install
fi

# 启动开发服务器
echo "🚀 启动开发服务器..."
npm start
