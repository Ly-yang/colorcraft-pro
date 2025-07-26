# colorcraft-pro
专业颜色工具箱（取色器、调色板生成器、格式转换、无障碍检测）

# ColorCraft Pro 完整项目创建指南

## 🚀 快速开始（推荐）

### 方法一：一键安装脚本
```bash
# 下载并运行安装脚本
curl -fsSL https://raw.githubusercontent.com/yourusername/colorcraft-pro/main/install.sh | bash

# 或者如果你已经下载了脚本
chmod +x install.sh
./install.sh
```

### 方法二：手动创建（完整步骤）

## 📋 前置要求

- Node.js 14+ 
- npm 6+
- Git
- 现代浏览器

## 🛠 完整创建步骤

### 1. 创建项目目录
```bash
mkdir colorcraft-pro
cd colorcraft-pro
```

### 2. 创建 package.json
```bash
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
    "design-tools"
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
    "production": [">0.2%", "not dead", "not op_mini all"],
    "development": ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
  }
}
EOF
```

### 3. 创建目录结构
```bash
mkdir -p public src/components src/hooks src/utils src/types
```

### 4. 创建配置文件

#### tsconfig.json
```bash
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
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
  "include": ["src"]
}
EOF
```

#### tailwind.config.js
```bash
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
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
```

#### postcss.config.js
```bash
cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF
```

### 5. 创建 public 文件

#### public/index.html
```bash
cat > public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#3B82F6" />
    
    <title>ColorCraft Pro - Professional Online Color Picker & Palette Generator</title>
    <meta name="description" content="Free online color picker and palette generator for designers. Convert HEX, RGB, HSL colors instantly." />
    <meta name="keywords" content="color picker, color palette generator, hex to rgb, design tools" />
    
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
```

#### public/manifest.json
```bash
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
```

#### public/robots.txt
```bash
cat > public/robots.txt << 'EOF'
User-agent: *
Allow: /
EOF
```

### 6. 创建源代码文件

#### src/index.tsx
```bash
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
```

#### src/index.css
```bash
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
```

#### src/reportWebVitals.ts
```bash
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
```

#### src/types/color.ts
```bash
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

export type PaletteType = 'complementary' | 'triadic' | 'monochromatic' | 'analogous';

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
```

#### src/utils/colorUtils.ts
```bash
cat > src/utils/colorUtils.ts << 'EOF'
import { RGBColor, HSLColor } from '../types/color';

export const hexToRgb = (hex: string): RGBColor | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${[r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('')}`;
};

export const rgbToHsl = (r: number, g: number, b: number): HSLColor => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h: number, s: number;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
};

export const hslToRgb = (h: number, s: number, l: number): RGBColor => {
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
};

export const hslToHex = (h: number, s: number, l: number): string => {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
};

export const getLuminance = (r: number, g: number, b: number): number => {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

export const getContrastRatio = (color1: string, color2: string): number => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 1;
  
  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

export const isValidHex = (hex: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
};

export const generateRandomColor = (): string => {
  return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
};

export const generatePalette = (baseColor: string, type: string = 'complementary'): string[] => {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return [baseColor];

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  let colors: string[] = [];

  switch (type) {
    case 'complementary':
      colors = [
        baseColor,
        hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
        hslToHex(hsl.h, Math.max(20, hsl.s - 30), Math.min(80, hsl.l + 20)),
        hslToHex((hsl.h + 180) % 360, Math.max(20, hsl.s - 30), Math.min(80, hsl.l + 20)),
        hslToHex(hsl.h, Math.min(100, hsl.s + 20), Math.max(20, hsl.l - 20))
      ];
      break;
    case 'triadic':
      colors = [
        baseColor,
        hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l),
        hslToHex(hsl.h, Math.max(20, hsl.s - 20), Math.min(90, hsl.l + 10)),
        hslToHex((hsl.h + 60) % 360, hsl.s, hsl.l)
      ];
      break;
    case 'monochromatic':
      colors = [
        hslToHex(hsl.h, hsl.s, Math.min(95, hsl.l + 40)),
        hslToHex(hsl.h, hsl.s, Math.min(85, hsl.l + 20)),
        baseColor,
        hslToHex(hsl.h, hsl.s, Math.max(10, hsl.l - 20)),
        hslToHex(hsl.h, hsl.s, Math.max(5, hsl.l - 40))
      ];
      break;
    case 'analogous':
      colors = [
        hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h - 15 + 360) % 360, hsl.s, hsl.l),
        baseColor,
        hslToHex((hsl.h + 15) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l)
      ];
      break;
    default:
      colors = [baseColor];
  }

  return colors;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
};
EOF
```

### 7. 创建 src/App.tsx
**重要：** 将我之前提供的完整 App.tsx 组件代码复制到这个文件中。

### 8. 创建 .gitignore
```bash
cat > .gitignore << 'EOF'
# Dependencies
/node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Production
/build

# Misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
Thumbs.db
EOF
```

### 9. 安装依赖
```bash
npm install
```

### 10. 启动开发服务器
```bash
npm start
```

## 🚀 部署到 GitHub Pages

### 1. 在 GitHub 创建仓库
1. 访问 [GitHub](https://github.com)
2. 点击 "New repository"
3. 仓库名称：`colorcraft-pro`
4. 选择 Public
5. 不要初始化 README（我们已经有了）

### 2. 连接本地仓库到 GitHub
```bash
# 初始化 Git（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "🎉 Initial commit: ColorCraft Pro"

# 添加远程仓库
git remote add origin https://github.com/yourusername/colorcraft-pro.git

# 推送到 GitHub
git push -u origin main
```

### 3. 部署到 GitHub Pages
```bash
# 部署
npm run deploy
```

### 4. 配置 GitHub Pages
1. 在 GitHub 仓库页面，点击 "Settings"
2. 滚动到 "Pages" 部分
3. 在 "Source" 下选择 "Deploy from a branch"
4. 选择 "gh-pages" 分支
5. 点击 "Save"

## ✅ 验证部署

1. **本地验证**
   - 访问 `http://localhost:3000`
   - 测试所有功能

2. **线上验证**
   - 访问 `https://yourusername.github.io/colorcraft-pro`
   - 确认所有功能正常

## 🎯 成功指标

- ✅ 项目可以正常启动
- ✅ 颜色选择器功能正常
- ✅ 调色板生成功能正常
- ✅ 响应式设计在移动端正常
- ✅ 可以成功部署到 GitHub Pages

## 🔧 故障排除

### 常见问题

1. **npm install 失败**
   ```bash
   # 清除缓存
   npm cache clean --force
   # 删除 node_modules 重新安装
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **TypeScript 编译错误**
   ```bash
   # 检查 TypeScript 配置
   npx tsc --noEmit
   ```

3. **部署失败**
   ```bash
   # 检查 homepage 设置
   # 确保 package.json 中的 homepage 字段正确
   ```

4. **样式不显示**
   ```bash
   # 重新生成 Tailwind CSS
   npx tailwindcss -i ./src/index.css -o ./src/output.css --watch
   ```

## 📝 自定义配置

### 修改项目名称
1. 更新 `package.json` 中的 `name` 字段
2. 更新 `public/index.html` 中的标题
3. 更新 `public/manifest.json` 中的名称

### 修改主题颜色
1. 编辑 `tailwind.config.js` 中的 `colors` 配置
2. 更新 `public/index.html` 中的 `theme-color`
3. 更新组件中的颜色类名

### 添加新功能
1. 在 `src/components` 目录下创建新组件
2. 在 `src/utils` 目录下添加工具函数
3. 更新 `src/App.tsx` 集成新功能

## 🎉 恭喜！

您已经成功创建了一个完整的 ColorCraft Pro 项目！

**项目特点：**
- ✨ 现代化的 React + TypeScript 架构
- 🎨 专业的颜色处理算法
- 📱 完全响应式设计
- ♿ 无障碍友好
- 🚀 一键部署到 GitHub Pages
- 💰 具备商业化潜力

