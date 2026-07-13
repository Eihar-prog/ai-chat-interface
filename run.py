"""
Точка входа в приложение AI Chat Interface
Инициализирует pywebview и запускает веб-интерфейс с локальным сервером
"""

import sys

import webview
from dotenv import load_dotenv

from py_backend.py.api.app_api import AppAPI
from py_backend.py.utils.paths import HTML_FILE_PATH

# Загрузка api ключей в окружение
load_dotenv()

# Установка UTF-8 для корректного вывода кириллицы в консоль Windows.
sys.stdout.reconfigure(encoding="utf-8")  # type: ignore


def setup_webview() -> webview.Window | None:
    """Настройка параметров окна pywebview"""
    window = webview.create_window(
        title="Whisper Pro",
        url=str(HTML_FILE_PATH),
        width=1250,
        height=850,
        min_size=(900, 700),
        background_color="#0F172A",
        confirm_close=False,
    )

    return window


def main():
    """Основная функция запуска приложения"""
    api = AppAPI()
    window = setup_webview()
    if window:
        window._js_api = api
        api.set_window(window)
        webview.start(debug=True)
    else:
        print("Ошибка инициализации webview")


if __name__ == "__main__":
    main()
