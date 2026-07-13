/* =============================================
   eventHandlers.js — Обработчики событий
   =============================================
   Настройка всех обработчиков пользовательского
   взаимодействия: клики, ввод текста, перетаскивание,
   переключение тем, загрузка файлов и т.д.
   ============================================= */

import { AppState } from './appState.js';
import { dom } from './domCache.js';
import { showToast, formatTime } from './utils.js';
import { updateTemplateUIStatus, compilePrompt } from './templateEngine.js';
import {
    populateModels,
    renderChatList,
    renderActiveChat,
    renderAttachedFiles,
    updateChatStatusCount,
    syncSettingsWithUI
} from './renderers.js';

/**
 * Инициализация всех обработчиков событий.
 */
export function setupEventListeners() {

    // ===== Переключение сайдбара =====
    dom.sidebarToggle.addEventListener('click', () => {
        dom.sidebar.classList.toggle('collapsed');
        if (dom.sidebar.classList.contains('collapsed')) {
            dom.sidebarToggle.style.left = '15px';
            dom.sidebarToggle.style.transform = 'rotate(180deg)';
        } else {
            dom.sidebarToggle.style.left = '10px';
            dom.sidebarToggle.style.transform = 'rotate(0deg)';
        }
    });

    // ===== Сворачивание панели "Вложения" =====
    dom.collapseFilesBtn.addEventListener('click', () => {
        dom.filesColumn.classList.add('collapsed');
        dom.expandFilesBtn.classList.add('active');
        showToast('Панель вложений свернута. Доступ к контексту через скрепку 📎');
    });

    // ===== Разворачивание панели "Вложения" =====
    dom.expandFilesBtn.addEventListener('click', () => {
        dom.filesColumn.classList.remove('collapsed');
        dom.expandFilesBtn.classList.remove('active');
    });

    // ===== Модальное окно шаблонизатора =====
    dom.templateBtn.addEventListener('click', () => {
        dom.templateModal.classList.add('active');
        dom.templateTextarea.focus();
    });

    dom.modalClose.addEventListener('click', () => {
        dom.templateModal.classList.remove('active');
    });

    // ===== Отслеживание изменений в тексте шаблона =====
    dom.templateTextarea.addEventListener('input', (e) => {
        const currentText = e.target.value;
        AppState.activeTemplate = {
            name: 'Ручной_шаблон.xml',
            content: currentText
        };
        dom.promptTemplateStatus.classList.add('active');
        dom.activeTemplateNameBadge.innerText = AppState.activeTemplate.name;
        dom.templateBtn.classList.add('active');
    });

    // ===== Кнопка "Дефолтный XML-шаблон" =====
    dom.btnUseDefaultTemplate.addEventListener('click', () => {
        AppState.activeTemplate = {
            name: 'default_xml.xml',
            content: AppState.defaultXMLTemplate
        };
        updateTemplateUIStatus();
        showToast('Дефолтный XML-шаблон применен!');
    });

    // ===== Кнопка "Выключить шаблон" =====
    dom.btnDisableTemplate.addEventListener('click', () => {
        AppState.activeTemplate = null;
        updateTemplateUIStatus();
        showToast('Шаблонизатор отключен');
    });

    // ===== Крестик отключения шаблона у поля ввода =====
    dom.removeTemplateBadge.addEventListener('click', () => {
        AppState.activeTemplate = null;
        updateTemplateUIStatus();
        showToast('Шаблонизатор отключен');
    });

    // ===== Загрузка кастомного шаблона с компьютера =====
    dom.btnLoadCustomTemplate.addEventListener('click', () => {
        dom.templateFileInput.click();
    });

    dom.templateFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            AppState.activeTemplate = {
                name: file.name,
                content: event.target.result
            };
            updateTemplateUIStatus();
            showToast(`Шаблон загружен: "${file.name}"`);
        };
        reader.readAsText(file);
        dom.templateFileInput.value = '';
    });

    // ===== Создание нового чата =====
    dom.newChatBtn.addEventListener('click', () => {
        const newId = `chat-${Date.now()}`;
        const newChat = {
            id: newId,
            title: `Новый диалог ${AppState.chats.length + 1}`,
            messages: []
        };
        AppState.chats.push(newChat);
        AppState.activeChatId = newId;
        renderChatList();
        renderActiveChat();
        showToast('Создан новый чат!');
    });

    // ===== Создание временного чата =====
    dom.tempChatBtn.addEventListener('click', () => {
        const newId = `chat-temp-${Date.now()}`;
        const newChat = {
            id: newId,
            title: `Разовый запрос ${AppState.chats.filter(c => c.isTemporary).length + 1}`,
            messages: [],
            isTemporary: true
        };
        AppState.chats.push(newChat);
        AppState.activeChatId = newId;
        renderChatList();
        renderActiveChat();
        showToast('Создан временный чат!');
    });

    // ===== Выбор провайдера =====
    dom.providerSelect.addEventListener('change', (e) => {
        const selectedProvider = e.target.value;
        AppState.settings.provider = selectedProvider;
        populateModels(selectedProvider);
        showToast(`Провайдер изменен на: ${selectedProvider.toUpperCase()}`);
    });

    // ===== Выбор модели =====
    dom.modelSelect.addEventListener('change', (e) => {
        AppState.settings.model = e.target.value;
        showToast(`Выбрана модель: ${e.target.value}`);
    });

    // ===== Слайдер температуры =====
    dom.tempRange.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value).toFixed(1);
        dom.tempVal.innerText = val;
        AppState.settings.temperature = parseFloat(val);
    });

    // ===== Уровень рассуждений =====
    dom.thinkingSelect.addEventListener('change', (e) => {
        AppState.settings.thinkingDepth = e.target.value;
        showToast(`Глубина рассуждений: ${e.target.options[e.target.selectedIndex].text}`);
    });

    // ===== Ввод системной инструкции =====
    dom.sysInstruction.addEventListener('input', (e) => {
        AppState.settings.systemInstruction = e.target.value;
    });

    // ===== Загрузка системной инструкции из файла =====
    dom.sysFileBtn.addEventListener('click', () => {
        dom.sysFileInput.click();
    });

    dom.sysFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const loadedText = event.target.result;
            dom.sysInstruction.value = loadedText;
            AppState.settings.systemInstruction = loadedText;
            showToast(`Системный промт загружен из "${file.name}"!`);
        };
        reader.readAsText(file);
        dom.sysFileInput.value = '';
    });

    // ===== Переключение темы (тёмная/светлая) =====
    dom.themeSwitch.addEventListener('change', (e) => {
        AppState.settings.lightTheme = e.target.checked;
        if (AppState.settings.lightTheme) {
            document.body.classList.add('light-theme');
            showToast('Включена светлая тема');
        } else {
            document.body.classList.remove('light-theme');
            showToast('Включена темная тема');
        }
    });

    // ===== Добавление файлов =====
    dom.addFileTrigger.addEventListener('click', () => {
        dom.realFileInput.click();
    });

    dom.realFileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files.length === 0) return;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const sizeInKb = (file.size / 1024).toFixed(1) + ' КБ';

            const reader = new FileReader();
            reader.onload = (event) => {
                const newFile = {
                    id: `file-${Date.now()}-${i}`,
                    name: file.name,
                    size: sizeInKb,
                    active: true,
                    content: event.target.result
                };
                AppState.attachedFiles.push(newFile);
                renderAttachedFiles();
            };
            reader.readAsText(file);
        }

        showToast(`Считывание файлов: ${files.length}...`);
        dom.realFileInput.value = '';
    });

    // ===== Авто-высота поля ввода =====
    dom.promptTextarea.addEventListener('input', () => {
        dom.promptTextarea.style.height = 'auto';
        let nextHeight = dom.promptTextarea.scrollHeight;
        if (nextHeight > 140) {
            nextHeight = 140;
        }
        dom.promptTextarea.style.height = nextHeight + 'px';
    });

    // ===== Отправка сообщения =====
    dom.sendBtn.addEventListener('click', handleSendMessage);

    dom.promptTextarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });

    // ===== Закрытие контекстного меню и модалки =====
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#chat-context-menu')) {
            dom.contextMenu.style.display = 'none';
        }
        if (e.target === dom.templateModal) {
            dom.templateModal.classList.remove('active');
        }
    });

    // ===== Действия контекстного меню =====
    dom.contextRename.addEventListener('click', handleRenameAction);
    dom.contextDelete.addEventListener('click', handleDeleteAction);
}


// =============================================
// БИЗНЕС-ЛОГИКА ЧАТОВ
// =============================================

/**
 * Обработка отправки сообщения.
 */
function handleSendMessage() {
    const promptText = dom.promptTextarea.value.trim();
    if (!promptText) return;

    const activeChat = AppState.chats.find(c => c.id === AppState.activeChatId);
    if (!activeChat) {
        showToast('Ошибка! Нет активного диалога.');
        return;
    }

    const now = new Date();
    const timeStr = formatTime(now);

    let compiledXml = null;

    if (AppState.activeTemplate) {
        compiledXml = compilePrompt(AppState.activeTemplate.content, promptText);
    }

    activeChat.messages.push({
        sender: 'user',
        text: promptText,
        time: timeStr,
        compiledXml: compiledXml
    });

    dom.promptTextarea.value = '';
    dom.promptTextarea.style.height = '36px';

    if (activeChat.title.startsWith('Новый диалог') && activeChat.messages.length === 1) {
        activeChat.title = promptText.length > 20
            ? promptText.slice(0, 20) + '...'
            : promptText;
        renderChatList();
    }

    renderActiveChat();
    simulateAIResponse(activeChat, compiledXml);
}

/**
 * Симуляция ответа ИИ (заглушка).
 * @param {Object} chat — Чат, куда добавляется ответ
 * @param {string|null} compiledXmlUsed — Скомпилированный XML (если был)
 */
function simulateAIResponse(chat, compiledXmlUsed) {
    const activeFiles = AppState.attachedFiles.filter(f => f.active);
    const providerUsed = AppState.settings.provider.toUpperCase();
    const modelUsed = AppState.settings.model;
    const thinkingDepth = AppState.settings.thinkingDepth;

    setTimeout(() => {
        const now = new Date();
        const timeStr = formatTime(now);

        let aiResponseText = `Это ответ от провайдера **${providerUsed}** (модель: **${modelUsed}**). `;

        if (compiledXmlUsed) {
            aiResponseText += `\n\n🎯 **Промпт-инжиниринг активен!** Модель получила структурированный XML-запрос. \n\nЭто позволило мне идеально локализовать файлы и разделить контекст требований и примера, предотвращая путаницу и галлюцинации.`;
        } else {
            aiResponseText += `\n\nЗапрос отправлен классической плоской простыней без XML разметки.`;
            if (activeFiles.length > 0) {
                aiResponseText += `\n\n**Использованы файлы:**\n`;
                activeFiles.forEach(file => {
                    aiResponseText += `• \`${file.name}\` (${file.size})\n`;
                });
            }
        }

        if (thinkingDepth !== 'off') {
            let thoughts = '';
            if (thinkingDepth === 'low') {
                thoughts = `*<думает (низкая глубина): быстрое сопоставление ключевых слов...>*\n\n`;
            } else if (thinkingDepth === 'medium') {
                thoughts = `*<думает (средняя глубина): анализ контекста файлов, определение оптимального пути решения задачи...>*\n\n`;
            } else if (thinkingDepth === 'high') {
                thoughts = `*<думает (максимальная глубина): детальный кросс-анализ всех прикрепленных логов, проверка синтаксиса кода, верификация гипотез по устранению багов, генерация готового решения...>*\n\n`;
            }
            aiResponseText = thoughts + aiResponseText;
        }

        chat.messages.push({
            sender: 'ai',
            text: aiResponseText,
            time: timeStr
        });

        renderActiveChat();
    }, 1000);
}

/**
 * Переименование чата из контекстного меню.
 */
function handleRenameAction() {
    const chatId = AppState.contextMenuSelectedChatId;
    const chat = AppState.chats.find(c => c.id === chatId);
    if (!chat) return;

    dom.contextMenu.style.display = 'none';

    const spanEl = document.getElementById(`name-span-${chatId}`);
    if (!spanEl) return;

    const inputEl = document.createElement('input');
    inputEl.type = 'text';
    inputEl.className = 'chat-name-input';
    inputEl.value = chat.title;

    spanEl.replaceWith(inputEl);
    inputEl.focus();
    inputEl.select();

    const finishRename = () => {
        const newTitle = inputEl.value.trim();
        if (newTitle) {
            chat.title = newTitle;
            showToast('Диалог переименован');
        }
        renderChatList();
    };

    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') finishRename();
        if (e.key === 'Escape') renderChatList();
    });

    inputEl.addEventListener('blur', finishRename);
}

/**
 * Удаление чата из контекстного меню.
 */
function handleDeleteAction() {
    const chatId = AppState.contextMenuSelectedChatId;
    dom.contextMenu.style.display = 'none';

    AppState.chats = AppState.chats.filter(c => c.id !== chatId);

    if (AppState.activeChatId === chatId) {
        AppState.activeChatId = AppState.chats.length > 0 ? AppState.chats[0].id : null;
    }

    renderChatList();
    renderActiveChat();
    showToast('Чат удален');
}
