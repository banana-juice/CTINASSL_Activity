@echo off
title TriageHIS Client
cd /d "%~dp0Client"
echo Installing client packages...
call npm install
echo.
echo Starting client. Open the Local link below in your browser.
call npm run dev
pause
