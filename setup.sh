#!/bin/bash

echo "🎨 ColorCraft Pro - 项目设置脚本"
echo "================================"

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装。请先安装 Node.js (版本 14 或更高)"
    exit 1
fi

# 检查 npm 是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装。请先安装 npm"
    exit 1
fi

echo "✅ Node.js 和 npm 已安装"

# 安装依赖
echo "📦 安装项目依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

# 初始化 Git (如果还没有)
if [ ! -d ".git" ]; then
    echo "🔧 初始化 Git 仓库..."
    git init
    git add .
    git commit -m "🎉 Initial commit: ColorCraft Pro setup"
fi

# 初始化 Tailwind CSS
echo "🎨 配置 Tailwind CSS..."
npx tailwindcss init -p

echo "✅ 项目设置完成！"
echo ""
echo "🚀 运行以下命令启动开发服务器:"
echo "   npm start"
echo ""
echo "🌐 构建生产版本:"
echo "   npm run build"
echo ""
echo "📦 部署到 GitHub Pages:"
echo "   npm run deploy"
