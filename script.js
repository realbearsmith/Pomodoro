class PomodoroTimer {
    constructor() {
        this.workTime = 25 * 60; // 25 minutes in seconds
        this.breakTime = 5 * 60; // 5 minutes in seconds
        this.timeLeft = this.workTime;
        this.isRunning = false;
        this.isWorkSession = true;
        this.timer = null;

        // DOM elements
        this.minutesDisplay = document.getElementById('minutes');
        this.secondsDisplay = document.getElementById('seconds');
        this.sessionType = document.getElementById('session-type');
        this.startButton = document.getElementById('start');
        this.pauseButton = document.getElementById('pause');
        this.resetButton = document.getElementById('reset');
        this.addFiveBtn = document.getElementById('add-five');
        this.subtractFiveBtn = document.getElementById('subtract-five');

        // Event listeners
        this.startButton.addEventListener('click', () => this.start());
        this.pauseButton.addEventListener('click', () => this.pause());
        this.resetButton.addEventListener('click', () => this.reset());
        this.addFiveBtn.addEventListener('click', () => this.adjustTime(5));
        this.subtractFiveBtn.addEventListener('click', () => this.adjustTime(-5));

        this.updateDisplay();
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.timer = setInterval(() => this.tick(), 1000);
            this.startButton.disabled = true;
            this.toggleBackgroundAnimation();
        }
    }

    pause() {
        this.isRunning = false;
        clearInterval(this.timer);
        this.startButton.disabled = false;
        this.toggleBackgroundAnimation();
    }

    reset() {
        this.pause();
        this.timeLeft = this.isWorkSession ? this.workTime : this.breakTime;
        this.updateDisplay();
        this.updateSessionType();
        this.updateTitle();
    }

    tick() {
        this.timeLeft--;

        if (this.timeLeft < 0) {
            this.switchSession();
        }

        this.updateDisplay();
    }

    switchSession() {
        this.isWorkSession = !this.isWorkSession;
        this.timeLeft = this.isWorkSession ? this.workTime : this.breakTime;
        this.updateSessionType();
        this.notifySessionChange();
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;

        this.minutesDisplay.textContent = minutes.toString().padStart(2, '0');
        this.secondsDisplay.textContent = seconds.toString().padStart(2, '0');
        this.updateProgress();
        this.updateTitle();
    }

    updateSessionType() {
        this.sessionType.textContent = this.isWorkSession ? 'WORK' : 'REST';
    }

    notifySessionChange() {
        if (Notification.permission === 'granted') {
            new Notification(this.isWorkSession ? 'Work Session Started' : 'Break Time!');
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission();
        }
    }

    adjustTime(minutes) {
        const newTime = this.timeLeft + (minutes * 60);
        if (newTime >= 60) { // More than a minute
            this.timeLeft = newTime;
        } else if (minutes < 0 && this.timeLeft > 0) { // Less than a minute after subtraction
            this.timeLeft = 1; // Set to 1 second
        }
        this.updateDisplay();
    }

    updateProgress() {
        const circle = document.querySelector('.timer-progress');
        const totalTime = this.isWorkSession ? this.workTime : this.breakTime;
        const progress = (this.timeLeft / totalTime);
        const circumference = 2 * Math.PI * 45; // radius is 45
        const offset = circumference * (1 - progress);
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = offset;
    }

    updateTitle() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        const sessionType = this.isWorkSession ? 'Work' : 'Break';
        document.title = `${timeString} - ${sessionType} | Pomodoro Timer`;
    }

    toggleBackgroundAnimation() {
        const background = document.querySelector('.animated-background');
        if (this.isRunning) {
            background.style.animationPlayState = 'running';
        } else {
            background.style.animationPlayState = 'paused';
        }
    }
}

// Initialize the timer
const pomodoro = new PomodoroTimer();

document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
});

// Set initial theme
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-theme');
} 