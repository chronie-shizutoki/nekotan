// Manage the animation of input fields
export class InputAnimator {
    constructor() {
        this.initializeInputs();
    }

    initializeInputs() {
        // Add animation class to newly created input fields
        document.querySelectorAll('.input-field-animation').forEach(input => {
            if (!input.classList.contains('initialized')) {
                input.classList.add('new-entry');
                input.classList.add('initialized');
            }
        });

        // Remove the animation class after the animation is complete
        setTimeout(() => {
            document.querySelectorAll('.new-entry').forEach(input => {
                input.classList.remove('new-entry');
            });
        }, 800); // Match the CSS animation duration
    }
}
