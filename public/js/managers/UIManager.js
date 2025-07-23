import { DiaryManager } from '../DiaryManager.js';

export class UIManager {
    static instance = null;

    static getInstance() {
        if (!UIManager.instance) {
            UIManager.instance = new UIManager();
        }
        return UIManager.instance;
    }

    constructor() {
        if (UIManager.instance) {
            return UIManager.instance;
        }
        UIManager.instance = this;
    }

    hideSuggestions() {
        const suggestions = document.getElementById('tag-suggestions');
        suggestions.style.display = 'none';
    }

    showNekoAlert(message, color, duration = 2500) {
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
            font-family: 'KleeOne-Regular';
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

    async renderDiaries(diaries = null) {
        try {
            const list = document.getElementById('diary-list');
            const entries = diaries || window.diaryManager.getCurrentPageDiaries();
            
            list.innerHTML = entries.map(diary => `
                <li class="diary-entry" data-id="${diary.id}">
                    <div class="diary-header">
                        <div class="diary-meta">
                            <span class="diary-date">📅 ${window.diaryManager.getFormattedDate(diary.date)}</span>
                            <span class="diary-category">${diary.category}</span>
                        </div>
                        <div class="diary-tags">
                            ${(diary.tags || []).map(tag => `
                                <span class="tag">${tag}</span>
                            `).join('')}
                        </div>
                    </div>
                    <p class="diary-content">${diary.content.replace(/\n/g, '<br>')}</p>
                    <div class="diary-actions">
                        <button class="edit-btn" data-action="edit" data-id="${diary.id}">✏️</button>
                        <button class="delete-btn" data-action="delete" data-id="${diary.id}">🗑️</button>
                    </div>
                </li>
            `).join('');

            // Add event listeners
            list.querySelectorAll('[data-action]').forEach(button => {
                button.addEventListener('click', () => {
                    const action = button.dataset.action;
                    const id = parseInt(button.dataset.id);
                    if (action === 'edit') {
                        window.eventHandler.enterEditMode(id);
                    } else if (action === 'delete') {
                        window.eventHandler.deleteDiary(id);
                    }
                });
            });
    
            this.renderPagination(window.diaryManager);
            this.updateCategorySelector(window.diaryManager);
            window.tagManager.updateTagsFilter(window.diaryManager);
            
            // Diary input animation
            if (window.inputAnimator) {
                window.inputAnimator.initializeInputs();
            }
        } catch (error) {
            console.error('表示エラー:', error);
            await window.logger.error('日記の表示中にエラーが発生', error);
            this.showNekoAlert('❌ 日記の表示中にエラーが発生したにゃ...', '#FF4500', 3500);
        }
    }

    renderPagination(diaryManager) {
        const paginationContainer = document.getElementById('pagination');
        const totalPages = diaryManager.getPageCount();
        const currentPage = diaryManager.currentPage;
    
        let html = '<div class="pagination">';
        
        // Previous page button
        html += `<button class="page-button" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>←</button>`;
        
        // Page buttons
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                html += `<button class="page-button ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
            } else if (i === currentPage - 3 || i === currentPage + 3) {
                html += '<span class="page-ellipsis">...</span>';
            }
        }
        
        // Next page button
        html += `<button class="page-button" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>→</button>`;
        
        html += '</div>';
        paginationContainer.innerHTML = html;

        // Add event listeners for pagination
        paginationContainer.querySelectorAll('button:not([disabled])').forEach(button => {
            button.addEventListener('click', () => {
                window.eventHandler.changePage(parseInt(button.dataset.page));
            });
        });
    }

    updateCategorySelector(diaryManager) {
        const categories = diaryManager.getCategories();
        const categorySelect = document.getElementById('diary-category');
        const searchCategorySelect = document.getElementById('search-category');
        
        // Count the frequency of category usage (exclude the current category to avoid duplicates)
        const categoryFrequency = {};
        diaryManager.diaries.forEach(diary => {
            if (diary.category) {
                const category = diary.category.trim();
                categoryFrequency[category] = (categoryFrequency[category] || 0);
            }
        });

        // Generate option HTML
        const generateOptions = (includeAll = false) => {
            let html = includeAll ? '<option value="">全てのカテゴリー</option>' : '';
            
            // Add frequently used categories (top 5 categories by usage frequency)
            const frequentCategories = Object.entries(categoryFrequency)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([cat]) => cat)
                .filter(cat => !!cat); // Filter out empty categories
            
            if (frequentCategories.length > 0) {
                html += '<optgroup label="よく使うカテゴリー">';
                frequentCategories.forEach(category => {
                    html += `<option value="${category}">${category}</option>`;
                });
                html += '</optgroup>';
            }

            // Add default categories
            html += '<optgroup label="すべてのカテゴリー">';
            DiaryManager.defaultCategories.forEach(category => {
                if (!frequentCategories.includes(category)) {
                    html += `<option value="${category}">${category}</option>`;
                }
            });
            html += '</optgroup>';

            // Add custom categories
            const customCategories = categories.filter(cat => 
                !DiaryManager.defaultCategories.includes(cat) && !frequentCategories.includes(cat)
            );
            if (customCategories.length > 0) {
                html += '<optgroup label="カスタムカテゴリー">';
                customCategories.forEach(category => {
                    html += `<option value="${category}">${category}</option>`;
                });
                html += '</optgroup>';
            }

            return html;
        };
        
        categorySelect.innerHTML = generateOptions(false);
        searchCategorySelect.innerHTML = generateOptions(true);
    }

    updateEditTagsDisplay(entryElement) {
        const tagsDisplay = entryElement.querySelector('#edit-tags-display');
        const currentTags = window.tagManager.getCurrentTags();
        tagsDisplay.innerHTML = currentTags.map(tag => `
            <span class="tag">
                ${tag}
                <span class="tag-remove" onclick="window.tagManager.removeTag('${tag}')">&times;</span>
            </span>
        `).join('');
    }

    updateCharCount(input, countElement) {
        countElement.textContent = input.value.length;
    }

    initializeiOSSupport() {
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            document.body.classList.add('ios-touch');
            if (typeof FastClick !== 'undefined') {
                FastClick.attach(document.body);
            }
        }
    }

    handleDiaryInputAnimation(diaryInput, isActive) {
        if (isActive) {
            diaryInput.style.animation = 'inputClick 0.4s var(--easing) forwards';
        } else {
            diaryInput.style.transform = 'scale(1)';
        }
    }
}
