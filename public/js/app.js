import { TimeUpdater } from './TimeUpdater.js';
import { DiaryManager } from './DiaryManager.js';
import { Logger } from './Logger.js';

let diaryManager;
const logger = Logger.getInstance();

// 标签管理
let selectedTags = [];
let currentTags = new Set();

function updateTagsDisplay() {
    const tagsDisplay = document.getElementById('tags-display');
    tagsDisplay.innerHTML = currentTags.size ? Array.from(currentTags).map(tag => `
        <span class="tag">
            ${tag}
            <span class="tag-remove" onclick="removeTag('${tag}')">&times;</span>
        </span>
    `).join('') : '';
}

function updateTagsFilter() {
    const tagsFilter = document.getElementById('tags-filter');
    const allTags = diaryManager.getTags();
    tagsFilter.innerHTML = allTags.map(tag => `
        <span class="filter-tag ${selectedTags.includes(tag) ? 'active' : ''}"
              onclick="toggleFilterTag('${tag}')">
            ${tag}
        </span>
    `).join('');
}

function addTag(tag) {
    const trimmedTag = tag.trim();
    if (trimmedTag && currentTags.size < 10 && trimmedTag.length <= 20) {
        currentTags.add(trimmedTag);
        updateTagsDisplay();
        document.getElementById('tag-input').value = '';
        hideSuggestions();
    }
}

function removeTag(tag) {
    currentTags.delete(tag);
    updateTagsDisplay();
}

function toggleFilterTag(tag) {
    const index = selectedTags.indexOf(tag);
    if (index === -1) {
        selectedTags.push(tag);
    } else {
        selectedTags.splice(index, 1);
    }
    updateTagsFilter();
    handleSearch();
}

// 标签建议功能
function showSuggestions(input) {
    const allTags = diaryManager.getTags();
    const matchingTags = allTags.filter(tag => 
        tag.toLowerCase().includes(input.toLowerCase()) &&
        !currentTags.has(tag)
    );

    const suggestions = document.getElementById('tag-suggestions');
    if (matchingTags.length && input) {
        suggestions.innerHTML = matchingTags.map(tag => `
            <div class="tag-suggestion-item" onclick="addTag('${tag}')">${tag}</div>
        `).join('');
        
        const inputRect = document.getElementById('tag-input').getBoundingClientRect();
        suggestions.style.top = `${inputRect.bottom + window.scrollY + 5}px`;
        suggestions.style.left = `${inputRect.left}px`;
        suggestions.style.minWidth = `${inputRect.width}px`;
        suggestions.style.display = 'block';
    } else {
        hideSuggestions();
    }
}

function hideSuggestions() {
    const suggestions = document.getElementById('tag-suggestions');
    suggestions.style.display = 'none';
}

function showNekoAlert(message, color, duration = 2500) {
    const alertBox = document.createElement('div');
    alertBox.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 24px;
        background: ${color};
        color: white;
        border-radius: 20px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        font-family: 'Hachi Maru Pop', cursive;
        z-index: 1000;
        animation: gentleFloat 2s ease-in-out infinite;
    `;
    alertBox.textContent = message;
    document.body.appendChild(alertBox);
    setTimeout(() => {
        alertBox.style.animation = 'fadeOut 0.5s forwards';
        setTimeout(() => alertBox.remove(), 500);
    }, duration);
}

// 编辑模式相关函数
function enterEditMode(diaryId) {
    const entry = document.querySelector(`[data-id="${diaryId}"]`);
    if (!entry) return;

    const diary = diaryManager.diaries.find(d => d.id === diaryId);
    if (!diary) return;

    currentTags = new Set(diary.tags || []);
    
    entry.innerHTML = `
        <div class="diary-edit-box">
            <textarea class="diary-edit-input">${diary.content}</textarea>
            <div class="diary-edit-footer">
                <div class="input-group">
                    <select class="category-select edit-category">
                        <option value="未分類">未分類</option>
                        ${diaryManager.getCategories().map(cat => 
                            `<option value="${cat}" ${cat === diary.category ? 'selected' : ''}>${cat}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="input-group">
                    <div class="tags-input-container">
                        <div id="edit-tags-display">
                            ${(diary.tags || []).map(tag => `
                                <span class="tag">
                                    ${tag}
                                    <span class="tag-remove" onclick="removeTag('${tag}')">&times;</span>
                                </span>
                            `).join('')}
                        </div>
                        <input type="text" class="tag-input" 
                               placeholder="タグを入力 (最大10個)"
                               maxlength="20">
                    </div>
                </div>
                <div class="edit-buttons">
                    <button class="neko-button save-edit" onclick="saveDiaryEdit(${diaryId})">保存</button>
                    <button class="neko-button cancel-edit" onclick="cancelDiaryEdit(${diaryId})">キャンセル</button>
                </div>
            </div>
        </div>
    `;
}

async function saveDiaryEdit(diaryId) {
    const entry = document.querySelector(`[data-id="${diaryId}"]`);
    if (!entry) return;

    const content = entry.querySelector('.diary-edit-input').value;
    const category = entry.querySelector('.edit-category').value;
    const tags = Array.from(currentTags);

    try {
        await diaryManager.updateDiary(diaryId, content, category, tags);
        await renderDiaries();
        showNekoAlert('✨ 更新できたにゃ！', '#70DB93');
    } catch (error) {
        console.error('更新エラー:', error);
        showNekoAlert('❌ 更新できなかったにゃ...', '#FF4500', 3500);
    }
}

async function cancelDiaryEdit(diaryId) {
    await renderDiaries();
}

// 分页控件渲染
function renderPagination() {
    const paginationContainer = document.getElementById('pagination');
    const totalPages = diaryManager.getPageCount();
    const currentPage = diaryManager.currentPage;

    let html = '<div class="pagination">';
    
    // 上一页按钮
    html += `<button class="page-button" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">←</button>`;
    
    // 页码按钮
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            html += `<button class="page-button ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            html += '<span class="page-ellipsis">...</span>';
        }
    }
    
    // 下一页按钮
    html += `<button class="page-button" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">→</button>`;
    
    html += '</div>';
    paginationContainer.innerHTML = html;
}

async function changePage(page) {
    diaryManager.setPage(page);
    await renderDiaries();
}

// 更新日记渲染函数
async function renderDiaries(diaries = null) {
    try {
        const list = document.getElementById('diary-list');
        const entries = diaries || diaryManager.getCurrentPageDiaries();
        
        list.innerHTML = entries.map(diary => `
            <li class="diary-entry" data-id="${diary.id}">
                <div class="diary-header">
                    <div class="diary-meta">
                        <span class="diary-date">📅 ${diaryManager.getFormattedDate(diary.date)}</span>
                        <span class="diary-category">${diary.category}</span>
                    </div>
                    <div class="diary-tags">
                        ${(diary.tags || []).map(tag => `
                            <span class="tag">${tag}</span>
                        `).join('')}
                    </div>
                    <div class="diary-actions">
                        <button onclick="enterEditMode(${diary.id})" class="edit-btn">✏️</button>
                        <button onclick="deleteDiary(${diary.id})" class="delete-btn">🗑️</button>
                    </div>
                </div>
                <p class="diary-content">${diary.content}</p>
            </li>
        `).join('');

        renderPagination();
        updateCategorySelector();
        updateTagsFilter();
    } catch (error) {
        console.error('表示エラー:', error);
        await logger.error('日記の表示中にエラーが発生', error);
        showNekoAlert('❌ 日記の表示中にエラーが発生したにゃ...', '#FF4500', 3500);
    }
}

function updateCategorySelector() {
    const categories = diaryManager.getCategories();
    const categorySelect = document.getElementById('diary-category');
    const searchCategorySelect = document.getElementById('search-category');
    
    const categoryOptions = categories.map(category => 
        `<option value="${category}">${category}</option>`
    ).join('');
    
    categorySelect.innerHTML = `<option value="未分類">未分類</option>${categoryOptions}`;
    searchCategorySelect.innerHTML = `<option value="">全てのカテゴリー</option>${categoryOptions}`;
}

function handleSearch() {
    const searchQuery = document.getElementById('search-input').value;
    const searchCategory = document.getElementById('search-category').value;
    const searchResults = diaryManager.searchDiaries(searchQuery, searchCategory, selectedTags);
    renderDiaries(searchResults.diaries);
}

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

document.addEventListener('DOMContentLoaded', async () => {
    new TimeUpdater().init();
    diaryManager = new DiaryManager();
    await renderDiaries();

    const diaryInput = document.getElementById('diary-content');
    const charCount = document.getElementById('char-count');

    // 文字数カウンター
    diaryInput.addEventListener('input', () => {
        charCount.textContent = diaryInput.value.length;
    });

    // 検索機能
    const searchInput = document.getElementById('search-input');
    const searchCategory = document.getElementById('search-category');
    let searchTimeout;

    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(handleSearch, 300);
    });

    searchCategory.addEventListener('change', handleSearch);

    // 日記保存
    document.getElementById('save-diary').addEventListener('click', async () => {
        const content = diaryInput.value.trim();
        const category = document.getElementById('diary-category').value;
        const tags = Array.from(currentTags);

        if (content.length < 1) {
            showNekoAlert('❌ 1文字以上書いてにゃい！', '#FF4500');
            return;
        }

        try {
            const saved = await diaryManager.saveDiary(content, category, tags);
            if (saved) {
                diaryInput.value = '';
                charCount.textContent = '0';
                currentTags.clear();
                updateTagsDisplay();
                showNekoAlert('🎉 保存できたにゃ！', '#70DB93');
                await renderDiaries();
            } else {
                throw new Error('保存に失敗しました');
            }
        } catch (error) {
            console.error('保存エラー:', error);
            await logger.error('日記の保存中にエラー', error);
            showNekoAlert('❌ 保存できなかったにゃ...もう一度試してみて！', '#FF4500', 3500);
        }
    });

    // 导出为 CSV
    document.getElementById('export-csv').addEventListener('click', async () => {
        try {
            await diaryManager.exportData('csv');
            showNekoAlert('✨ CSVファイルを出力したにゃ！', '#70DB93');
        } catch (error) {
            console.error('エクスポートエラー:', error);
            await logger.error('CSVエクスポート中にエラー', error);
            showNekoAlert('❌ 出力できなかったにゃ...', '#FF4500', 3500);
        }
    });

    // 导出为 JSON
    document.getElementById('export-json').addEventListener('click', async () => {
        try {
            await diaryManager.exportData('json');
            showNekoAlert('✨ JSONファイルを出力したにゃ！', '#70DB93');
        } catch (error) {
            console.error('エクスポートエラー:', error);
            await logger.error('JSONエクスポート中にエラー', error);
            showNekoAlert('❌ 出力できなかったにゃ...', '#FF4500', 3500);
        }
    });

    // 导入文件处理
    document.getElementById('import-file').addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const count = await diaryManager.importData(file);
            showNekoAlert(`✨ ${count}件の日記を取り込んだにゃ！`, '#70DB93');
            await renderDiaries();
        } catch (error) {
            console.error('インポートエラー:', error);
            await logger.error('インポート中にエラー', error);
            showNekoAlert('❌ 取り込みできなかったにゃ...', '#FF4500', 3500);
        } finally {
            event.target.value = ''; // 重置文件输入
        }
    });

    // 标签输入处理
    const tagInput = document.getElementById('tag-input');
    
    tagInput.addEventListener('input', (e) => {
        showSuggestions(e.target.value);
    });

    tagInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
            e.preventDefault();
            addTag(e.target.value);
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('#tag-suggestions')) {
            hideSuggestions();
        }
    });

    // iOS対応
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        document.body.classList.add('ios-touch');
        if (typeof FastClick !== 'undefined') {
            FastClick.attach(document.body);
        }
    }
});

// クリック処理
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

// 全局函数
window.addTag = addTag;
window.removeTag = removeTag;
window.toggleFilterTag = toggleFilterTag;
window.deleteDiary = deleteDiary;
window.enterEditMode = enterEditMode;
window.saveDiaryEdit = saveDiaryEdit;
window.cancelDiaryEdit = cancelDiaryEdit;
window.changePage = changePage;