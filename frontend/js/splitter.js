/* =============================================
   splitter.js — Интерактивный сплиттер сайдбара
   =============================================
   Реализует drag-to-resize для панели настроек
   в нижней части сайдбара через сплиттер.
   ============================================= */

import { dom } from './domCache.js';

/**
 * Настройка механизма перетаскивания сплиттера.
 * Позволяет изменять высоту панели настроек.
 */
export function setupSplitterResize() {
    let startY = 0;
    let startHeight = 0;

    dom.splitter.addEventListener('mousedown', (e) => {
        e.preventDefault();
        startY = e.clientY;
        startHeight = dom.settingsPanel.getBoundingClientRect().height;
        dom.splitter.classList.add('dragging');

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    });

    /**
     * @param {MouseEvent} e
     */
    function handleMouseMove(e) {
        const deltaY = e.clientY - startY;
        let newHeight = startHeight - deltaY;

        const sidebarHeight = dom.sidebar.getBoundingClientRect().height;
        const minSettingsHeight = 150;
        const minChatHeight = 120;
        const maxSettingsHeight = sidebarHeight - minChatHeight - 120;

        if (newHeight < minSettingsHeight) newHeight = minSettingsHeight;
        if (newHeight > maxSettingsHeight) newHeight = maxSettingsHeight;

        dom.settingsPanel.style.height = `${newHeight}px`;
    }

    /**
     * Завершение перетаскивания и очистка обработчиков.
     */
    function handleMouseUp() {
        dom.splitter.classList.remove('dragging');
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }
}
