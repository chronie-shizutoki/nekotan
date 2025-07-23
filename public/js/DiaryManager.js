import { Logger } from './Logger.js';

export class DiaryManager {
    static defaultCategories = [
        '未分類',
        '日常', // 日常生活
        '仕事', // 仕事関連
        '勉強', // 勉強ノート
        '趣味', // 趣味・娯楽
        '思考', // 思考・感想
        '旅行', // 旅行の出来事
        '健康', // 健康・運動
        '創作', // 創作のインスピレーション
        '読書', // 読書ノート
        '料理', // 料理体験
        '夢', // 夢の記録
        '目標', // 目標・計画
        '映画', // 映画の感想
        'ゲーム', // ゲーム体験
        '音楽' // 音楽感想
    ];

    static instance = null;

    static async getInstance() {
        if (!DiaryManager.instance) {
            const instance = new DiaryManager();
            await instance.initialize();
            DiaryManager.instance = instance;
        }
        return DiaryManager.instance;
    }

    constructor() {
        if (DiaryManager.instance) {
            return DiaryManager.instance;
        }
        this.diaries = [];
        this.logger = Logger.getInstance();
        this.pageSize = 5;
        this.currentPage = 1;
    }

    async initialize() {
        await this.loadDiaries();
        return this;
    }

    async loadDiaries() {
        try {
            const baseUrl = window.location.origin;
            const response = await fetch(`${baseUrl}/diaries.csv`, {
                method: 'GET',
                headers: {
                    'Accept': 'text/csv',
                    'Content-Type': 'text/csv'
                },
                credentials: 'same-origin'
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const text = await response.text();
            this.diaries = this.parseCSV(text);
            await this.logger.info('日記データを読み込みました');
        } catch (e) {
            await this.logger.error('CSV読み取り失敗:', e);
            this.diaries = [];
        }
    }

    parseCSV(text) {
        if (!text.trim()) return [];
        const lines = text.trim().split(/\r?\n(?=(?:[^"]*"[^"]*")*[^"]*$)/);
        if (lines.length > 1) {
            return lines.slice(1).map(line => {
                const [id, date, content, category = '未分類', tags = ''] = line.split(',').map(field => 
                    field.replace(/^"(.*)"$/, '$1').replace(/""/g, '"')
                );
                return {
                    id: parseInt(id),
                    date: date,
                    content: content,
                    category: category,
                    tags: tags ? tags.split(';').filter(Boolean) : []
                };
            });
        }
        return [];
    }

    toCSV() {
        const header = 'id,date,content,category,tags\n';
        const rows = this.diaries.map(diary => {
            if (!diary || !diary.content) return '';
            const escapedContent = (diary.content || '').replace(/"/g, '""');
            const escapedCategory = (diary.category || '未分類').replace(/"/g, '""');
            const escapedTags = ((diary.tags && Array.isArray(diary.tags)) ? diary.tags : []).join(';').replace(/"/g, '""');
            return `${diary.id || Date.now()},"${diary.date || new Date().toISOString()}","${escapedContent}","${escapedCategory}","${escapedTags}"`;
        }).filter(row => row).join('\n');
        return header + rows;
    }

    async saveDiary(content, category = '未分類', tags = []) {
        const errors = this.validateDiary(content, category, tags);
        if (errors.length > 0) {
            throw new Error(errors.join('\n'));
        }

        const newDiary = {
            id: Date.now(),
            date: new Date().toISOString(),
            content: content.trim(),
            category: category.trim() || '未分類',
            tags: tags.map(tag => tag.trim()).filter(Boolean)
        };

        this.diaries.unshift(newDiary);
        
        try {
            const csvContent = this.toCSV();
            const baseUrl = window.location.origin;
            const response = await fetch(`${baseUrl}/save-diary`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'text/csv',
                },
                credentials: 'same-origin',
                body: csvContent
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || '保存に失敗しました');
            }
            
            await this.logger.info('日記を保存しました');
            return true;
        } catch (e) {
            await this.logger.error('CSV書き込み失敗:', e);
            // 保存に失敗したため、先ほど追加したエントリを削除します
            this.diaries.shift();
            throw e;
        }
    }

    async deleteDiary(id) {
        try {
            this.diaries = this.diaries.filter(d => d.id !== id);
            const csvContent = this.toCSV();
            const baseUrl = window.location.origin;
            const response = await fetch(`${baseUrl}/save-diary`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/csv',
                },
                body: csvContent
            });

            if (!response.ok) throw new Error('削除に失敗しました');
            await this.logger.info(`日記(ID: ${id})を削除しました`);
        } catch (e) {
            await this.logger.error(`日記(ID: ${id})の削除に失敗:`, e);
            throw e;
        }
    }

    async updateDiary(id, content, category, tags) {
        const index = this.diaries.findIndex(d => d.id === id);
        if (index === -1) {
            throw new Error('日記が見つかりません');
        }

        this.diaries[index] = {
            ...this.diaries[index],
            content: content.trim(),
            category: category.trim() || '未分類',
            tags: tags.map(tag => tag.trim()).filter(Boolean),
            date: new Date().toISOString()
        };

        try {
            const csvContent = this.toCSV();
            const baseUrl = window.location.origin;
            const response = await fetch(`${baseUrl}/save-diary`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/csv',
                },
                body: csvContent
            });

            if (!response.ok) {
                throw new Error('保存に失敗しました');
            }
            
            await this.logger.info(`日記(ID: ${id})を更新しました`);
            return true;
        } catch (e) {
            await this.logger.error(`日記(ID: ${id})の更新に失敗:`, e);
            throw e;
        }
    }

    // 検索機能をサポートする
    searchDiaries(query, category = null, selectedTags = [], page = 1) {
        const filteredDiaries = this.diaries.filter(diary => {
            const contentMatch = diary.content.toLowerCase().includes(query.toLowerCase());
            const categoryMatch = !category || diary.category === category;
            const tagsMatch = selectedTags.length === 0 || 
                selectedTags.every(tag => diary.tags && diary.tags.includes(tag));
            return contentMatch && categoryMatch && tagsMatch;
        });

        const start = (page - 1) * this.pageSize;
        const end = start + this.pageSize;
        
        return {
            diaries: filteredDiaries.slice(start, end),
            totalPages: Math.ceil(filteredDiaries.length / this.pageSize),
            totalResults: filteredDiaries.length
        };
    }

    // すべてのカテゴリーを取得する
    getCategories() {
        // すべての使用中のカテゴリーを取得する
        const usedCategories = new Set(this.diaries.map(diary => diary.category));
        // デフォルトカテゴリーと使用中のカテゴリーをマージし、重複を排除する
        return Array.from(new Set([...DiaryManager.defaultCategories, ...usedCategories]));
    }

    // すべてのタグを取得する
    getTags() {
        const tagSet = new Set();
        this.diaries.forEach(diary => {
            if (diary.tags) {
                diary.tags.forEach(tag => tagSet.add(tag));
            }
        });
        return Array.from(tagSet).sort();
    }

    getFormattedDate(isoString) {
        try {
            const date = new Date(isoString);
            const weekday = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];
            return `${date.getFullYear()}年${(date.getMonth()+1).toString().padStart(2,'0')}月${date.getDate().toString().padStart(2,'0')}日（${weekday}）${date.getHours().toString().padStart(2,'0')}：${date.getMinutes().toString().padStart(2,'0')}：${date.getSeconds().toString().padStart(2,'0')}`;
        } catch (e) {
            this.logger.error('日付のフォーマットに失敗:', e);
            return isoString;
        }
    }

    // ページング機能をサポートする
    getPageCount() {
        return Math.ceil(this.diaries.length / this.pageSize);
    }

    getCurrentPageDiaries() {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        return this.diaries.slice(start, end);
    }

    setPage(page) {
        const maxPage = this.getPageCount();
        this.currentPage = Math.max(1, Math.min(page, maxPage));
    }

    // データの検証をサポートする
    validateDiary(content, category = '未分類', tags = []) {
        const errors = [];
        
        if (!content || content.trim().length === 0) {
            errors.push('内容は必須です');
        }
        
        if (content && content.trim().length > 5000) {
            errors.push('内容は5000文字以内にしてください');
        }
        
        if (category && category.trim().length > 50) {
            errors.push('カテゴリーは50文字以内にしてください');
        }

        if (tags.length > 10) {
            errors.push('タグは10個まで設定できます');
        }

        if (tags.some(tag => tag.trim().length > 20)) {
            errors.push('タグは20文字以内にしてください');
        }

        return errors;
    }

    // 日記の更新をサポートする
    async updateDiary(id, content, category = '未分類', tags = []) {
        try {
            const errors = this.validateDiary(content, category, tags);
            if (errors.length > 0) {
                throw new Error(errors.join('\n'));
            }

            const diaryIndex = this.diaries.findIndex(d => d.id === id);
            if (diaryIndex === -1) {
                throw new Error('日記が見つかりません');
            }

            this.diaries[diaryIndex] = {
                ...this.diaries[diaryIndex],
                content: content.trim(),
                category: category.trim() || '未分類',
                tags: tags.map(tag => tag.trim()).filter(Boolean),
                updatedAt: new Date().toISOString()
            };

            const csvContent = this.toCSV();
            const response = await fetch('/save-diary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/csv',
                },
                body: csvContent
            });

            if (!response.ok) throw new Error('更新に失敗しました');
            await this.logger.info(`日記(ID: ${id})を更新しました`);
            return true;
        } catch (e) {
            await this.logger.error(`日記(ID: ${id})の更新に失敗:`, e);
            throw e;
        }
    }

    // データのエクスポートをサポートする
    async exportData(format = 'csv') {
        try {
            let data;
            let mimeType;
            let filename;
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

            if (format === 'json') {
                data = JSON.stringify(this.diaries, null, 2);
                mimeType = 'application/json';
                filename = `nekochan-diary-${timestamp}.json`;
            } else {
                data = this.toCSV();
                mimeType = 'text/csv';
                filename = `nekochan-diary-${timestamp}.csv`;
            }

            const blob = new Blob([data], { type: mimeType });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);

            await this.logger.info(`日記データを${format}形式でエクスポートしました`);
            return true;
        } catch (e) {
            await this.logger.error('エクスポート中にエラーが発生:', e);
            throw e;
        }
    }

    // データのインポートをサポートする
    async importData(file) {
        try {
            const content = await this.readFile(file);
            const format = file.name.toLowerCase().endsWith('.json') ? 'json' : 'csv';
            let importedDiaries;

            if (format === 'json') {
                importedDiaries = await this.parseJSON(content);
            } else {
                importedDiaries = this.parseCSV(content);
            }

            // インポートされたデータの形式を検証する
            if (!this.validateImportedData(importedDiaries)) {
                throw new Error('インポートされたデータの形式が正しくありません');
            }

            // データをマージし、重複を避ける
            const existingIds = new Set(this.diaries.map(d => d.id));
            const newDiaries = importedDiaries.filter(d => !existingIds.has(d.id));
            
            this.diaries = [...this.diaries, ...newDiaries].sort((a, b) => b.id - a.id);
            
            // 保存マージされたデータ
            const csvContent = this.toCSV();
            const response = await fetch('/save-diary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/csv',
                },
                body: csvContent
            });

            if (!response.ok) throw new Error('インポートされたデータの保存に失敗しました');
            
            await this.logger.info(`${format}形式から${newDiaries.length}件の日記をインポートしました`);
            return newDiaries.length;
        } catch (e) {
            await this.logger.error('インポート中にエラーが発生:', e);
            throw e;
        }
    }

    // データを非同期的に読み取る
    async readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    }

    // 解析 JSON データ
    async parseJSON(content) {
        try {
            const data = JSON.parse(content);
            if (!Array.isArray(data)) {
                throw new Error('JSONデータは配列である必要があります');
            }
            return data;
        } catch (e) {
            throw new Error('JSONデータの解析に失敗しました: ' + e.message);
        }
    }

    // インポートされたデータの形式を検証する
    validateImportedData(diaries) {
        if (!Array.isArray(diaries)) return false;
        
        return diaries.every(diary => {
            return (
                diary &&
                typeof diary.id === 'number' &&
                typeof diary.date === 'string' &&
                typeof diary.content === 'string' &&
                (!diary.category || typeof diary.category === 'string') &&
                (!diary.tags || Array.isArray(diary.tags))
            );
        });
    }
}