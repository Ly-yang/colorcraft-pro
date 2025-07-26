#!/bin/bash

# ColorCraft Pro 一键安装脚本
# 使用方法: curl -fsSL https://raw.githubusercontent.com/yourusername/colorcraft-pro/main/install.sh | bash

set -e

echo "🎨 ColorCraft Pro 一键安装脚本"
echo "================================"

# 检查必要工具
check_requirements() {
    echo "🔍 检查系统要求..."
    
    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js 未安装"
        echo "请访问 https://nodejs.org 安装 Node.js (版本 14 或更高)"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 14 ]; then
        echo "❌ Node.js 版本过低 (当前: $(node -v), 需要: v14+)"
        exit 1
    fi
    
    # 检查 npm
    if ! command -v npm &> /dev/null; then
        echo "❌ npm 未安装"
        exit 1
    fi
    
    # 检查 git
    if ! command -v git &> /dev/null; then
        echo "❌ Git 未安装"
        echo "请先安装 Git: https://git-scm.com/"
        exit 1
    fi
    
    echo "✅ 系统要求检查通过"
    echo "   Node.js: $(node -v)"
    echo "   npm: $(npm -v)"
    echo "   Git: $(git --version | cut -d' ' -f3)"
}

# 创建项目目录
setup_project() {
    echo ""
    echo "📁 创建项目目录..."
    
    read -p "请输入项目名称 (默认: colorcraft-pro): " PROJECT_NAME
    PROJECT_NAME=${PROJECT_NAME:-colorcraft-pro}
    
    if [ -d "$PROJECT_NAME" ]; then
        echo "⚠️  目录 $PROJECT_NAME 已存在"
        read -p "是否删除并重新创建? (y/N): " CONFIRM
        if [[ $CONFIRM =~ ^[Yy]$ ]]; then
            rm -rf "$PROJECT_NAME"
        else
            echo "❌ 安装取消"
            exit 1
        fi
    fi
    
    mkdir "$PROJECT_NAME"
    cd "$PROJECT_NAME"
    echo "✅ 项目目录创建成功: $PROJECT_NAME"
}

# 初始化项目
init_project() {
    echo ""
    echo "🚀 初始化项目..."
    
    # 创建 package.json
    cat > package.json << 'EOF'
{
  "name": "colorcraft-pro",
  "version": "1.0.0",
  "description": "Professional online color picker and palette generator for designers",
  "private": false,
  "homepage": "https://yourusername.github.io/colorcraft-pro",
  "dependencies": {
    "@types/node": "^18.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "lucide-react": "^0.263.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "typescript": "^4.9.5",
    "web-vitals": "^3.3.2"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  },
  "keywords": [
    "color-picker",
    "palette-generator",
    "design-tools",
    "hex-colors",
    "rgb-converter",
    "web-development",
    "ui-design"
  ],
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "devDependencies": {
    "autoprefixer": "^10.4.14",
    "gh-pages": "^5.0.0",
    "postcss": "^8.4.24",
    "tailwindcss": "^3.3.0"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
EOF

    echo "✅ package.json 创建完成"
}

# 创建目录结构
create_structure() {
    echo ""
    echo "📂 创建项目结构..."
    
    # 创建目录
    mkdir -p public src/components src/hooks src/utils src/types docs
    
    # 创建 public 文件
    create_public_files
    
    # 创建 src 文件
    create_src_files
    
    # 创建配置文件
    create_config_files
    
    echo "✅ 项目结构创建完成"
}

# 创建 public 文件
create_public_files() {
    # index.html
    cat > public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#3B82F6" />
    
    <title>ColorCraft Pro - Professional Online Color Picker & Palette Generator</title>
    <meta name="description" content="Free online color picker and palette generator for designers. Convert HEX, RGB, HSL colors instantly. Generate complementary color schemes with accessibility checker." />
    <meta name="keywords" content="color picker, color palette generator, hex to rgb, color wheel, design tools, accessibility contrast" />
    
    <meta property="og:title" content="ColorCraft Pro - Professional Color Tools for Designers" />
    <meta property="og:description" content="Create perfect color palettes with our professional online tools. Free color picker, palette generator, and accessibility checker." />
    <meta property="og:type" content="website" />
    
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
EOF

    # manifest.json
    cat > public/manifest.json << 'EOF'
{
  "short_name": "ColorCraft Pro",
  "name": "ColorCraft Pro - Professional Color Tools",
  "description": "Professional online color picker and palette generator for designers",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#3B82F6",
  "background_color": "#ffffff"
}
EOF

    # robots.txt
    cat > public/robots.txt << 'EOF'
User-agent: *
Allow: /

Sitemap: https://yourusername.github.io/colorcraft-pro/sitemap.xml
EOF

    # 创建一个简单的 favicon
    echo "📝 请记得添加 favicon.ico 到 public 目录"
}

# 创建 src 文件
create_src_files() {
    # index.tsx
    cat > src/index.tsx << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
EOF

    # index.css
    cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #fafafa;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
EOF

    # reportWebVitals.ts
    cat > src/reportWebVitals.ts << 'EOF'
import { ReportHandler } from 'web-vitals';

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
EOF

    # types
    cat > src/types/color.ts << 'EOF'
export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface HSLColor {
  h: number;
  s: number;
  l: number;
}

export interface ColorFormat {
  hex: string;
  rgb: RGBColor;
  hsl: HSLColor;
}

export type PaletteType = 'complementary' | 'triadic' | 'monochromatic' | 'analogous' | 'tetradic';

export interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
  type: PaletteType;
  createdAt: Date;
}

export interface ColorHistory {
  color: string;
  timestamp: Date;
}
EOF

    echo "📝 需要手动创建以下文件:"
    echo "   - src/App.tsx (主组件)"
    echo "   - src/utils/colorUtils.ts (工具函数)"
}

# 创建配置文件
create_config_files() {
    # tsconfig.json
    cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "es6"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": [
    "src"
  ]
}
EOF

    # tailwind.config.js
    cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
EOF

    # postcss.config.js
    cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

    # .gitignore
    cat > .gitignore << 'EOF'
/node_modules
/.pnp
.pnp.js
/coverage
/build
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.vscode/
.idea/
*.swp
*.swo
Thumbs.db
EOF
}

# 安装依赖
install_dependencies() {
    echo ""
    echo "📦 安装项目依赖..."
    echo "这可能需要几分钟时间，请耐心等待..."
    
    npm install --silent
    
    if [ $? -eq 0 ]; then
        echo "✅ 依赖安装成功"
    else
        echo "❌ 依赖安装失败"
        exit 1
    fi
}

# 初始化 Git
init_git() {
    echo ""
    echo "🔧 初始化 Git 仓库..."
    
    git init
    git add .
    git commit -m "🎉 Initial commit: ColorCraft Pro project setup"
    
    echo "✅ Git 仓库初始化完成"
}

# 显示下一步操作
show_next_steps() {
    echo ""
    echo "🎉 ColorCraft Pro 项目创建成功！"
    echo "================================"
    echo ""
    echo "📝 下一步操作："
    echo "1. 进入项目目录:"
    echo "   cd $PROJECT_NAME"
    echo ""
    echo "2. 创建 src/App.tsx 和 src/utils/colorUtils.ts 文件"
    echo "   (可以从提供的代码示例中复制)"
    echo ""
    echo "3. 启动开发服务器:"
    echo "   npm start"
    echo ""
    echo "4. 在浏览器中访问:"
    echo "   http://localhost:3000"
    echo ""
    echo "🚀 部署到 GitHub Pages:"
    echo "1. 在 GitHub 创建新仓库"
    echo "2. 添加远程仓库:"
    echo "   git remote add origin https://github.com/yourusername/colorcraft-pro.git"
    echo "3. 推送代码:"
    echo "   git push -u origin main"
    echo "4. 部署:"
    echo "   npm run deploy"
    echo ""
    echo "📚 完整文档和代码示例："
    echo "   https://github.com/yourusername/colorcraft-pro-template"
    echo ""
    echo "❤️  感谢使用 ColorCraft Pro！"
}

# 主函数
main() {
    check_requirements
    setup_project
    init_project
    create_structure
    install_dependencies
    init_git
    show_next_steps
}

# 运行主函数
main "$@"
