const fs = require('fs');
const content = fs.readFileSync('C:\\Users\\moham\\.gemini\\antigravity\\brain\\7fbd4b90-cec1-442c-ac5b-9998adca5f88\\.system_generated\\steps\\23\\content.md', 'utf8');

const ogImages = [...content.matchAll(/<meta property="og:image" content="([^"]+)"/g)].map(m => m[1]);
console.log('OG images:', ogImages);

// Check poster element
const posterMatch = content.match(/class="poster[^"]*"[^>]*src="([^"]+)"/i) || content.match(/src="([^"]+)"[^>]*class="poster[^"]*"/i);
console.log('Poster match:', posterMatch ? posterMatch[1] : null);

// Check backdrop element or style
const backdropMatch = content.match(/backdrop[^"]*background-image:\s*url\(([^)]+)\)/i) || content.match(/data-src="([^"]+)"[^>]*class="backdrop/i);
console.log('Backdrop match:', backdropMatch ? backdropMatch[1] : null);

const allImages = [...content.matchAll(/https?:\/\/(?:media|image)\.themoviedb\.org\/t\/p\/[^\/\s"']+\/([^\/\s"']+\.(?:jpg|png|webp))/gi)].map(m => m[1]);
console.log('All TMDB image filenames (unique):', [...new Set(allImages)]);
