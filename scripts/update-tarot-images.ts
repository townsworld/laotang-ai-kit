/**
 * 批量更新 tarotData.ts 中的 image 字段
 * 
 * 使用方法：
 * npx ts-node scripts/update-tarot-images.ts
 */

const fs = require('fs');
const path = require('path');

const tarotDataPath = path.join(process.cwd(), 'app/kits/tarot-divination/constants/tarotData.ts');

function updateTarotData() {
  let content = fs.readFileSync(tarotDataPath, 'utf-8');
  
  // 为每张牌添加 image 字段
  for (let i = 0; i <= 21; i++) {
    const cardId = `major-${i}`;
    const imagePath = `/images/tarot/${cardId}.png`;
    
    // 查找该牌的定义，在 whisper 字段后添加 image 字段
    const pattern = new RegExp(`(id: '${cardId}'[\\s\\S]*?whisper: '[^']*',)`, 'g');
    content = content.replace(pattern, `$1\n    image: '${imagePath}',`);
  }
  
  fs.writeFileSync(tarotDataPath, content, 'utf-8');
  console.log('✅ Updated tarotData.ts with image paths');
}

updateTarotData();

