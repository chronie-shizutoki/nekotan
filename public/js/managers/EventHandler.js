import { DiaryManager } from '../DiaryManager.js';

export class EventHandler {
    static instance = null;

    static getInstance() {
        if (!EventHandler.instance) {
            EventHandler.instance = new EventHandler();
        }
        return EventHandler.instance;
    }

    constructor() {
        if (EventHandler.instance) {
            return EventHandler.instance;
        }
        this.searchTimeout = null;
        EventHandler.instance = this;
    }

    async deleteDiary(id) {
        const entry = document.querySelector(`[data-id="${id}"]`);
        if (!entry) return;
    
        if (!confirm('本当に削除しますか？')) return;
    
        try {
            entry.style.animation = 'slideOutRight 0.4s var(--easing) forwards';
            await new Promise(resolve => entry.addEventListener('animationend', resolve, { once: true }));
            await window.diaryManager.deleteDiary(id);
            await window.uiManager.renderDiaries();
            window.uiManager.showNekoAlert('🗑️ 削除したにゃ！', '#70DB93');
        } catch (error) {
            console.error('削除エラー:', error);
            await window.logger.error('日記の削除中にエラー', error);
            window.uiManager.showNekoAlert('❌ 削除できなかったにゃ...もう一度試してみて！', '#FF4500', 3500);
        }
    }

    enterEditMode(diaryId) {
        const entry = document.querySelector(`[data-id="${diaryId}"]`);
        if (!entry) return;
    
        const diary = window.diaryManager.diaries.find(d => d.id === diaryId);
        if (!diary) return;
    
        window.tagManager.setCurrentTags(diary.tags);
        
        entry.innerHTML = `
            <div class="diary-edit-box">
                <textarea class="diary-edit-input">${diary.content}</textarea>
                <div class="diary-edit-footer">
                    <div class="input-group">
                        <select class="category-select edit-category">
                            ${(() => {
                                const diaryManager = window.diaryManager;
                                const categories = diaryManager.getCategories();
                                const categoryFrequency = {};
                                diaryManager.diaries.forEach(d => {
                                    categoryFrequency[d.category] = (categoryFrequency[d.category] || 0) + 1;
                                });

                                // 获取常用分类
                                const frequentCategories = Object.entries(categoryFrequency)
                                    .sort(([,a], [,b]) => b - a)
                                    .slice(0, 5)
                                    .map(([cat]) => cat);

                                let html = '';
                                // 常用分类组
                                if (frequentCategories.length > 0) {
                                    html += '<optgroup label="よく使うカテゴリー">';
                                    frequentCategories.forEach(cat => {
                                        html += `<option value="${cat}" ${cat === diary.category ? 'selected' : ''}>
                                            ${cat} (${categoryFrequency[cat]})
                                        </option>`;
                                    });
                                    html += '</optgroup>';
                                }

                                // 默认分类组
                                html += '<optgroup label="すべてのカテゴリー">';
                                DiaryManager.defaultCategories
                                    .filter(cat => !frequentCategories.includes(cat))
                                    .forEach(cat => {
                                        html += `<option value="${cat}" ${cat === diary.category ? 'selected' : ''}>
                                            ${cat}${categoryFrequency[cat] ? ` (${categoryFrequency[cat]})` : ''}
                                        </option>`;
                                    });
                                html += '</optgroup>';

                                // 自定义分类组
                                const customCategories = categories.filter(cat => 
                                    !DiaryManager.defaultCategories.includes(cat) && 
                                    !frequentCategories.includes(cat)
                                );
                                if (customCategories.length > 0) {
                                    html += '<optgroup label="カスタムカテゴリー">';
                                    customCategories.forEach(cat => {
                                        html += `<option value="${cat}" ${cat === diary.category ? 'selected' : ''}>
                                            ${cat} (${categoryFrequency[cat]})
                                        </option>`;
                                    });
                                    html += '</optgroup>';
                                }

                                return html;
                            })()}
                        </select>
                    </div>
                    <div class="input-group">
                        <div class="tags-input-container">
                            <div id="edit-tags-display">
                                ${(diary.tags || []).map(tag => `
                                    <span class="tag" data-tag="${tag}">
                                        ${tag}
                                        <span class="tag-remove" data-tag="${tag}">&times;</span>
                                    </span>
                                `).join('')}
                            </div>
                            <input type="text" class="tag-input" 
                                   placeholder="タグを入力 (最大10個)"
                                   maxlength="20">
                        </div>
                    </div>
                    <div class="edit-buttons">
                        <button class="neko-button save-edit" data-action="save" data-id="${diaryId}">保存</button>
                        <button class="neko-button cancel-edit" data-action="cancel" data-id="${diaryId}">キャンセル</button>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners for tag management
        const editTagsDisplay = entry.querySelector('#edit-tags-display');
        editTagsDisplay.addEventListener('click', e => {
            const removeBtn = e.target.closest('.tag-remove');
            if (removeBtn) {
                const tag = removeBtn.dataset.tag;
                window.tagManager.removeTag(tag);
            }
        });
    
        // Add event listeners for edit actions
        const editButtons = entry.querySelector('.edit-buttons');
        editButtons.addEventListener('click', e => {
            const button = e.target.closest('button');
            if (!button) return;
            
            const action = button.dataset.action;
            const id = parseInt(button.dataset.id);
            
            if (action === 'save') {
                this.saveDiaryEdit(id);
            } else if (action === 'cancel') {
                this.cancelDiaryEdit(id);
            }
        });
    
        // Add event listener for tag input
        const tagInput = entry.querySelector('.tag-input');
        tagInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
                e.preventDefault();
                window.tagManager.addTag(e.target.value);
                window.uiManager.updateEditTagsDisplay(entry);
            }
        });
    }

    async saveDiaryEdit(diaryId) {
        const entry = document.querySelector(`[data-id="${diaryId}"]`);
        if (!entry) return;
    
        const content = entry.querySelector('.diary-edit-input').value.trim();
        const category = entry.querySelector('.edit-category').value;
        const tags = window.tagManager.getCurrentTags();
    
        if (content.length === 0) {
            window.uiManager.showNekoAlert('❌ 1文字以上書いてにゃい！', '#FF4500');
            return;
        }
    
        try {
            await window.diaryManager.updateDiary(diaryId, content, category, tags);
            await window.uiManager.renderDiaries();
            window.uiManager.showNekoAlert('✨ 更新できたにゃ！', '#70DB93');
        } catch (error) {
            console.error('更新エラー:', error);
            window.uiManager.showNekoAlert('❌ 更新できなかったにゃ...', '#FF4500', 3500);
        }
    }

    async cancelDiaryEdit(diaryId) {
        await window.uiManager.renderDiaries();
    }

    async changePage(page) {
        window.diaryManager.setPage(page);
        await window.uiManager.renderDiaries();
    }

    handleSearch() {
        const searchQuery = document.getElementById('search-input').value;
        const searchCategory = document.getElementById('search-category').value;
        const searchResults = window.diaryManager.searchDiaries(
            searchQuery, 
            searchCategory, 
            window.tagManager.getSelectedTags()
        );
        window.uiManager.renderDiaries(searchResults.diaries);
    }

    async handleSaveDiary() {
        const diaryInput = document.getElementById('diary-content');
        const content = diaryInput.value.trim();
        const category = document.getElementById('diary-category').value;
        const tags = window.tagManager.getCurrentTags();
        const charCount = document.getElementById('char-count');

        if (content.length < 1) {
            window.uiManager.showNekoAlert('❌ 1文字以上書いてにゃい！', '#FF4500');
            return;
        }

        try {
            await window.diaryManager.saveDiary(content, category, tags);
            diaryInput.value = '';
            charCount.textContent = '0';
            window.tagManager.setCurrentTags([]);
            window.uiManager.showNekoAlert('🎉 保存できたにゃ！', '#70DB93');
            await window.uiManager.renderDiaries();
        } catch (error) {
            console.error('保存エラー:', error);
            await window.logger.error('日記の保存中にエラー', error);
            window.uiManager.showNekoAlert(
                `❌ ${error.message || '保存できなかったにゃ...'}もう一度試してみて！`, 
                '#FF4500', 
                3500
            );
        }
    }

    async handleExport(format) {
        if (!['csv', 'json'].includes(format.toLowerCase())) {
            window.uiManager.showNekoAlert('❌ 未対応のファイル形式にゃ...', '#FF4500', 3500);
            return;
        }

        try {
            const result = await window.diaryManager.exportData(format);
            if (result) {
                window.uiManager.showNekoAlert(
                    `✨ ${format.toUpperCase()}ファイルを出力したにゃ！`, 
                    '#70DB93'
                );
                await window.logger.info(`${format}ファイルのエクスポートに成功`);
            } else {
                throw new Error('エクスポートに失敗しました');
            }
        } catch (error) {
            console.error('エクスポートエラー:', error);
            await window.logger.error(`${format}エクスポート中にエラー`, error);
            window.uiManager.showNekoAlert(
                `❌ ${error.message || '出力できなかったにゃ...'}`, 
                '#FF4500', 
                3500
            );
        }
    }

    async handleImport(file) {
        if (!file) return;

        try {
            const count = await window.diaryManager.importData(file);
            window.uiManager.showNekoAlert(`✨ ${count}件の日記を取り込んだにゃ！`, '#70DB93');
            await window.uiManager.renderDiaries();
        } catch (error) {
            console.error('インポートエラー:', error);
            await window.logger.error('インポート中にエラー', error);
            window.uiManager.showNekoAlert('❌ 取り込みできなかったにゃ...', '#FF4500', 3500);
        }
    }

    setupEventListeners() {
        // 文字数カウンター
        const diaryInput = document.getElementById('diary-content');
        const charCount = document.getElementById('char-count');
        diaryInput.addEventListener('input', () => {
            window.uiManager.updateCharCount(diaryInput, charCount);
        });

        // 検索機能
        const searchInput = document.getElementById('search-input');
        const searchCategory = document.getElementById('search-category');

        searchInput.addEventListener('input', () => {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => this.handleSearch(), 300);
        });

        searchCategory.addEventListener('change', () => this.handleSearch());

        // 日記保存
        document.getElementById('save-diary').addEventListener('click', () => this.handleSaveDiary());

        // エクスポート
        document.getElementById('export-csv').addEventListener('click', () => this.handleExport('csv'));
        document.getElementById('export-json').addEventListener('click', () => this.handleExport('json'));

        // インポート
        document.getElementById('import-file').addEventListener('change', (event) => {
            this.handleImport(event.target.files[0]);
            event.target.value = ''; // リセット
        });

        // タグ入力
        const tagInput = document.getElementById('tag-input');
        tagInput.addEventListener('input', (e) => {
            window.tagManager.showSuggestions(e.target.value);
        });

        tagInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
                e.preventDefault();
                window.tagManager.addTag(e.target.value);
            }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('#tag-suggestions')) {
                window.uiManager.hideSuggestions();
            }
        });

        // 日記入力のアニメーション
        diaryInput.addEventListener('focus', () => {
            window.uiManager.handleDiaryInputAnimation(diaryInput, true);
        });

        document.addEventListener('click', (e) => {
            if (!diaryInput.contains(e.target) && 
                !document.getElementById('save-diary').contains(e.target)) {
                window.uiManager.handleDiaryInputAnimation(diaryInput, false);
            }
        });
    }
}
