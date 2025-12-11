/**
 * Generate PWA icons from SVG
 * Usage: node scripts/generate-icons.mjs
 */

import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join } from 'path';

const svgPath = join(process.cwd(), 'scripts', 'icon.svg');
const publicDir = join(process.cwd(), 'public');

// Icon sizes to generate
const sizes = [
  { name: 'icon-192x192.png', size: 192 },
  { name: 'icon-256x256.png', size: 256 },
  { name: 'icon-384x384.png', size: 384 },
  { name: 'icon-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 }
];

async function generateIcons() {
  const svgBuffer = readFileSync(svgPath);
  
  console.log('🎨 Generating PWA icons from SVG...\n');

  for (const { name, size } of sizes) {
    const outputPath = join(publicDir, name);
    
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    
    console.log(`✅ Generated: ${name} (${size}x${size})`);
  }

  // Generate favicon.ico (32x32)
  await sharp(svgBuffer)
    .resize(32, 32)
    .toFormat('png')
    .toFile(join(publicDir, 'favicon-32x32.png'));
  
  console.log(`✅ Generated: favicon-32x32.png (32x32)`);

  // Generate favicon.ico (16x16)
  await sharp(svgBuffer)
    .resize(16, 16)
    .toFormat('png')
    .toFile(join(publicDir, 'favicon-16x16.png'));
  
  console.log(`✅ Generated: favicon-16x16.png (16x16)`);

  console.log('\n✨ All icons generated successfully!');
  console.log('\n📝 Note: You can use https://realfavicongenerator.net/ to convert PNG to .ico if needed');
}

generateIcons().catch(console.error);
