/* =============================================
   main.js — Главная точка входа приложения
   =============================================
   Этот модуль является единственной точкой
   подключения для index.html (type="module").
   Инициализирует все компоненты приложения
   после загрузки DOM.
   ============================================= */

import { initDomCache } from './domCache.js';
import { setupSplitterResize } from './splitter.js';
import { updateTemplateUIStatus } from './templateEngine.js';
import {
    renderChatList,
    renderActiveChat,
    renderAttachedFiles,
    populateModels,
    syncSettingsWithUI
} from './renderers.js';
import { setupEventListeners } from './eventHandlers.js';

/**
 * Главная функция инициализации приложения.
 * Запускается после полной загрузки DOM.
 */
function initApp() {
    // 1. Кешируем все DOM-элементы
    initDomCache();

    // 2. Первичный рендеринг
    renderChatList();
    renderActiveChat();
    renderAttachedFiles();

    // 3. Заполняем список моделей
    populateModels('google');

    // 4. Настраиваем обработчики событий
    setupEventListeners();

    // 5. Синхронизируем UI с состоянием
    syncSettingsWithUI();

    // 6. Сплиттер для сайдбара
    setupSplitterResize();

    // 7. Обновляем индикатор шаблона
    updateTemplateUIStatus();
}

// Ждём полной загрузки DOM и запускаем приложение
document.addEventListener('DOMContentLoaded', initApp);
