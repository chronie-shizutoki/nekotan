// 入力フィールドのアニメーションを管理するクラス
export class InputAnimator {
    constructor() {
        this.initializeInputs();
    }

    initializeInputs() {
        // 新しく作成された入力フィールドにアニメーションクラスを追加する
        document.querySelectorAll('.input-field-animation').forEach(input => {
            if (!input.classList.contains('initialized')) {
                input.classList.add('new-entry');
                input.classList.add('initialized');
            }
        });

        // アニメーションが完了したクラスを削除する
        setTimeout(() => {
            document.querySelectorAll('.new-entry').forEach(input => {
                input.classList.remove('new-entry');
            });
        }, 800); // CSSアニメーションの時間と一致させる
    }
}
