"""
Файл содержит пути (константы) необходимые для работы приложения
"""

from pathlib import Path

# Считаем от этого файла paths.py: вверх до utils -> до py -> до backend -> корень
BASE_DIR = Path(__file__).resolve().parents[3]
JSON_DIR = BASE_DIR / "py_backend" / "json"

# Путь к файлу конфигурации
CONFIG_PATH = JSON_DIR / "config.json"

# Путь к главному html файлу
HTML_FILE_PATH = BASE_DIR / "index.html"

# Экспортируем только то, что нужно другим модулям
__all__ = ["BASE_DIR", "HTML_FILE_PATH", "CONFIG_PATH"]
