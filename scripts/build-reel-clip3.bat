@echo off
setlocal
set ROOT=%~dp0..
set SRC=%ROOT%\temp\videos\clip-3.mp4
set OUTDIR=%ROOT%\public\media\reels
set WORK=%ROOT%\temp\reel-build
set FONT=C:/Windows/Fonts/arial.ttf
set FONTB=C:/Windows/Fonts/arialbd.ttf

if not exist "%OUTDIR%" mkdir "%OUTDIR%"
if not exist "%WORK%" mkdir "%WORK%"

echo [1/6] Intro slide...
ffmpeg -y -f lavfi -i color=c=0xede8f5:s=1080x1920:d=3:r=30 ^
  -vf "drawtext=fontfile=%FONTB%:text='Let the voices be heard':fontsize=64:fontcolor=0x1a6b5c:x=(w-text_w)/2:y=780,drawtext=fontfile=%FONT%:text='with Nayab Tahir':fontsize=48:fontcolor=0x4a6358:x=(w-text_w)/2:y=880,drawtext=fontfile=%FONT%:text='Registered Psychotherapist | Ontario':fontsize=36:fontcolor=0x6b4a8a:x=(w-text_w)/2:y=980,drawtext=fontfile=%FONT%:text='nayab.life':fontsize=40:fontcolor=0xc49a3c:x=(w-text_w)/2:y=1100" ^
  -c:v libx264 -pix_fmt yuv420p -an "%WORK%\01-intro.mp4"

echo [2/6] Main clip (HD upscale)...
ffmpeg -y -i "%SRC%" ^
  -vf "scale=1080:1920:flags=lanczos,unsharp=5:5:0.4:5:5:0.0,drawtext=fontfile=%FONT%:text='nayab.life':fontsize=28:fontcolor=white@0.85:x=40:y=h-80:shadowcolor=black@0.4:shadowx=2:shadowy=2" ^
  -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a aac -b:a 128k -ar 44100 "%WORK%\02-main.mp4"

echo [3/6] B-roll slides...
set IMG1=%ROOT%\public\images\custom\nayab-about.webp
set IMG2=%ROOT%\public\images\therapy-session.webp
set IMG3=%ROOT%\public\images\custom\healing-growth-icon.jpeg

ffmpeg -y -loop 1 -i "%IMG1%" -t 2.5 -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0xf0f7f4,drawtext=fontfile=%FONTB%:text='A safe space to heal':fontsize=52:fontcolor=0x1a6b5c:x=(w-text_w)/2:y=120:shadowcolor=white@0.5:shadowx=1:shadowy=1" -r 30 -c:v libx264 -pix_fmt yuv420p -an "%WORK%\03-slide1.mp4"

ffmpeg -y -loop 1 -i "%IMG2%" -t 2.5 -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,drawtext=fontfile=%FONTB%:text='Trauma-informed care':fontsize=52:fontcolor=white:x=(w-text_w)/2:y=120:shadowcolor=black@0.5:shadowx=2:shadowy=2" -r 30 -c:v libx264 -pix_fmt yuv420p -an "%WORK%\04-slide2.mp4"

ffmpeg -y -loop 1 -i "%IMG3%" -t 2.5 -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0xf5ebe8,drawtext=fontfile=%FONTB%:text='Grow with resilience':fontsize=52:fontcolor=0x6b4a8a:x=(w-text_w)/2:y=120" -r 30 -c:v libx264 -pix_fmt yuv420p -an "%WORK%\05-slide3.mp4"

echo [4/6] Outro slide...
ffmpeg -y -f lavfi -i color=c=0x1a6b5c:s=1080x1920:d=4:r=30 ^
  -vf "drawtext=fontfile=%FONTB%:text='Ready to take the first step?':fontsize=56:fontcolor=white:x=(w-text_w)/2:y=760,drawtext=fontfile=%FONT%:text='Book a free consultation':fontsize=44:fontcolor=0xf5d89a:x=(w-text_w)/2:y=880,drawtext=fontfile=%FONT%:text='voiceawareness.ca  |  nayab.life':fontsize=36:fontcolor=white@0.9:x=(w-text_w)/2:y=1000" ^
  -c:v libx264 -pix_fmt yuv420p -an "%WORK%\06-outro.mp4"

echo [5/6] Concatenate...
(
echo file '01-intro.mp4'
echo file '02-main.mp4'
echo file '03-slide1.mp4'
echo file '04-slide2.mp4'
echo file '05-slide3.mp4'
echo file '06-outro.mp4'
) > "%WORK%\list.txt"

cd /d "%WORK%"
ffmpeg -y -f concat -safe 0 -i list.txt -c:v libx264 -crf 22 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart "%OUTDIR%\reel-clip-3.mp4"

echo [6/6] Poster frame...
ffmpeg -y -i "%OUTDIR%\reel-clip-3.mp4" -vf "select=eq(n\,90)" -vframes 1 -update 1 "%OUTDIR%\reel-clip-3-poster.jpg"

echo Done: %OUTDIR%\reel-clip-3.mp4
