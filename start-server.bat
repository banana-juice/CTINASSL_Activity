@echo off
title TriageHIS Server
cd /d "%~dp0Server"
echo Installing server packages...
call npm install
echo.
echo Starting server (needs MongoDB running on localhost:27017)...
call npm run dev
pause
