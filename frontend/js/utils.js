/* =============================================
   utils.js — Вспомогательные функции
   =============================================
   Переиспользуемые утилиты: тост-уведомления,
   экранирование HTML/RegExp, буфер обмена,
   сохранение файлов и т.д.
   ============================================= */

import { dom } from './domCache.js';

/**
 * Показать тост-уведомление.
 * @param {string} message — Текст уведомления
 */
export function showToast(message) {
    dom.toastMessage.innerText = message;
    dom.toast.classList.add('active');
    setTimeout(() => {
        dom.toast.classList.remove('active');
    }, 3000);
}

/**
 * Экранирование HTML-символов для безопасной вставки.
 * @param {string} text — Исходный текст
 * @returns {string} — Экранированный текст
 */
export function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Экранирование спецсимволов для RegExp.
 * @param {string} string — Исходная строка
 * @returns {string} — Экранированная строка
 */
export function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Копирование текста в буфер обмена.
 * @param {string} text — Текст для копирования
 */
export function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Текст скопирован в буфер обмена');
    }).catch(() => {
        // Fallback для старых браузеров
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Текст скопирован в буфер обмена');
    });
}

/**
 * Сохранение текста в файл на диск.
 * @param {string} text — Текст для сохранения
 * @param {string} [filename='message.txt'] — Имя файла
 */
export function saveMessageToFile(text, filename = 'message.txt') {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Файл сохранён');
}

/**
 * Форматирование времени из Date.
 * @param {Date} date — Объект даты
 * @returns {string} — Строка времени (ЧЧ:ММ)
 */
export function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}
