import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Palette, Download, Copy, RefreshCw, Eye, Zap, Star, Menu, X } from 'lucide-react';
import { 
  hexToRgb, 
  rgbToHsl, 
  hslToHex, 
  generatePalette, 
  getContrastRatio, 
  copyToClipboard,
  isValidHex,
  generateRandomColor
} from './utils/colorUtils';
import { ColorHistory } from './types/color';

const App: React.FC = () => {
  // 主要状态管理
  const [currentColor, setCurrentColor] = useState('#3B82F6');
  const [colorHistory, setColorHistory] = useState<string[]>(['#3B82F6', '#EF4444', '#10B981', '#F59E0B']);
  const [generatedPalette, setGeneratedPalette] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'picker' | 'palette'>('picker');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notification, setNotification] = useState('');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 显示通知
  const showNotification = useCallback((message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 2000);
  }, []);

  // 复制到剪贴板的封装函数
  const handleCopyToClipboard = useCallback(async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      showNotification(`已复制: ${text}`);
    } else {
      showNotification('复制失败，请手动复制');
    }
  }, [showNotification]);

  // 更新颜色历史
  const updateColorHistory = useCallback((color: string) => {
    setColorHistory(prev => {
      const filtered = prev.filter(c => c !== color);
      return [color, ...filtered].slice(0, 8);
    });
  }, []);

  // 处理颜色变化
  const handleColorChange = useCallback((color: string) => {
    if (isValidHex(color)) {
      setCurrentColor(color);
      updateColorHistory(color);
    }
  }, [updateColorHistory]);

  // 从图片提取颜色
  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        // 提取主要颜色（简化版本）
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const colors = extractDominantColors(imageData);
        setGeneratedPalette(colors);
        setActiveTab('palette');
        showNotification('颜色提取完成！');
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, [showNotification]);

  // 提取主要颜色（简化算法）
  const extractDominantColors = useCallback((imageData: ImageData): string[] => {
    const pixels = imageData.data;
    const colorMap: { [key: string]: number } = {};
    
    // 采样像素（每10个像素采样一次以提高性能）
    for (let i = 0; i < pixels.length; i += 40) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      colorMap[hex] = (colorMap[hex] || 0) + 1;
    }

    // 返回出现频率最高的5种颜色
    return Object.entries(colorMap)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([color]) => color);
  }, []);

  // 生成调色板
  const handleGeneratePalette = useCallback((type: string = 'complementary') => {
    const palette = generatePalette(currentColor, type);
    setGeneratedPalette(palette);
    showNotification(`${type === 'complementary' ? '互补色' : type === 'triadic' ? '三色调' : '单色调'}调色板已生成`);
  }, [currentColor, showNotification]);

  // 初始化调色板
  useEffect(() => {
    setGeneratedPalette(generatePalette(currentColor, 'complementary'));
  }, [currentColor]);

  // 颜色选择器组件
  const ColorPicker: React.FC = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5" />
          智能取色器
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div 
              className="w-full h-32 rounded-lg border-2 border-gray-200 cursor-pointer transition-all hover:border-blue-400 hover:shadow-md"
              style={{ backgroundColor: currentColor }}
              onClick={() => handleCopyToClipboard(currentColor)}
              title="点击复制颜色值"
            />
            <p className="text-sm text-gray-600 mt-2 text-center">点击复制颜色值</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">HEX</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="#3B82F6"
                />
                <button
                  onClick={() => handleCopyToClipboard(currentColor)}
                  className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  title="复制HEX值"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">颜色选择器</label>
              <input
                type="color"
                value={currentColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-full h-12 rounded-md border border-gray-300 cursor-pointer"
              />
            </div>

            <div>
              <button
                onClick={() => handleColorChange(generateRandomColor())}
                className="w-full px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                随机颜色
              </button>
            </div>
          </div>
        </div>

        {/* RGB和HSL显示 */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {(() => {
            const rgb = hexToRgb(currentColor);
            const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;
            return (
              <>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">RGB: </span>
                  <span className="text-sm text-gray-600">
                    {rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : '无效颜色'}
                  </span>
                  {rgb && (
                    <button
                      onClick={() => handleCopyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
                      className="ml-2 text-blue-500 hover:text-blue-700 transition-colors"
                      title="复制RGB值"
                    >
                      <Copy className="w-3 h-3 inline" />
                    </button>
                  )}
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">HSL: </span>
                  <span className="text-sm text-gray-600">
                    {hsl ? `${hsl.h}°, ${hsl.s}%, ${hsl.l}%` : '无效颜色'}
                  </span>
                  {hsl && (
                    <button
                      onClick={() => handleCopyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
                      className="ml-2 text-blue-500 hover:text-blue-700 transition-colors"
                      title="复制HSL值"
                    >
                      <Copy className="w-3 h-3 inline" />
                    </button>
                  )}
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* 颜色历史 */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h4 className="text-md font-semibold mb-3">颜色历史</h4>
        <div className="flex gap-2 flex-wrap">
          {colorHistory.map((color, index) => (
            <button
              key={`${color}-${index}`}
              className="w-12 h-12 rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-all hover:scale-105"
              style={{ backgroundColor: color }}
              onClick={() => setCurrentColor(color)}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );

  // 调色板生成器组件
  const PaletteGenerator: React.FC = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          调色板生成器
        </h3>

        <div className="mb-6">
          <div className="flex gap-2 mb-4 flex-wrap">
            {[
              { type: 'complementary', label: '互补色' },
              { type: 'triadic', label: '三色调' },
              { type: 'monochromatic', label: '单色调' },
              { type: 'analogous', label: '相邻色' }
            ].map(({ type, label }) => (
              <button
                key={type}
                onClick={() => handleGeneratePalette(type)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => handleGeneratePalette('complementary')}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              重新生成
            </button>
          </div>

          {generatedPalette.length > 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {generatedPalette.map((color, index) => (
                  <div key={`${color}-${index}`} className="text-center">
                    <div
                      className="w-full h-20 rounded-lg border-2 border-gray-200 cursor-pointer hover:border-blue-400 transition-all hover:scale-105"
                      style={{ backgroundColor: color }}
                      onClick={() => handleCopyToClipboard(color)}
                      title={`点击复制 ${color}`}
                    />
                    <p className="text-xs text-gray-600 mt-2 font-mono">{color}</p>
                    <div className="flex justify-center gap-1 mt-1">
                      <button
                        onClick={() => handleCopyToClipboard(color)}
                        className="text-blue-500 hover:text-blue-700 text-xs transition-colors"
                        title="复制颜色"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setCurrentColor(color)}
                        className="text-green-500 hover:text-green-700 text-xs transition-colors"
                        title="设为当前颜色"
                      >
                        <Palette className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-4 border-t flex-wrap">
                <button
                  onClick={() => handleCopyToClipboard(generatedPalette.join(', '))}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  复制全部
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors text-sm flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  从图片提取
                </button>
                <button
                  onClick={() => {
                    const csv = generatedPalette.map(color => {
                      const rgb = hexToRgb(color);
                      const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;
                      return `${color},${rgb ? `${rgb.r},${rgb.g},${rgb.b}` : ''},${hsl ? `${hsl.h},${hsl.s},${hsl.l}` : ''}`;
                    }).join('\n');
                    const blob = new Blob([`HEX,R,G,B,H,S,L\n${csv}`], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'color-palette.csv';
                    a.click();
                    URL.revokeObjectURL(url);
                    showNotification('调色板已导出为CSV');
                  }}
                  className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-sm flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  导出CSV
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 无障碍检测 */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h4 className="text-md font-semibold mb-3">无障碍对比度检测</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border" style={{ backgroundColor: currentColor, color: '#ffffff' }}>
            <p className="font-medium">白色文字示例</p>
            <p className="text-sm">对比度: {getContrastRatio(currentColor, '#ffffff').toFixed(2)}</p>
            <p className="text-xs">
              {getContrastRatio(currentColor, '#ffffff') >= 4.5 ? '✅ WCAG AA 通过' : '❌ 对比度不足'}
            </p>
            <p className="text-xs">
              {getContrastRatio(currentColor, '#ffffff') >= 7 ? '🌟 WCAG AAA 通过' : ''}
            </p>
          </div>
          <div className="p-4 rounded-lg border" style={{ backgroundColor: currentColor, color: '#000000' }}>
            <p className="font-medium">黑色文字示例</p>
            <p className="text-sm">对比度: {getContrastRatio(currentColor, '#000000').toFixed(2)}</p>
            <p className="text-xs">
              {getContrastRatio(currentColor, '#000000') >= 4.5 ? '✅ WCAG AA 通过' : '❌ 对比度不足'}
            </p>
            <p className="text-xs">
              {getContrastRatio(currentColor, '#000000') >= 7 ? '🌟 WCAG AAA 通过' : ''}
            </p>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 顶部导航 */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ColorCraft Pro</h1>
                <p className="text-xs text-gray-500">专业设计师的颜色创作工具箱</p>
              </div>
            </div>

            {/* 桌面端导航 */}
            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => setActiveTab('picker')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'picker' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                取色器
              </button>
              <button
                onClick={() => setActiveTab('palette')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'palette' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                调色板
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all flex items-center gap-2">
                <Star className="w-4 h-4" />
                升级 Pro
              </button>
            </div>

            {/* 移动端菜单按钮 */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* 移动端菜单 */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-2 space-y-2">
              <button
                onClick={() => { setActiveTab('picker'); setIsMenuOpen(false); }}
                className={`block w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'picker' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                取色器
              </button>
              <button
                onClick={() => { setActiveTab('palette'); setIsMenuOpen(false); }}
                className={`block w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'palette' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                调色板
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* 主要内容区 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero 区域 */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            专业的在线颜色工具箱
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            为设计师和开发者提供强大的颜色选择、调色板生成和色彩分析工具。完全免费，无需注册。
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              ✨ 智能颜色提取
            </span>
            <span className="flex items-center gap-2">
              🎨 多种调色板算法
            </span>
            <span className="flex items-center gap-2">
              ♿ 无障碍对比度检测
            </span>
            <span className="flex items-center gap-2">
              📱 响应式设计
            </span>
          </div>
        </div>

        {/* 工具内容 */}
        <div className="mb-8">
          {activeTab === 'picker' && <ColorPicker />}
          {activeTab === 'palette' && <PaletteGenerator />}
        </div>

        {/* 特性介绍 */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            为什么选择 ColorCraft Pro？
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">智能算法</h4>
              <p className="text-gray-600">基于色彩理论的智能调色板生成算法，确保色彩搭配的专业性和美观度。</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">无障碍友好</h4>
              <p className="text-gray-600">内置WCAG无障碍对比度检测，确保您的设计符合可访问性标准。</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Download className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">一键导出</h4>
              <p className="text-gray-600">支持多种格式导出，轻松集成到您的设计工作流程中。</p>
            </div>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">ColorCraft Pro</span>
              </div>
              <p className="text-gray-400 mb-4">
                专业设计师的颜色创作工具箱，提供最先进的颜色处理和分析功能。
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">工具</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">颜色选择器</a></li>
                <li><a href="#" className="hover:text-white transition-colors">调色板生成器</a></li>
                <li><a href="#" className="hover:text-white transition-colors">颜色格式转换</a></li>
                <li><a href="#" className="hover:text-white transition-colors">对比度检测</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">资源</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">使用教程</a></li>
                <li><a href="#" className="hover:text-white transition-colors">设计指南</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API 文档</a></li>
                <li><a href="#" className="hover:text-white transition-colors">博客</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">支持</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">帮助中心</a></li>
                <li><a href="#" className="hover:text-white transition-colors">联系我们</a></li>
                <li><a href="#" className="hover:text-white transition-colors">隐私政策</a></li>
                <li><a href="#" className="hover:text-white transition-colors">使用条款</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2025 ColorCraft Pro. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <span className="text-gray-400 text-sm">Made with ❤️ for designers</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* 通知消息 */}
      {notification && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-slide-up">
          {notification}
        </div>
      )}

      {/* SEO 优化的隐藏内容 */}
      <div className="sr-only">
        <h1>ColorCraft Pro - 专业在线颜色工具箱</h1>
        <p>免费的在线颜色选择器和调色板生成器，为设计师和开发者提供专业的颜色工具。支持HEX、RGB、HSL格式转换，无障碍对比度检测，智能调色板生成。</p>
        <ul>
          <li>在线颜色选择器 - color picker online</li>
          <li>调色板生成器 - color palette generator</li>
          <li>颜色格式转换 - hex to rgb converter</li>
          <li>无障碍对比度检测 - accessibility contrast checker</li>
          <li>从图片提取颜色 - extract colors from image</li>
        </ul>
      </div>
    </div>
  );
};

export default App;
