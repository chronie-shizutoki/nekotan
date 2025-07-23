export class TagManager {
    static instance = null;

    static getInstance() {
        if (!TagManager.instance) {
            TagManager.instance = new TagManager();
        }
        return TagManager.instance;
    }

    constructor() {
        if (TagManager.instance) {
            return TagManager.instance;
        }
        this.selectedTags = [];
        this.currentTags = new Set();
        TagManager.instance = this;
    }

    updateTagsDisplay() {
        const tagsDisplay = document.getElementById('tags-display');
        tagsDisplay.innerHTML = this.currentTags.size ? Array.from(this.currentTags).map(tag => `
            <span class="tag" data-tag="${tag}">
                ${tag}
                <span class="tag-remove" data-tag="${tag}">&times;</span>
            </span>
        `).join('') : '';

        // Add event listeners
        tagsDisplay.querySelectorAll('.tag-remove').forEach(elem => {
            elem.addEventListener('click', () => this.removeTag(elem.dataset.tag));
        });
    }

    updateTagsFilter(diaryManager) {
        const tagsFilter = document.getElementById('tags-filter');
        const allTags = diaryManager.getTags();
        tagsFilter.innerHTML = allTags.map(tag => `
            <span class="filter-tag ${this.selectedTags.includes(tag) ? 'active' : ''}"
                  data-tag="${tag}">
                ${tag}
            </span>
        `).join('');

        // Add event listeners
        tagsFilter.querySelectorAll('.filter-tag').forEach(elem => {
            elem.addEventListener('click', () => this.toggleFilterTag(elem.dataset.tag));
        });
    }

    addTag(tag) {
        const trimmedTag = tag.trim();
        if (trimmedTag && this.currentTags.size < 10 && trimmedTag.length <= 20) {
            this.currentTags.add(trimmedTag);
            this.updateTagsDisplay();
            document.getElementById('tag-input').value = '';
            window.uiManager.hideSuggestions();
        }
    }

    removeTag(tag) {
        this.currentTags.delete(tag);
        const editBox = document.querySelector('.diary-edit-box');
        if (editBox) {
            window.uiManager.updateEditTagsDisplay(editBox.closest('.diary-entry'));
        } else {
            this.updateTagsDisplay();
        }
    }

    toggleFilterTag(tag) {
        const index = this.selectedTags.indexOf(tag);
        if (index === -1) {
            this.selectedTags.push(tag);
        } else {
            this.selectedTags.splice(index, 1);
        }
        this.updateTagsFilter(window.diaryManager);
        window.eventHandler.handleSearch();
    }

    showSuggestions(input) {
        const allTags = window.diaryManager.getTags();
        const matchingTags = allTags.filter(tag => 
            tag.toLowerCase().includes(input.toLowerCase()) &&
            !this.currentTags.has(tag)
        );

        const suggestions = document.getElementById('tag-suggestions');
        if (matchingTags.length && input) {
            suggestions.innerHTML = matchingTags.map(tag => `
                <div class="tag-suggestion-item" data-tag="${tag}">${tag}</div>
            `).join('');
            
            // Add event listeners
            suggestions.querySelectorAll('.tag-suggestion-item').forEach(elem => {
                elem.addEventListener('click', () => this.addTag(elem.dataset.tag));
            });
            
            const inputRect = document.getElementById('tag-input').getBoundingClientRect();
            suggestions.style.setProperty('--top', `${inputRect.bottom + window.scrollY + 5}px`);
        suggestions.style.setProperty('--left', `${inputRect.left}px`);
        suggestions.style.setProperty('--min-width', `${inputRect.width}px`);
        suggestions.classList.add('tag-suggestions-visible');
        } else {
            window.uiManager.hideSuggestions();
        }
    }

    getCurrentTags() {
        return Array.from(this.currentTags);
    }

    getSelectedTags() {
        return this.selectedTags;
    }

    setCurrentTags(tags) {
        this.currentTags = new Set(tags || []);
        this.updateTagsDisplay();
    }
}
