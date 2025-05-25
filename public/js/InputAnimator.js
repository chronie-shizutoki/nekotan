// 输入框动画管理类
export class InputAnimator {
    constructor() {
        this.initializeInputs();
    }

    initializeInputs() {
        // 为新创建的输入框添加动画类
        document.querySelectorAll('.input-field-animation').forEach(input => {
            if (!input.classList.contains('initialized')) {
                input.classList.add('new-entry');
                input.classList.add('initialized');
            }
        });

        // 移除已完成动画的类
        setTimeout(() => {
            document.querySelectorAll('.new-entry').forEach(input => {
                input.classList.remove('new-entry');
            });
        }, 800); // 与 CSS 动画时长匹配
    }
}
