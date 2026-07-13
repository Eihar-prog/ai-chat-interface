/* =============================================
   renderers.js — Функции рендеринга компонентов
   =============================================
   Отвечает за динамическую отрисовку элементов
   интерфейса: список чатов, сообщения, файлы,
   модели и синхронизацию настроек.
   ============================================= */

import { AppState } from './appState.js';
import { dom } from './domCache.js';
import { showToast, escapeHtml, copyToClipboard, saveMessageToFile, formatTime } from './utils.js';

/**
 * Заполнение выпадающего списка моделей
 * в зависимости от выбранного провайдера.
 * @param {string} providerId — ID провайдера
 */
export function populateModels(providerId) {
    dom.modelSelect.innerHTML = '';
    const models = AppState.modelsList[providerId] || [];
    models.forEach(model => {
        const opt = document.createElement('option');
        opt.value = model.value;
        opt.textContent = model.label;
        dom.modelSelect.appendChild(opt);
    });
    if (models.length > 0) {
        AppState.settings.model = models[0].value;
        dom.modelSelect.value = models[0].value;
    }
}

/**
 * Рендеринг списка чатов в сайдбаре.
 */
export function renderChatList() {
    dom.chatList.innerHTML = '';
    AppState.chats.forEach(chat => {
        const chatEl = document.createElement('div');
        const isTemp = chat.isTemporary;

        chatEl.className = `chat-item ${chat.id === AppState.activeChatId ? 'active' : ''} ${isTemp ? 'temporary' : ''}`;
        chatEl.dataset.id = chat.id;

        const iconSvg = isTemp
            ? `<svg class="chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>`
            : `<svg class="chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>`;

        const badgeHtml = isTemp ? `<span class="temp-badge">Врем.</span>` : '';

        chatEl.innerHTML = `
            ${iconSvg}
            <span class="chat-name" id="name-span-${chat.id}">${chat.title}</span>
            ${badgeHtml}
            <button class="chat-actions-btn" data-id="${chat.id}">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="12" cy="5" r="1"></circle>
                    <circle cx="12" cy="19" r="1"></circle>
                </svg>
            </button>
        `;

        chatEl.addEventListener('click', (e) => {
            if (e.target.closest('.chat-actions-btn')) return;

            AppState.activeChatId = chat.id;
            renderChatList();
            renderActiveChat();
        });

        dom.chatList.appendChild(chatEl);
    });

    document.querySelectorAll('.chat-actions-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const chatId = e.currentTarget.dataset.id;
            openContextMenu(e, chatId);
        });
    });
}

/**
 * Рендеринг активного чата (сообщения или приветствие).
 */
export function renderActiveChat() {
    const activeChat = AppState.chats.find(c => c.id === AppState.activeChatId);
    if (!activeChat) {
        dom.activeChatTitle.innerText = 'Диалог отсутствует';
        dom.activeChatStatus.innerText = 'Создайте новый чат для общения';
        dom.chatContainer.innerHTML = `
            <div class="empty-chat-welcome">
                <div class="welcome-logo">💬</div>
                <div class="welcome-title">Нет активных чатов</div>
                <div class="welcome-desc">Нажмите кнопку "+ Новый чат" или "Временный чат" слева для старта сессии работы с ИИ.</div>
            </div>
        `;
        return;
    }

    dom.activeChatTitle.innerText = activeChat.isTemporary
        ? `🕒 ${activeChat.title} (Временный)`
        : activeChat.title;
    updateChatStatusCount();

    dom.chatContainer.innerHTML = '';

    if (activeChat.messages.length === 0) {
        dom.chatContainer.innerHTML = `
            <div class="empty-chat-welcome">
                <div class="welcome-logo">${activeChat.isTemporary ? '🕒' : '✨'}</div>
                <div class="welcome-title">${activeChat.isTemporary ? 'Временная сессия' : 'Чем я могу помочь?'}</div>
                <div class="welcome-desc">
                    ${activeChat.isTemporary
                        ? 'Этот чат предназначен для разовых запросов. Он не запишется в постоянную историю на диске при перезапуске приложения.'
                        : 'Задайте мне любой вопрос или прикрепите файлы к контексту для анализа. Выбранные файлы в столбце слева передаются вместе с промтом.'}
                </div>
            </div>
        `;
        return;
    }

    activeChat.messages.forEach((msg, index) => {
        const msgEl = document.createElement('div');
        msgEl.className = `message ${msg.sender}`;

        let formattedText = msg.text
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/`([^`]+)`/g, '<code>$1</code>');

        if (msg.sender === 'ai') {
            msgEl.innerHTML = `
                <div class="message-bubble">${formattedText}</div>
                <div class="message-footer">
                    <span class="message-time">${msg.time}</span>
                    <button class="msg-action-btn copy-msg-btn" title="Копировать в буфер">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                    </button>
                    <button class="msg-action-btn save-msg-btn" title="Сохранить как файл">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                    </button>
                </div>
            `;

            msgEl.querySelector('.copy-msg-btn').addEventListener('click', () => {
                copyToClipboard(msg.text);
            });

            msgEl.querySelector('.save-msg-btn').addEventListener('click', () => {
                saveMessageToFile(msg.text);
            });
        } else {
            const hasDebug = !!msg.compiledXml;
            const toggleBtnHtml = hasDebug
                ? `<div class="xml-toggle-btn" data-index="${index}">Показать собранный XML-запрос</div>`
                : '';
            const debugBoxHtml = hasDebug
                ? `<div class="xml-debug-container" id="xml-debug-${index}">${escapeHtml(msg.compiledXml)}</div>`
                : '';

            msgEl.innerHTML = `
                <div class="message-bubble">
                    <div>${formattedText}</div>
                    ${toggleBtnHtml}
                    ${debugBoxHtml}
                </div>
                <div class="message-footer">
                    <span class="message-time">${msg.time}</span>
                </div>
            `;

            if (hasDebug) {
                msgEl.querySelector('.xml-toggle-btn').addEventListener('click', (e) => {
                    const idx = e.currentTarget.dataset.index;
                    const container = document.getElementById(`xml-debug-${idx}`);
                    if (container.style.display === 'block') {
                        container.style.display = 'none';
                        e.currentTarget.innerText = 'Показать собранный XML-запрос';
                    } else {
                        container.style.display = 'block';
                        e.currentTarget.innerText = 'Скрыть XML-запрос';
                    }
                });
            }
        }

        dom.chatContainer.appendChild(msgEl);
    });

    dom.chatContainer.scrollTop = dom.chatContainer.scrollHeight;
}

/**
 * Рендеринг списка прикреплённых файлов.
 */
export function renderAttachedFiles() {
    dom.attachedFilesList.innerHTML = '';

    if (AppState.attachedFiles.length === 0) {
        dom.attachedFilesList.innerHTML = '<div class="file-empty-state">Нет файлов</div>';
        updateChatStatusCount();
        return;
    }

    AppState.attachedFiles.forEach(file => {
        const fileRow = document.createElement('div');
        fileRow.className = 'file-badge-row';

        fileRow.innerHTML = `
            <div class="file-badge-left">
                <input type="checkbox" class="file-checkbox" ${file.active ? 'checked' : ''} data-id="${file.id}">
                <div class="file-meta">
                    <span class="file-badge-name" title="${file.name}">${file.name}</span>
                    <span class="file-badge-size">${file.size}</span>
                </div>
            </div>
            <button class="file-badge-delete" data-id="${file.id}" title="Удалить файл">
                ✕
            </button>
        `;

        fileRow.querySelector('.file-checkbox').addEventListener('change', (e) => {
            const fileId = e.target.dataset.id;
            const f = AppState.attachedFiles.find(item => item.id === fileId);
            if (f) {
                f.active = e.target.checked;
                updateChatStatusCount();
            }
        });

        fileRow.querySelector('.file-badge-delete').addEventListener('click', (e) => {
            const fileId = e.currentTarget.dataset.id;
            AppState.attachedFiles = AppState.attachedFiles.filter(item => item.id !== fileId);
            renderAttachedFiles();
        });

        dom.attachedFilesList.appendChild(fileRow);
    });

    updateChatStatusCount();
}

/**
 * Обновление статусной строки и счётчика файлов.
 */
export function updateChatStatusCount() {
    const activeFilesCount = AppState.attachedFiles.filter(f => f.active).length;
    const activeChat = AppState.chats.find(c => c.id === AppState.activeChatId);

    if (activeChat) {
        dom.activeChatStatus.innerText = `Контекст: ${activeFilesCount} файлов активны для отправки`;
    }

    if (activeFilesCount > 0) {
        dom.filesBadgeCounter.style.display = 'flex';
        dom.filesBadgeCounter.innerText = activeFilesCount;
    } else {
        dom.filesBadgeCounter.style.display = 'none';
    }
}

/**
 * Синхронизация UI с сохранёнными настройками.
 */
export function syncSettingsWithUI() {
    dom.providerSelect.value = AppState.settings.provider;
    dom.modelSelect.value = AppState.settings.model;
    dom.tempRange.value = AppState.settings.temperature;
    dom.tempVal.innerText = AppState.settings.temperature;
    dom.thinkingSelect.value = AppState.settings.thinkingDepth;
    dom.sysInstruction.value = AppState.settings.systemInstruction;
    dom.themeSwitch.checked = AppState.settings.lightTheme;
}

/**
 * Открытие контекстного меню чата.
 * @param {MouseEvent} e — Событие клика
 * @param {string} chatId — ID чата
 */
function openContextMenu(e, chatId) {
    AppState.contextMenuSelectedChatId = chatId;
    dom.contextMenu.style.display = 'flex';
    dom.contextMenu.style.left = `${e.clientX - 100}px`;
    dom.contextMenu.style.top = `${e.clientY + 10}px`;
}
