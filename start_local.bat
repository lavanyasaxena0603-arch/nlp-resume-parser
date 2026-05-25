@echo off
echo ==================================================
echo 🚀 Starting ResumeAI Local Live Server
echo ==================================================
echo.
echo [1/3] Copying project to local temp folder (bypassing Google Drive locks)...
robocopy "%~dp0." "C:\Users\%USERNAME%\resume_parser_temp" /MIR /XD node_modules .git /NFL /NDL /NJH /NJS

echo.
echo [2/3] Installing Node.js packages...
cd /d "C:\Users\%USERNAME%\resume_parser_temp"
call npm install --no-audit --no-fund

echo.
echo [3/3] Starting server and opening browser...
start http://localhost:3000
node server.js

pause
