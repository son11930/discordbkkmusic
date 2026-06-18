@echo off
title Discord Music Bot Manager
color 0A

:: ตั้งค่า IP และ Username ของ VPS คุณ
set IP=45.136.254.62
set USER=root
set DIR=/root/discordbkkmusic

:menu
cls
echo ===================================================
echo            DISCORD MUSIC BOT MANAGER
echo ===================================================
echo.
echo   [1] Update ^& Restart (Pull latest code and restart)
echo   [2] Start Bot
echo   [3] Stop Bot
echo   [4] Restart Bot
echo   [5] View Logs
echo   [6] Exit
echo.
echo ===================================================
set /p choice="Select an option (1-6): "

if "%choice%"=="1" goto update
if "%choice%"=="2" goto start
if "%choice%"=="3" goto stop
if "%choice%"=="4" goto restart
if "%choice%"=="5" goto logs
if "%choice%"=="6" goto end

goto menu

:update
cls
echo [INFO] Connecting to %USER%@%IP% to update...
echo ---------------------------------------------------
ssh -t %USER%@%IP% "cd %DIR% && echo '[-] Pulling latest code...' && git reset --hard HEAD && git pull origin main && echo '[-] Installing dependencies...' && npm install && echo '[-] Deploying slash commands...' && npm run deploy && echo '[-] Restarting bot...' && pm2 restart ecosystem.config.js && echo '' && echo '[OK] Bot Updated & Restarted Successfully!'"
echo ---------------------------------------------------
pause
goto menu

:start
cls
echo [INFO] Starting bot...
ssh -t %USER%@%IP% "cd %DIR% && pm2 start ecosystem.config.js && pm2 save"
pause
goto menu

:stop
cls
echo [INFO] Stopping bot...
ssh -t %USER%@%IP% "cd %DIR% && pm2 stop ecosystem.config.js"
pause
goto menu

:restart
cls
echo [INFO] Restarting bot...
ssh -t %USER%@%IP% "cd %DIR% && pm2 restart ecosystem.config.js"
pause
goto menu

:logs
cls
echo [INFO] Streaming logs (Press Ctrl+C to exit log view)...
ssh -t %USER%@%IP% "pm2 logs"
pause
goto menu

:end
exit
