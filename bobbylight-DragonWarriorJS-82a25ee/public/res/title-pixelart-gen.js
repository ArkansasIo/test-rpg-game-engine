// Elders of the Ashen Realm - Pixel Art Title Generator
// This script generates a simple pixel-art style PNG for the game title.
// To use: run in a browser console or Node.js with canvas support.

const canvas = document.createElement('canvas');
canvas.width = 320;
canvas.height = 64;
const ctx = canvas.getContext('2d');

// Background
ctx.fillStyle = '#181818';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Pixel-art font (blocky, gold)
ctx.font = 'bold 32px monospace';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillStyle = '#e6c97b';
ctx.shadowColor = '#fff6b0';
ctx.shadowBlur = 8;
ctx.fillText('Elders of the', canvas.width/2, 22);
ctx.fillText('Ashen Realm', canvas.width/2, 50);
ctx.shadowBlur = 0;

// Border
ctx.strokeStyle = '#bfae6a';
ctx.lineWidth = 2;
ctx.strokeRect(2, 2, canvas.width-4, canvas.height-4);

// Export as PNG
const url = canvas.toDataURL('image/png');
// For browser: open in new tab
document.body.appendChild(canvas);
// For Node.js: use fs.writeFileSync with Buffer.from(url.split(",")[1], 'base64')
