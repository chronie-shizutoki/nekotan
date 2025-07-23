import { TimeUpdater } from './TimeUpdater.js';
import { DiaryManager } from './DiaryManager.js';
import { Logger } from './Logger.js';
import { TagManager } from './managers/TagManager.js';
import { UIManager } from './managers/UIManager.js';
import { EventHandler } from './managers/EventHandler.js';
import { InputAnimator } from './InputAnimator.js';

// DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize global instances using singleton pattern
        window.logger = Logger.getInstance();
        window.diaryManager = await DiaryManager.getInstance();
        window.tagManager = TagManager.getInstance();
        window.uiManager = UIManager.getInstance();
        window.eventHandler = EventHandler.getInstance();
        window.inputAnimator = new InputAnimator();

        // Initialize UI and event handlers
        new TimeUpdater().init();
        window.uiManager.initializeiOSSupport();
        window.eventHandler.setupEventListeners();
        await window.uiManager.renderDiaries();

        // Show loading success message
        window.uiManager.showNekoAlert('✨ 日記を読み込みました！', '#70DB93');
    } catch (error) {
        console.error('初期化エラー:', error);
        window.uiManager?.showNekoAlert('❌ 日記の読み込みに失敗しました...', '#FF4500', 3500);
    }
});

async function deleteDiary(id) {
    const entry = document.querySelector(`[data-id="${id}"]`);
    if (!entry) return;

    try {
        entry.style.animation = 'slideOutRight 0.4s var(--easing) forwards';
        await new Promise(resolve => entry.addEventListener('animationend', resolve, { once: true }));
        await diaryManager.deleteDiary(id);
        await renderDiaries();
        showNekoAlert('🗑️ 削除したにゃ！', '#70DB93');
    } catch (error) {
        console.error('削除エラー:', error);
        await logger.error('日記の削除中にエラー', error);
        showNekoAlert('❌ 削除できなかったにゃ...もう一度試してみて！', '#FF4500', 3500);
    }
}

// Click event for diary input animation
const diaryInput = document.getElementById('diary-content');
diaryInput.addEventListener('focus', () => {
    diaryInput.style.animation = 'inputClick 0.4s var(--easing) forwards';
});

document.addEventListener('click', (e) => {
    if (!diaryInput.contains(e.target) && 
        !document.getElementById('save-diary').contains(e.target)) {
        diaryInput.style.transform = 'scale(1)';
    }
});