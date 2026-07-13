/* =============================================
   templateEngine.js — XML Шаблонизатор промптов
   =============================================
   Отвечает за управление XML-шаблонами, их
   компиляцию — подстановку значений системной
   инструкции, прикреплённых файлов и промта
   в шаблон перед отправкой.
   ============================================= */

import { AppState } from './appState.js';
import { dom } from './domCache.js';
import { escapeRegExp } from './utils.js';

/**
 * Обновление UI-индикатора активного шаблона
 * (бейдж над полем ввода и подсветка кнопки).
 */
export function updateTemplateUIStatus() {
    if (AppState.activeTemplate) {
        dom.promptTemplateStatus.classList.add('active');
        dom.activeTemplateNameBadge.innerText = AppState.activeTemplate.name;
        dom.templateBtn.classList.add('active');
        dom.templateTextarea.value = AppState.activeTemplate.content;
    } else {
        dom.promptTemplateStatus.classList.remove('active');
        dom.templateBtn.classList.remove('active');
        dom.templateTextarea.value = AppState.defaultXMLTemplate;
    }
}

/**
 * Компиляция шаблона — подстановка значений вместо плейсхолдеров.
 * @param {string} templateText — Текст шаблона с {{placeholders}}
 * @param {string} promptText — Текст промта пользователя
 * @returns {string} — Скомпилированный XML с подставленными значениями
 */
export function compilePrompt(templateText, promptText) {
    let result = templateText;

    // Подстановка системной инструкции
    result = result.replace(/\{\{system\}\}/g,
        AppState.settings.systemInstruction || 'No system instruction defined.');

    // Подстановка текста промта
    result = result.replace(/\{\{prompt\}\}/g, promptText);

    // Подстановка содержимого прикреплённых файлов
    AppState.attachedFiles.forEach(file => {
        const placeholder = new RegExp(`\\{\\{${escapeRegExp(file.name)}\\}\\}`, 'g');
        if (file.active) {
            result = result.replace(placeholder, file.content || `/* Файл ${file.name} пуст */`);
        } else {
            result = result.replace(placeholder, `/* Файл ${file.name} отключен */`);
        }
    });

    return result;
}
