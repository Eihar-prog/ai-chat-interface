/* =============================================
   appState.js — Управление состоянием приложения
   =============================================
   Единственный источник правды (Single Source of Truth)
   для всех данных приложения: чаты, файлы, настройки,
   шаблоны и т.д.
   ============================================= */

/**
 * Глобальное состояние приложения.
 * @typedef {Object} AppState
 */
export const AppState = {
    /** @type {Array<{id: string, title: string, messages: Array, isTemporary?: boolean}>} */
    chats: [
        {
            id: 'chat-1',
            title: 'Проверка работы ИИ',
            messages: [
                {
                    sender: 'user',
                    text: 'Привет! Какая модель сейчас используется?',
                    time: '10:14'
                },
                {
                    sender: 'ai',
                    text: 'Привет! Сейчас развернута модель **gemini-2.0-flash** для обработки запросов. Я могу работать с текстом, а также анализировать файлы, которые вы прикрепили в левой панели ввода! Попробуйте прикрепить любой текстовый лог или конфигурационный файл.',
                    time: '10:15'
                }
            ]
        }
    ],

    /** @type {string} ID активного чата */
    activeChatId: 'chat-1',

    /** @type {Array<{id: string, name: string, size: string, active: boolean, content: string}>} */
    attachedFiles: [
        {
            id: 'file-1',
            name: 'requirements.txt',
            size: '0.4 КБ',
            active: true,
            content: '1. Написать код на чистом JS\n2. Использовать семантическую разметку\n3. Избегать библиотек и фреймворков.'
        },
        {
            id: 'file-2',
            name: 'example.js',
            size: '0.8 КБ',
            active: true,
            content: 'function sum(a, b) {\n    return a + b;\n}'
        }
    ],

    /** @type {Object} Настройки модели */
    settings: {
        provider: 'google',
        model: 'gemini-2.0-flash',
        temperature: 0.7,
        thinkingDepth: 'medium',
        systemInstruction: 'Ты профессиональный ассистент. Отвечаешь понятно, структурированно, строго по теме.',
        lightTheme: false
    },

    /** @type {string|null} ID чата для контекстного меню */
    contextMenuSelectedChatId: null,

    /** @type {Object|null} Активный шаблон XML */
    activeTemplate: null,

    /** @type {string} Дефолтный XML-шаблон */
    defaultXMLTemplate: `<system>{{system}}</system>\n<requirements>{{requirements.txt}}</requirements>\n<examples>{{example.js}}</examples>\n<user_request>{{prompt}}</user_request>`,

    /** @type {Object} Справочник моделей по провайдерам */
    modelsList: {
        google: [
            { value: 'gemini-2.0-flash', label: 'gemini-2.0-flash (Быстрая)' },
            { value: 'gemini-1.5-pro', label: 'gemini-1.5-pro (Когнитивная)' },
            { value: 'gemini-2.0-flash-thinking', label: 'gemini-2.0-flash-thinking' }
        ],
        openai: [
            { value: 'gpt-4o', label: 'gpt-4o (Флагман)' },
            { value: 'gpt-4o-mini', label: 'gpt-4o-mini (Экономная)' },
            { value: 'o1-mini', label: 'o1-mini (Программирование)' }
        ],
        anthropic: [
            { value: 'claude-3-5-sonnet', label: 'Claude 3.5 Sonnet' },
            { value: 'claude-3-5-haiku', label: 'Claude 3.5 Haiku' }
        ],
        ollama: [
            { value: 'llama3', label: 'Llama 3 (Локальная)' },
            { value: 'mistral', label: 'Mistral (Локальная)' },
            { value: 'phi3', label: 'Microsoft Phi-3' }
        ]
    }
};
