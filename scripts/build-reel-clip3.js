#!/usr/bin/env node
/**
 * Builds reel-clip-3.mp4 from temp/videos/clip-3.mp4 with intro, b-roll, outro.
 * Run: node scripts/build-reel-clip3.js
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'temp', 'videos', 'clip-3.mp4');
const WORK = path.join(ROOT, 'temp', 'reel-build');
const OUTDIR = path.join(ROOT, 'temp', 'reels');
const FONT = '../../scripts/fonts/arial.ttf';
const FONTB = '../../scripts/fonts/arialbd.ttf';

const IMG1 = path.join(ROOT, 'public', 'images', 'custom', 'nayab-about.webp');
const IMG2 = path.join(ROOT, 'public', 'images', 'therapy-session.webp');
const IMG3 = path.join(ROOT, 'public', 'images', 'custom', 'nayab-promo-vertical.jpeg');
const IMG4 = path.join(ROOT, 'public', 'images', 'custom', 'healing-growth-icon.jpeg');

function run(cmd) {
  console.log('\n>', cmd.slice(0, 120) + (cmd.length > 120 ? '…' : ''));
  execSync(cmd, { stdio: 'inherit', cwd: WORK, shell: true });
}

function q(p) {
  return `"${p.replace(/"/g, '\\"')}"`;
}

if (!fs.existsSync(SRC)) {
  console.error('Missing clip-3:', SRC);
  process.exit(1);
}

fs.mkdirSync(WORK, { recursive: true });
fs.mkdirSync(OUTDIR, { recursive: true });

const introVf = [
  `drawtext=fontfile=${FONTB}:text='Let the voices be heard':fontsize=64:fontcolor=0x1a6b5c:x=(w-text_w)/2:y=780`,
  `drawtext=fontfile=${FONT}:text='with Nayab Tahir':fontsize=48:fontcolor=0x4a6358:x=(w-text_w)/2:y=880`,
  `drawtext=fontfile=${FONT}:text='Registered Psychotherapist':fontsize=36:fontcolor=0x6b4a8a:x=(w-text_w)/2:y=970`,
  `drawtext=fontfile=${FONT}:text='nayab.life':fontsize=42:fontcolor=0xc49a3c:x=(w-text_w)/2:y=1080`,
].join(',');

run(
  `ffmpeg -y -f lavfi -i color=c=0xede8f5:s=1080x1920:d=3:r=30 -vf "${introVf}" -c:v libx264 -pix_fmt yuv420p -an ${q(path.join(WORK, '01-intro.mp4'))}`
);

run(
  `ffmpeg -y -i ${q(SRC)} -vf "scale=1080:1920:flags=lanczos,unsharp=5:5:0.35:5:5:0.0,drawtext=fontfile=${FONT}:text='nayab.life':fontsize=26:fontcolor=white@0.8:x=36:y=h-72:shadowcolor=black@0.35:shadowx=1:shadowy=1" -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a aac -b:a 128k ${q(path.join(WORK, '02-main.mp4'))}`
);

const slide = (num, img, filter, out) => {
  run(
    `ffmpeg -y -loop 1 -i ${q(img)} -t 2.5 -vf "${filter}" -r 30 -c:v libx264 -pix_fmt yuv420p -an ${q(path.join(WORK, out))}`
  );
};

slide(
  1,
  IMG1,
  `scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0xf0f7f4,drawtext=fontfile=${FONTB}:text='A safe space to heal':fontsize=52:fontcolor=0x1a6b5c:x=(w-text_w)/2:y=100`,
  '03-slide1.mp4'
);

slide(
  2,
  IMG2,
  `scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,drawtext=fontfile=${FONTB}:text='Collaborative therapy':fontsize=48:fontcolor=white:x=(w-text_w)/2:y=100:shadowcolor=black@0.45:shadowx=2:shadowy=2`,
  '04-slide2.mp4'
);

slide(
  3,
  IMG3,
  `scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0xf5ebe8,drawtext=fontfile=${FONTB}:text='Heal. Grow. Thrive.':fontsize=52:fontcolor=0x6b4a8a:x=(w-text_w)/2:y=100`,
  '05-slide3.mp4'
);

slide(
  4,
  IMG4,
  `scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0xf5ebe8,drawtext=fontfile=${FONTB}:text='Build resilience':fontsize=52:fontcolor=0x1a6b5c:x=(w-text_w)/2:y=100`,
  '06-slide4.mp4'
);

const outroVf = [
  `drawtext=fontfile=${FONTB}:text='Ready to take the first step?':fontsize=54:fontcolor=white:x=(w-text_w)/2:y=760`,
  `drawtext=fontfile=${FONT}:text='Book a free consultation':fontsize=44:fontcolor=0xf5d89a:x=(w-text_w)/2:y=880`,
  `drawtext=fontfile=${FONT}:text='voiceawareness.ca':fontsize=38:fontcolor=white@0.95:x=(w-text_w)/2:y=980`,
  `drawtext=fontfile=${FONT}:text='nayab.life':fontsize=38:fontcolor=white@0.95:x=(w-text_w)/2:y=1040`,
].join(',');

run(
  `ffmpeg -y -f lavfi -i color=c=0x1a6b5c:s=1080x1920:d=4:r=30 -vf "${outroVf}" -c:v libx264 -pix_fmt yuv420p -an ${q(path.join(WORK, '07-outro.mp4'))}`
);

const list = ['01-intro.mp4', '02-main.mp4', '03-slide1.mp4', '04-slide2.mp4', '05-slide3.mp4', '06-slide4.mp4', '07-outro.mp4']
  .map((f) => `file '${f.replace(/'/g, "'\\''")}'`)
  .join('\n');
fs.writeFileSync(path.join(WORK, 'list.txt'), list);

const outFile = path.join(OUTDIR, 'reel-clip-3.mp4');
run(
  `ffmpeg -y -f concat -safe 0 -i list.txt -c:v libx264 -crf 22 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart ${q(outFile)}`
);

run(
  `ffmpeg -y -i ${q(outFile)} -vf "select=eq(n\\,90)" -vframes 1 -update 1 ${q(path.join(OUTDIR, 'reel-clip-3-poster.jpg'))}`
);

console.log('\nReel ready:', outFile);
