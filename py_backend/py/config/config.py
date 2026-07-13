"""
Файл для чтения и сохранения настроек конфигурации.
"""

import json
import os
from typing import Any

from py_backend.py.utils.paths import CONFIG_PATH


class ConfigManager:
    def __init__(self) -> None:
        """Инициализация менеджера настроек"""
        # Путь к файлу настроек
        self.config_path = CONFIG_PATH
        self.data = self.load()

    def load(self) -> dict[str, Any]:
        """
        Загружает конфиг из файла если файл не пустой
        Returns:
            dict: Загруженные настройки, пустой словарь при ошибке
        """
        if not os.path.exists(self.config_path):
            print("Config file not found. Creating default...")
            self.save({})
            return {}
        try:
            with open(self.config_path, "r", encoding="utf-8") as f:
                loaded_data = json.load(f)
                return {**loaded_data}
        except Exception as e:
            print(f"Error loading config: {e}. Using defaults.")
            return {}

    def save(self, data=None) -> None:
        """
        Сохранить настройки в файл
        Args:
            data: Данные для сохранения, если None - сохраняет self.data
        """
        if data is None:
            data = self.data
        try:
            with open(self.config_path, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=4, ensure_ascii=False)
            print("Config saved successfully.")
        except Exception as e:
            print(f"Error saving config: {e}")

    def get(self, key, default=None) -> Any | None:
        """
        Получить значение настройки
        Args:
            key: Ключ настройки
            default: Значение по умолчанию
        Returns:
            Значение настройки или default
        """
        val = self.data.get(key, default)
        # if isinstance(val, dict) and "model" in val:
        #     return val["model"]
        return val

    def get_all(self) -> dict[str, Any] | None:
        """
        Получить все настройки
        Returns:
            Словарь всех настроек или None
        """
        return self.data if self.data else None

    def set(self, key, value):
        """
        Установить значение настройки
        Args:
            key: Ключ настройки
            value: Новое значение
        """
        self.data[key] = value

    def reset(self) -> None:
        """
        Сбрасывает файл конфигурации до пустого состояния
        """
        try:
            # Очищаем внутренние данные
            self.data = {}
            # Сохраняем пустой словарь в файл
            self.save({})
            print("Config file has been reset.")
        except Exception as e:
            print(f"Error resetting config: {e}")
