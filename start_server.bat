@echo off
REM =============================================
REM start_server.bat — Запуск локального HTTP-сервера
REM =============================================
REM ES-модули (type="module") не работают через file://
REM Этот скрипт поднимает сервер на http://localhost:8000
REM =============================================

echo ============================================
echo  AI Chat Interface — Local Dev Server
echo ============================================
echo.
echo  Starting server at: http://localhost:8000
echo  Press Ctrl+C to stop.
echo.
echo ============================================
echo.

echo.
echo  Server is running at: http://localhost:8000
echo  Open this link in your browser.
echo  Press Ctrl+C to stop.
echo.
python -m http.server 8000

echo.
echo  Server stopped.
pause
