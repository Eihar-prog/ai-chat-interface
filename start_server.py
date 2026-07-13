#!/usr/bin/env python3
"""
start_server.py — Запуск локального HTTP-сервера для разработки.

ES-модули (type="module") не работают через file:// протокол в браузере.
Этот скрипт поднимает простой HTTP-сервер, чтобы всё работало.

Использование:
    python start_server.py

После запуска открой в браузере: http://localhost:8000
Нажми Ctrl+C чтобы остановить сервер.
"""

import http.server
import socketserver
import webbrowser
import threading

PORT = 8000
HOST = 'localhost'


def open_browser():
    """Автоматически открыть браузер после запуска сервера."""
    webbrowser.open(f'http://{HOST}:{PORT}/index.html')


if __name__ == '__main__':
    handler = http.server.SimpleHTTPRequestHandler

    with socketserver.TCPServer((HOST, PORT), handler) as httpd:
        print('=' * 50)
        print('  AI Chat Interface — Local Dev Server')
        print('=' * 50)
        print(f'\n  🌐 http://{HOST}:{PORT}/index.html\n')
        print('  Нажми Ctrl+C чтобы остановить сервер\n')
        print('=' * 50)

        # Открыть браузер автоматически через 0.5 сек
        threading.Timer(0.5, open_browser).start()

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print('\nСервер остановлен.')
