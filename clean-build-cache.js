// 清理构建缓存脚本
// 使用方法: node clean-build-cache.js

const fs = require('fs');
const path = require('path');

const dirsToClean = [
  '.astro',
  '.vite',
  'dist',
  '.tsbuildinfo'
];

dirsToClean.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (fs.existsSync(dirPath)) {
    console.log(`Cleaning ${dir}...`);
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(`✅ ${dir} cleaned.`);
  } else {
    console.log(`⚠️ ${dir} does not exist, skipping.`);
  }
});

console.log('🎉 Build cache cleaned successfully!');