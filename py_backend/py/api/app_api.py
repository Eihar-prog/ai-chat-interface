"""
API точки для взаимодействия с веб-интерфейсом
Обрабатывает вызовы из JavaScript через pywebview
"""

import webview


class AppAPI:
    def __init__(self):
        """Инициализация API сервисов"""
        self._window: webview.Window = None  # type: ignore
        # self.config_manager = ConfigManager()

    def set_window(self, window: webview.Window) -> None:
        """Установка ссылки на окно pywebview для диалогов и событий"""
        self._window = window
