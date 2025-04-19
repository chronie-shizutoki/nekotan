export class TimeUpdater {
    constructor() {
        this.lastTime = '00:00:00';
        this.rafId = null;
        this.weekdays = ["日", "月", "火", "水", "木", "金", "土"];
    }

    init() {
        this.update();
    }

    update() {
        const now = new Date();
        this.updateDate(now);
        this.updateTime(now);
        this.rafId = requestAnimationFrame(() => this.update());
    }

    updateDate(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const weekday = this.weekdays[date.getDay()];
        document.getElementById('current-date').textContent = 
            `${year}年${month}月${day}日\u00A0\u00A0${weekday}曜日`;
    }

    updateTime(date) {
        const timeStr = [
            date.getHours().toString().padStart(2, '0'),
            date.getMinutes().toString().padStart(2, '0'),
            date.getSeconds().toString().padStart(2, '0')
        ].join(':');

        if (timeStr !== this.lastTime) {
            this.animateDigits(timeStr);
            this.lastTime = timeStr;
        }
    }

    animateDigits(newTime) {
        const timeElement = document.getElementById('current-time');
        const chars = newTime.split('');
        let html = '';
        
        timeElement.innerHTML = '';
        
        chars.forEach((char, index) => {
            const prevChar = this.lastTime[index] || '';
            const isChanging = prevChar !== char;
            html += `
                <div class="flip-card${isChanging ? ' flipping' : ''}">
                    <span class="front">${isChanging ? prevChar : char}</span>
                    <span class="back">${char}</span>
                </div>
            `;
        });

        const wrapper = document.createElement('div');
        wrapper.className = 'time-flip';
        wrapper.innerHTML = html;
        timeElement.appendChild(wrapper);

        setTimeout(() => {
            wrapper.querySelectorAll('.flip-card').forEach(card => {
                card.classList.remove('flipping');
            });
        }, 600);
    }
}