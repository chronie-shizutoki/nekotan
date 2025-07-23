export class SakuraEffect {
    constructor() {
        this.canvas = document.getElementById('sakura-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.petals = [];
        this.MAX = 100;
        this.petalImage = new Image();
        this.petalImage.src = "/vendor/picture/sakura.svg";
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.init();
        this.petalImage.onload = () => this.animate();
    }

    resize() {
        const { offsetWidth, offsetHeight } = this.canvas;
        this.canvas.width = offsetWidth;
        this.canvas.height = offsetHeight;
    }

    init() {
        for (let i = 0; i < this.MAX; i++) {
            this.petals.push(new Petal(this.canvas.width, this.canvas.height));
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let petal of this.petals) {
            petal.update();
            petal.draw(this.ctx, this.petalImage);
        }
        requestAnimationFrame(() => this.animate());
    }
}

class Petal {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvasWidth;
        this.y = Math.random() * -this.canvasHeight;
        this.z = Math.random() * 0.5 + 0.5; 
        this.size = this.z * 20 + 10;
        this.speedY = this.z * 1.5 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.angle = Math.random() * 360;
        this.rotateSpeed = (Math.random() - 0.5) * 2;
        this.swing = Math.random() * 100 + 50;
    }

    update() {
        this.y += this.speedY;
        this.x += Math.sin((this.y + this.angle) / this.swing) * this.z * 2 + this.speedX;
        this.angle += this.rotateSpeed;

        if (this.y > this.canvasHeight + this.size) {
            this.reset();
            this.y = -this.size;
        }
    }

    draw(ctx, image) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.angle * Math.PI) / 180);
        ctx.drawImage(image, -this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SakuraEffect();
});