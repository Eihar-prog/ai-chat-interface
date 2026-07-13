/* =============================================
   domCache.js — Кеширование DOM-элементов
   =============================================
   Все ссылки на HTML-элементы собираются здесь
   один раз при загрузке страницы для быстрого
   доступа из других модулей.
   ============================================= */

/**
 * Объект с кешированными DOM-элементами.
 * @type {Object<string, HTMLElement>}
 */
export const dom = {};

/**
 * Инициализация кеша DOM-элементов.
 * Вызывается один раз после загрузки DOM.
 */
export function initDomCache() {
    dom.sidebar = document.getElementById('sidebar');
    dom.sidebarToggle = document.getElementById('sidebar-toggle');
    dom.chatList = document.getElementById('chat-list');
    dom.newChatBtn = document.getElementById('new-chat-btn');
    dom.tempChatBtn = document.getElementById('temp-chat-btn');
    dom.providerSelect = document.getElementById('provider-select');
    dom.modelSelect = document.getElementById('model-select');
    dom.tempRange = document.getElementById('temp-range');
    dom.tempVal = document.getElementById('temp-val');
    dom.thinkingSelect = document.getElementById('thinking-select');
    dom.sysInstruction = document.getElementById('sys-instruction');
    dom.sysFileBtn = document.getElementById('sys-file-btn');
    dom.sysFileInput = document.getElementById('sys-file-input');
    dom.themeSwitch = document.getElementById('theme-switch');
    dom.activeChatTitle = document.getElementById('active-chat-title');
    dom.activeChatStatus = document.getElementById('active-chat-status');
    dom.chatContainer = document.getElementById('chat-container');
    dom.attachedFilesList = document.getElementById('attached-files-list');
    dom.addFileTrigger = document.getElementById('add-file-trigger');
    dom.realFileInput = document.getElementById('real-file-input');
    dom.promptTextarea = document.getElementById('prompt-textarea');
    dom.sendBtn = document.getElementById('send-btn');
    dom.contextMenu = document.getElementById('chat-context-menu');
    dom.contextRename = document.getElementById('context-rename');
    dom.contextDelete = document.getElementById('context-delete');
    dom.toast = document.getElementById('toast-notification');
    dom.toastMessage = document.getElementById('toast-message');

    /* Элементы управления сворачиванием вложений */
    dom.filesColumn = document.getElementById('files-attachment-column');
    dom.collapseFilesBtn = document.getElementById('collapse-files-btn');
    dom.expandFilesBtn = document.getElementById('expand-files-btn');
    dom.filesBadgeCounter = document.getElementById('files-badge-counter');

    /* Элементы сплиттера */
    dom.splitter = document.getElementById('sidebar-splitter');
    dom.settingsPanel = document.getElementById('settings-panel');

    /* Элементы шаблонизатора (Конструктора) */
    dom.templateBtn = document.getElementById('template-btn');
    dom.templateModal = document.getElementById('template-modal');
    dom.modalClose = document.getElementById('modal-close');
    dom.templateTextarea = document.getElementById('template-textarea');
    dom.btnLoadCustomTemplate = document.getElementById('btn-load-custom-template');
    dom.btnUseDefaultTemplate = document.getElementById('btn-use-default-template');
    dom.btnDisableTemplate = document.getElementById('btn-disable-template');
    dom.templateFileInput = document.getElementById('template-file-input');
    dom.promptTemplateStatus = document.getElementById('prompt-template-status');
    dom.activeTemplateNameBadge = document.getElementById('active-template-name-badge');
    dom.removeTemplateBadge = document.getElementById('remove-template-badge');
}
