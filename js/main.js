// ======================= 主题切换功能 =======================

// 当前主题
let currentTheme = localStorage.getItem('selectedTheme') || 'dark';

// 初始化主题
function initTheme() {
    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
    }
}

// 初始化主题切换功能
function initThemeSwitcher() {
    const themeBtn = document.getElementById('theme-btn');
    const themeDropdown = document.getElementById('theme-dropdown');
    const themeOptions = document.querySelectorAll('.theme-option');

    if (!themeBtn || !themeDropdown) {
        console.error('主题切换元素未找到');
        return;
    }

    // 更新主题UI
    function updateThemeUI() {
        themeOptions.forEach(option => {
            option.classList.remove('active');
            if (option.dataset.theme === currentTheme) {
                option.classList.add('active');
            }
        });
    }

    // 切换主题下拉框显示
    themeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        themeDropdown.classList.toggle('show');
    });

    // 点击选项切换主题
    themeOptions.forEach(function(option) {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            const selectedTheme = option.dataset.theme;

            if (selectedTheme === 'light') {
                document.body.classList.add('light-theme');
                currentTheme = 'light';
            } else {
                document.body.classList.remove('light-theme');
                currentTheme = 'dark';
            }

            localStorage.setItem('selectedTheme', currentTheme);
            updateThemeUI();
            themeDropdown.classList.remove('show');
            showToast('已切换到' + (selectedTheme === 'light' ? '白色' : '深色') + '主题');
        });
    });

    // 点击页面其他地方关闭下拉框
    document.addEventListener('click', function() {
        themeDropdown.classList.remove('show');
    });

    updateThemeUI();
}

// ======================= Toast提示 =======================

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ======================= 手表充电提醒 =======================

function initWatchChargeReminder() {
    const watchChargeReminder = document.getElementById('watch-charge-reminder');

    function checkWatchChargeReminder() {
        const reminderHidden = localStorage.getItem('watchChargeReminderHidden');
        if (reminderHidden === 'true') {
            watchChargeReminder.classList.add('hidden');
        } else {
            watchChargeReminder.classList.remove('hidden');
        }
    }

    watchChargeReminder.addEventListener('click', function() {
        const confirmHide = confirm('您已经看到手表充电提醒，是否要隐藏此按钮？\n\n点击"确定"隐藏按钮，点击"取消"保持显示。');

        if (confirmHide) {
            watchChargeReminder.classList.add('hidden');
            localStorage.setItem('watchChargeReminderHidden', 'true');
            showToast('手表充电提醒已隐藏，如需重新显示请刷新页面');
        } else {
            showToast('好的，晚上记得给手表充电哦！');
        }
    });

    checkWatchChargeReminder();
}

// ======================= 时间显示 =======================

function getChineseWeekday(date) {
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    return weekdays[date.getDay()];
}

function getHuangdiYear() {
    const huangdiStartYear = -2697;
    const currentYear = new Date().getFullYear();
    return currentYear - huangdiStartYear;
}

function updateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const weekday = getChineseWeekday(now);
    const huangdiYear = getHuangdiYear();

    let timeString = '';
    if (window.innerWidth <= 768) {
        timeString = `(黄帝${huangdiYear}年)${year}年${month}月${day}日${weekday}${hours}:${minutes}:${seconds}`;
    } else {
        timeString = `(黄帝纪年${huangdiYear}年)${year}年${month}月${day}日 ${weekday} ${hours}:${minutes}:${seconds}`;
    }

    document.getElementById('current-time').textContent = timeString;

    const timestamp = Math.floor(now.getTime() / 1000);
    document.getElementById('current-timestamp').textContent = `当前时间戳: ${timestamp}`;
}

// ======================= Unix时间戳转换 =======================

function initTimestampTool() {
    const datetimeInput = document.getElementById('datetime-input');
    const timestampInput = document.getElementById('timestamp-input');
    const toTimestampBtn = document.getElementById('to-timestamp-btn');
    const toDatetimeBtn = document.getElementById('to-datetime-btn');
    const timestampResult = document.getElementById('timestamp-result');

    toTimestampBtn.addEventListener('click', function() {
        const datetimeStr = datetimeInput.value.trim();
        if (!datetimeStr) {
            timestampResult.textContent = '请输入日期时间';
            return;
        }

        let date;
        if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(datetimeStr)) {
            date = new Date(datetimeStr + ' 00:00:00');
        } else if (/^\d{4}-\d{1,2}-\d{1,2} \d{1,2}:\d{1,2}$/.test(datetimeStr)) {
            date = new Date(datetimeStr + ':00');
        } else if (/^\d{4}-\d{1,2}-\d{1,2} \d{1,2}:\d{1,2}:\d{1,2}$/.test(datetimeStr)) {
            date = new Date(datetimeStr);
        } else {
            date = new Date(datetimeStr);
        }

        if (isNaN(date.getTime())) {
            timestampResult.textContent = '日期格式错误，请使用格式: 2025-11-12 10:25:00';
            return;
        }

        const timestamp = Math.floor(date.getTime() / 1000);
        timestampResult.textContent = `时间戳: ${timestamp}`;
    });

    toDatetimeBtn.addEventListener('click', function() {
        const timestampStr = timestampInput.value.trim();
        if (!timestampStr) {
            timestampResult.textContent = '请输入Unix时间戳';
            return;
        }

        const timestamp = parseInt(timestampStr);
        if (isNaN(timestamp)) {
            timestampResult.textContent = '时间戳格式错误，请输入数字';
            return;
        }

        const date = new Date(timestamp * 1000);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        const datetimeStr = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        timestampResult.textContent = `北京时间(东八区)日期时间: ${datetimeStr}`;
    });

    datetimeInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') toTimestampBtn.click();
    });

    timestampInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') toDatetimeBtn.click();
    });
}

// ======================= 计时器功能 =======================

// 计时器变量
let timerInterval = null;
let timerStartTime = 0;
let timerElapsedTime = 0;
let timerRunning = false;
let timerTargetTime = 60 * 60 * 1000;
let timerMode = 0;

// 计时器DOM元素
const timerSetupBtn = document.getElementById('timer-setup-btn');
const timerStartBtn = document.getElementById('timer-start-btn');
const timerPauseBtn = document.getElementById('timer-pause-btn');
const timerResetBtn = document.getElementById('timer-reset-btn');
const timerModeBtn = document.getElementById('timer-mode-btn');
const timerDisplay = document.getElementById('timer-display');
const targetTimeDisplay = document.getElementById('target-time-display');
const targetTimeValue = document.getElementById('target-time-value');
const timerSetup = document.getElementById('timer-setup');
const digitWheelsContainer = document.getElementById('digit-wheels-container');
const applyTimerBtn = document.getElementById('apply-timer-btn');
const cancelTimerBtn = document.getElementById('cancel-timer-btn');

// 数字轮盘配置
const digitWheelConfigs = [
    { label: '年', id: 'years', min: 0, max: 99, defaultValue: 0 },
    { label: '月', id: 'months', min: 0, max: 11, defaultValue: 0 },
    { label: '日', id: 'days', min: 0, max: 30, defaultValue: 0 },
    { label: '时', id: 'hours', min: 0, max: 23, defaultValue: 1 },
    { label: '分', id: 'minutes', min: 0, max: 59, defaultValue: 0 },
    { label: '秒', id: 'seconds', min: 0, max: 59, defaultValue: 0 }
];

let digitWheels = [];
let activeDigitWheelIndex = -1;
let isTouchDevice = 'ontouchstart' in window;
let isTouchDragging = false;
let touchStartY = 0;
let touchCurrentY = 0;
let touchOffsetY = 0;

// 数字轮盘类
class DigitWheel {
    constructor(config, container, index) {
        this.config = config;
        this.container = container;
        this.index = index;
        this.currentIndex = config.defaultValue;
        this.items = [];
        this.selectedItem = null;
        this.lastTouchY = 0;
        this.lastTouchTime = 0;
        this.velocity = 0;
        this.inertiaInterval = null;
        this.init();
    }

    init() {
        const column = document.createElement('div');
        column.className = 'digit-wheel-column';
        column.dataset.wheelIndex = this.index;

        const label = document.createElement('div');
        label.className = 'digit-wheel-label';
        label.textContent = this.config.label;
        column.appendChild(label);

        const wheelContainer = document.createElement('div');
        wheelContainer.className = 'digit-wheel';
        wheelContainer.id = `digit-wheel-${this.config.id}`;
        wheelContainer.tabIndex = 0;

        const centerLine = document.createElement('div');
        centerLine.className = 'digit-wheel-center-line';
        wheelContainer.appendChild(centerLine);

        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'digit-wheel-items';
        this.itemsContainer = itemsContainer;
        wheelContainer.appendChild(itemsContainer);

        column.appendChild(wheelContainer);

        const valueDisplay = document.createElement('div');
        valueDisplay.className = 'digit-wheel-value';
        valueDisplay.id = `digit-wheel-value-${this.config.id}`;
        this.valueDisplay = valueDisplay;
        column.appendChild(valueDisplay);

        this.container.appendChild(column);
        this.wheelContainer = wheelContainer;

        this.populateItems();
        this.updatePosition();
        this.addEventListeners();
    }

    populateItems() {
        this.itemsContainer.innerHTML = '';
        this.items = [];

        for (let i = 0; i <= 99; i++) {
            const item = document.createElement('div');
            item.className = 'digit-wheel-item';
            item.textContent = i.toString().padStart(2, '0');
            item.dataset.value = i;

            if (i === this.currentIndex) {
                item.classList.add('selected');
                this.selectedItem = item;
            }

            this.itemsContainer.appendChild(item);
            this.items.push(item);
        }

        this.updateValueDisplay();
    }

    updatePosition(animate = true) {
        if (this.items.length === 0) return;

        const itemHeight = this.items[0].offsetHeight || 60;
        const centerOffset = -(this.currentIndex * itemHeight) + (itemHeight * 1.5);

        if (animate) {
            this.itemsContainer.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        } else {
            this.itemsContainer.style.transition = 'none';
        }

        this.itemsContainer.style.transform = `translateY(${centerOffset}px)`;

        if (animate) {
            setTimeout(() => {
                this.itemsContainer.style.transition = '';
            }, 300);
        }
    }

    updateValueDisplay() {
        this.valueDisplay.textContent = `${this.currentIndex.toString().padStart(2, '0')} ${this.config.label}`;

        this.items.forEach(item => {
            item.classList.remove('selected');
        });

        if (this.items[this.currentIndex]) {
            this.items[this.currentIndex].classList.add('selected');
            this.selectedItem = this.items[this.currentIndex];
        }
    }

    scrollToIndex(index) {
        index = Math.max(0, Math.min(99, index));
        this.currentIndex = index;
        this.updatePosition();
        this.updateValueDisplay();
    }

    scrollBy(delta) {
        const newIndex = this.currentIndex + delta;
        this.scrollToIndex(newIndex);
    }

    activate() {
        digitWheels.forEach(wheel => {
            wheel.deactivate();
        });

        this.wheelContainer.style.boxShadow = 'inset 0 1px 3px rgba(255, 255, 255, 0.5), inset 0 -1px 3px rgba(0, 0, 0, 0.3), 0 0 20px rgba(100, 100, 100, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3)';
        this.wheelContainer.style.borderColor = '#808080';
        this.wheelContainer.style.transform = 'scale(1.02)';
        this.wheelContainer.style.transition = 'all 0.2s ease';
        activeDigitWheelIndex = this.index;
    }

    deactivate() {
        this.wheelContainer.style.boxShadow = 'inset 0 1px 3px rgba(255, 255, 255, 0.5), inset 0 -1px 3px rgba(0, 0, 0, 0.3), 0 2px 5px rgba(0, 0, 0, 0.2)';
        this.wheelContainer.style.borderColor = '#b0b0b0';
        this.wheelContainer.style.transform = 'scale(1)';
        this.wheelContainer.style.transition = 'all 0.2s ease';
    }

    getValue() {
        return this.currentIndex;
    }

    setValue(value) {
        const intValue = parseInt(value) || 0;
        this.scrollToIndex(intValue);
    }

    handleTouchStart(e) {
        e.preventDefault();
        isTouchDragging = true;
        touchStartY = e.touches[0].clientY;
        touchCurrentY = e.touches[0].clientY;
        touchOffsetY = 0;
        this.activate();
    }

    handleTouchMove(e) {
        if (!isTouchDragging) return;

        e.preventDefault();
        const currentY = e.touches[0].clientY;
        const currentTime = Date.now();

        if (this.lastTouchY !== 0 && this.lastTouchTime !== 0) {
            const deltaY = currentY - this.lastTouchY;
            const deltaTime = currentTime - this.lastTouchTime;
            this.velocity = deltaY / deltaTime;
        }

        this.lastTouchY = currentY;
        this.lastTouchTime = currentTime;

        touchCurrentY = currentY;
        touchOffsetY = touchCurrentY - touchStartY;

        const itemHeight = this.items[0].offsetHeight || 60;
        const delta = Math.round(-touchOffsetY / (itemHeight / 2));

        if (delta !== 0) {
            this.scrollBy(delta);
            touchStartY = touchCurrentY;
            touchOffsetY = 0;
        }
    }

    handleTouchEnd() {
        if (!isTouchDragging) return;

        isTouchDragging = false;
        this.applyInertia();
        this.lastTouchY = 0;
        this.lastTouchTime = 0;
        this.velocity = 0;
    }

    handleMouseDown(e) {
        e.preventDefault();
        isTouchDragging = true;
        touchStartY = e.clientY;
        touchCurrentY = e.clientY;
        touchOffsetY = 0;
        this.activate();

        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }

    handleMouseMove(e) {
        if (!isTouchDragging) return;

        e.preventDefault();
        const currentY = e.clientY;
        const currentTime = Date.now();

        if (this.lastTouchY !== 0 && this.lastTouchTime !== 0) {
            const deltaY = currentY - this.lastTouchY;
            const deltaTime = currentTime - this.lastTouchTime;
            this.velocity = deltaY / deltaTime;
        }

        this.lastTouchY = currentY;
        this.lastTouchTime = currentTime;

        touchCurrentY = currentY;
        touchOffsetY = touchCurrentY - touchStartY;

        const itemHeight = this.items[0].offsetHeight || 60;
        const delta = Math.round(-touchOffsetY / (itemHeight / 2));

        if (delta !== 0) {
            this.scrollBy(delta);
            touchStartY = touchCurrentY;
            touchOffsetY = 0;
        }
    }

    handleMouseUp() {
        if (!isTouchDragging) return;

        isTouchDragging = false;
        document.removeEventListener('mousemove', this.handleMouseMove.bind(this));
        document.removeEventListener('mouseup', this.handleMouseUp.bind(this));
        this.applyInertia();
        this.lastTouchY = 0;
        this.lastTouchTime = 0;
        this.velocity = 0;
    }

    applyInertia() {
        if (this.inertiaInterval) {
            clearInterval(this.inertiaInterval);
            this.inertiaInterval = null;
        }

        if (Math.abs(this.velocity) > 1) {
            let currentVelocity = this.velocity;
            const itemHeight = this.items[0].offsetHeight || 60;

            this.inertiaInterval = setInterval(() => {
                const delta = Math.round(-currentVelocity * 2 / (itemHeight / 2));

                if (delta !== 0) {
                    this.scrollBy(delta);
                }

                currentVelocity *= 0.8;

                if (Math.abs(currentVelocity) < 0.5) {
                    clearInterval(this.inertiaInterval);
                    this.inertiaInterval = null;
                    this.updatePosition();
                }
            }, 50);
        } else {
            this.updatePosition();
        }
    }

    addEventListeners() {
        if (isTouchDevice) {
            this.wheelContainer.addEventListener('touchstart', this.handleTouchStart.bind(this));
            this.wheelContainer.addEventListener('touchmove', this.handleTouchMove.bind(this));
            this.wheelContainer.addEventListener('touchend', this.handleTouchEnd.bind(this));
            this.wheelContainer.addEventListener('touchcancel', this.handleTouchEnd.bind(this));
        }

        this.wheelContainer.addEventListener('mousedown', this.handleMouseDown.bind(this));

        this.wheelContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            this.activate();
        });

        this.wheelContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('digit-wheel-item')) {
                const value = parseInt(e.target.dataset.value);
                this.scrollToIndex(value);
            }
        });

        this.wheelContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 1 : -1;
            this.scrollBy(delta);
        });
    }
}

// 初始化数字轮盘
function initDigitWheels() {
    digitWheelsContainer.innerHTML = '';
    digitWheels = [];

    digitWheelConfigs.forEach((config, index) => {
        const wheel = new DigitWheel(config, digitWheelsContainer, index);
        digitWheels.push(wheel);
    });
}

// 计时器功能函数
function formatTimeWithMilliseconds(ms) {
    const totalSeconds = ms / 1000;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
}

function formatDateTime(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const weekday = getChineseWeekday(date);
    return `${year}年${month}月${day}日 ${weekday} ${hours}:${minutes}:${seconds}`;
}

function formatTimerDisplay(ms, mode) {
    const totalSeconds = Math.floor(ms / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = Math.floor(totalDays / 30.4375);
    const totalYears = Math.floor(totalDays / 365.25);

    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    let displayText = "";

    try {
        switch (mode) {
            case 0:
                displayText = `${days}天 ${hours}时 ${minutes}分 ${seconds}秒`;
                break;
            case 1:
                displayText = `${totalYears}年 ${totalMonths % 12}月 ${days % 30}天`;
                break;
            case 2:
                displayText = `${totalHours}时 ${minutes}分 ${seconds}秒`;
                break;
            case 3:
                displayText = `${totalWeeks}周 ${days % 7}天`;
                break;
            case 4:
                displayText = `${totalSeconds}秒`;
                break;
            case 5:
                displayText = `${totalMinutes}分钟`;
                break;
            case 6:
                displayText = `${totalHours}小时`;
                break;
            case 7:
                displayText = `${totalDays}天`;
                break;
            default:
                displayText = formatTimeWithMilliseconds(ms);
        }
    } catch (error) {
        displayText = formatTimeWithMilliseconds(ms);
    }

    return displayText;
}

function calculateAndDisplayTargetTime() {
    if (timerTargetTime <= 0) {
        targetTimeDisplay.classList.remove('show');
        targetTimeValue.textContent = "尚未设置";
        return;
    }

    const now = new Date();
    let targetDate;

    if (timerRunning) {
        const endTime = timerStartTime + timerTargetTime;
        targetDate = new Date(endTime);
    } else {
        targetDate = new Date(now.getTime() + timerTargetTime);
    }

    targetTimeValue.textContent = formatDateTime(targetDate);
    targetTimeDisplay.classList.add('show');
}

function updateTimerDisplay() {
    if (timerRunning) {
        const currentTime = Date.now();
        timerElapsedTime = timerStartTime ? currentTime - timerStartTime : 0;
    }

    const remainingTime = Math.max(0, timerTargetTime - timerElapsedTime);
    timerDisplay.textContent = formatTimerDisplay(remainingTime, timerMode);
    calculateAndDisplayTargetTime();

    if (timerRunning && timerElapsedTime >= timerTargetTime) {
        timerFinished();
    }
}

function timerFinished() {
    clearInterval(timerInterval);
    timerRunning = false;

    try {
        const audioContext = new(window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1);
    } catch (e) {
        console.log('音频上下文不支持');
    }

    timerStartBtn.disabled = false;
    timerPauseBtn.disabled = true;
    timerResetBtn.disabled = false;
    timerModeBtn.disabled = false;
    timerDisplay.textContent = formatTimerDisplay(0, timerMode);
    targetTimeValue.textContent = "计时器已完成";
}

function switchTimerMode() {
    timerMode = (timerMode + 1) % 8;
    timerModeBtn.innerHTML = `<span class="btn-icon">🔄</span><span class="btn-text">切换模式(${timerMode})</span>`;
    updateTimerDisplay();
}

function startTimer() {
    if (!timerRunning) {
        timerRunning = true;
        timerStartTime = Date.now() - timerElapsedTime;
        timerInterval = setInterval(updateTimerDisplay, 10);

        timerStartBtn.disabled = true;
        timerPauseBtn.disabled = false;
        timerResetBtn.disabled = false;
        timerModeBtn.disabled = true;

        calculateAndDisplayTargetTime();
        showToast('计时器开始');
    }
}

function pauseTimer() {
    if (timerRunning) {
        timerRunning = false;
        clearInterval(timerInterval);
        timerStartBtn.disabled = false;
        timerPauseBtn.disabled = true;
        timerModeBtn.disabled = false;
        showToast('计时器暂停');
    }
}

function resetTimer() {
    timerRunning = false;
    clearInterval(timerInterval);
    timerElapsedTime = 0;
    timerStartTime = 0;
    updateTimerDisplay();

    timerStartBtn.disabled = false;
    timerPauseBtn.disabled = true;
    timerResetBtn.disabled = true;
    timerModeBtn.disabled = false;

    calculateAndDisplayTargetTime();
    showToast('计时器重置');
}

function openTimerSetup() {
    timerSetup.classList.add('open');

    if (digitWheels.length === 0) {
        initDigitWheels();
    }

    const totalSeconds = Math.floor(timerTargetTime / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (digitWheels[0]) digitWheels[0].setValue(0);
    if (digitWheels[1]) digitWheels[1].setValue(0);
    if (digitWheels[2]) digitWheels[2].setValue(0);
    if (digitWheels[3]) digitWheels[3].setValue(hours);
    if (digitWheels[4]) digitWheels[4].setValue(minutes);
    if (digitWheels[5]) digitWheels[5].setValue(seconds);

    activeDigitWheelIndex = -1;
}

function closeTimerSetup() {
    timerSetup.classList.remove('open');

    if (activeDigitWheelIndex !== -1) {
        digitWheels[activeDigitWheelIndex].deactivate();
        activeDigitWheelIndex = -1;
    }
}

function applyTimerSetup() {
    const years = digitWheels[0] ? digitWheels[0].getValue() : 0;
    const months = digitWheels[1] ? digitWheels[1].getValue() : 0;
    const days = digitWheels[2] ? digitWheels[2].getValue() : 0;
    const hours = digitWheels[3] ? digitWheels[3].getValue() : 0;
    const minutes = digitWheels[4] ? digitWheels[4].getValue() : 0;
    const seconds = digitWheels[5] ? digitWheels[5].getValue() : 0;

    const totalDays = (years * 365) + (months * 30) + days;
    const totalHours = (totalDays * 24) + hours;
    const totalMinutes = (totalHours * 60) + minutes;
    const totalSeconds = (totalMinutes * 60) + seconds;

    timerTargetTime = totalSeconds * 1000;
    timerElapsedTime = 0;

    if (timerTargetTime === 0) {
        showToast('计时器时间不能为0！');
        return;
    }

    updateTimerDisplay();
    calculateAndDisplayTargetTime();

    if (timerRunning) {
        resetTimer();
        startTimer();
    }

    closeTimerSetup();
    showToast(`计时器已设置为 ${years}年 ${months}月 ${days}天 ${hours}小时 ${minutes}分钟 ${seconds}秒`);
}

// 初始化计时器事件
function initTimer() {
    timerSetupBtn.addEventListener('click', openTimerSetup);
    applyTimerBtn.addEventListener('click', applyTimerSetup);
    cancelTimerBtn.addEventListener('click', closeTimerSetup);
    timerStartBtn.addEventListener('click', startTimer);
    timerPauseBtn.addEventListener('click', pauseTimer);
    timerResetBtn.addEventListener('click', resetTimer);
    timerModeBtn.addEventListener('click', switchTimerMode);
    timerDisplay.addEventListener('click', switchTimerMode);

    updateTimerDisplay();
    calculateAndDisplayTargetTime();

    // 点击其他地方取消激活
    document.addEventListener('click', (e) => {
        if (activeDigitWheelIndex !== -1) {
            const clickedWheel = e.target.closest('.digit-wheel');
            if (!clickedWheel) {
                digitWheels[activeDigitWheelIndex].deactivate();
                activeDigitWheelIndex = -1;
            }
        }
    });

    document.addEventListener('touchend', () => {
        isTouchDragging = false;
    });

    document.addEventListener('mouseup', () => {
        isTouchDragging = false;
    });
}

// ======================= 秒表功能 =======================

let stopwatchInterval = null;
let stopwatchStartTime = 0;
let stopwatchElapsedTime = 0;
let stopwatchRunning = false;
let laps = [];
let lapStartTime = 0;
let currentLapTime = 0;

const stopwatchStartBtn = document.getElementById('stopwatch-start-btn');
const stopwatchPauseBtn = document.getElementById('stopwatch-pause-btn');
const stopwatchResetBtn = document.getElementById('stopwatch-reset-btn');
const lapBtn = document.getElementById('lap-btn');
const stopwatchTotalTime = document.getElementById('stopwatch-total-time');
const stopwatchLapTime = document.getElementById('stopwatch-lap-time');
const lapsContainer = document.getElementById('laps-container');
const lapsList = document.getElementById('laps-list');
const lapStats = document.getElementById('lap-stats');
const totalLapsEl = document.getElementById('total-laps');
const fastestLapEl = document.getElementById('fastest-lap');
const slowestLapEl = document.getElementById('slowest-lap');

function updateStopwatchDisplay() {
    if (stopwatchRunning) {
        const currentTime = Date.now();
        stopwatchElapsedTime = stopwatchStartTime ? currentTime - stopwatchStartTime : 0;
        currentLapTime = lapStartTime ? currentTime - lapStartTime : stopwatchElapsedTime;
    }

    stopwatchTotalTime.textContent = formatTimeWithMilliseconds(stopwatchElapsedTime);

    if (stopwatchRunning && laps.length > 0) {
        stopwatchLapTime.textContent = `当前圈: ${formatTimeWithMilliseconds(currentLapTime)}`;
        stopwatchLapTime.classList.remove('hidden');
    } else {
        stopwatchLapTime.classList.add('hidden');
    }
}

function startStopwatch() {
    if (!stopwatchRunning) {
        stopwatchRunning = true;
        stopwatchStartTime = Date.now() - stopwatchElapsedTime;
        lapStartTime = Date.now() - (laps.length > 0 ? currentLapTime : 0);

        stopwatchInterval = setInterval(updateStopwatchDisplay, 10);

        stopwatchStartBtn.disabled = true;
        stopwatchPauseBtn.disabled = false;
        stopwatchResetBtn.disabled = false;
        lapBtn.disabled = false;
    }
}

function pauseStopwatch() {
    if (stopwatchRunning) {
        stopwatchRunning = false;
        clearInterval(stopwatchInterval);
        stopwatchStartBtn.disabled = false;
        stopwatchPauseBtn.disabled = true;
        lapBtn.disabled = true;
    }
}

function stopwatchReset() {
    stopwatchRunning = false;
    clearInterval(stopwatchInterval);
    stopwatchElapsedTime = 0;
    stopwatchStartTime = 0;
    lapStartTime = 0;
    currentLapTime = 0;

    updateStopwatchDisplay();

    stopwatchStartBtn.disabled = false;
    stopwatchPauseBtn.disabled = true;
    stopwatchResetBtn.disabled = true;
    lapBtn.disabled = true;

    clearLaps();
}

function recordLap() {
    if (stopwatchRunning) {
        const currentTime = Date.now();
        const lapTime = currentTime - lapStartTime;
        lapStartTime = currentTime;
        currentLapTime = 0;

        laps.push({
            number: laps.length + 1,
            time: stopwatchElapsedTime,
            lapDuration: lapTime
        });

        if (laps.length === 1) {
            lapsContainer.style.display = 'block';
        }

        updateLapsDisplay();

        stopwatchLapTime.textContent = `当前圈: ${formatTimeWithMilliseconds(0)}`;
        stopwatchLapTime.classList.remove('hidden');
    }
}

function clearLaps() {
    laps = [];
    lapsList.innerHTML = '';
    lapsContainer.style.display = 'none';
    lapStats.style.display = 'none';
    totalLapsEl.textContent = '0';
    fastestLapEl.textContent = '00:00:00.00';
    slowestLapEl.textContent = '00:00:00.00';
    stopwatchLapTime.classList.add('hidden');
}

function updateLapsDisplay() {
    lapsList.innerHTML = '';

    if (laps.length === 0) {
        lapsContainer.style.display = 'none';
        lapStats.style.display = 'none';
        return;
    }

    let fastestLap = Infinity;
    let slowestLap = 0;
    let fastestLapIndex = -1;
    let slowestLapIndex = -1;

    laps.forEach((lap, index) => {
        if (lap.lapDuration < fastestLap) {
            fastestLap = lap.lapDuration;
            fastestLapIndex = index;
        }
        if (lap.lapDuration > slowestLap) {
            slowestLap = lap.lapDuration;
            slowestLapIndex = index;
        }
    });

    laps.forEach((lap, index) => {
        const lapItem = document.createElement('li');
        lapItem.className = 'lap-item';

        if (index === fastestLapIndex) {
            lapItem.classList.add('fastest-lap');
        } else if (index === slowestLapIndex) {
            lapItem.classList.add('slowest-lap');
        }

        lapItem.innerHTML = `
            <div class="lap-number">第 ${lap.number} 圈</div>
            <div class="lap-time">${formatTimeWithMilliseconds(lap.time)}</div>
            <div class="lap-duration">圈时: ${formatTimeWithMilliseconds(lap.lapDuration)}</div>
        `;

        lapsList.appendChild(lapItem);
    });

    totalLapsEl.textContent = laps.length;
    if (fastestLap < Infinity) {
        fastestLapEl.textContent = formatTimeWithMilliseconds(fastestLap);
    }
    if (slowestLap > 0) {
        slowestLapEl.textContent = formatTimeWithMilliseconds(slowestLap);
    }

    if (laps.length >= 2) {
        lapStats.style.display = 'flex';
    } else {
        lapStats.style.display = 'none';
    }
}

function initStopwatch() {
    stopwatchStartBtn.addEventListener('click', startStopwatch);
    stopwatchPauseBtn.addEventListener('click', pauseStopwatch);
    stopwatchResetBtn.addEventListener('click', stopwatchReset);
    lapBtn.addEventListener('click', recordLap);
    updateStopwatchDisplay();
}

// ======================= 倒计时功能 =======================

const pageLoadTime = new Date();
const countdownTarget = new Date(2026, 9, 31, 0, 0, 0);
const gta6CountdownTarget = new Date(2026, 10, 19, 0, 0, 0);

let countdownMode = 1;
let fixedCountdownMode = 1;
let gta6CountdownMode = 1;
let fixedGta6CountdownMode = 1;

function calcCalendarYMD(fromDate, toDate) {
    let y = toDate.getFullYear() - fromDate.getFullYear();
    let m = toDate.getMonth() - fromDate.getMonth();
    let d = toDate.getDate() - fromDate.getDate();
    if (d < 0) {
        m--;
        const prevMonth = new Date(toDate.getFullYear(), toDate.getMonth(), 0);
        d += prevMonth.getDate();
    }
    if (m < 0) {
        y--;
        m += 12;
    }
    return { years: y, months: m, days: d };
}

function formatFixedCountdown(diff, mode, pastText, targetDate, startDate) {
    if (diff === 0) return "目标时间已到！";

    const isPast = diff < 0;
    const absDiff = Math.abs(diff);

    const totalSeconds = Math.floor(absDiff / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    const totalWeeks = Math.floor(totalDays / 7);

    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);

    const ymd = isPast ? calcCalendarYMD(targetDate, startDate) : calcCalendarYMD(startDate, targetDate);

    let displayText = "";

    try {
        switch (mode) {
            case 0:
                displayText = !isPast ? `${days}天 ${hours}时 ${minutes}分 ${seconds}秒` : `${pastText} ${days}天 ${hours}时 ${minutes}分 ${seconds}秒`;
                break;
            case 1:
                displayText = !isPast ? `${ymd.years}年 ${ymd.months}月 ${ymd.days}天` : `${pastText} ${ymd.years}年 ${ymd.months}月 ${ymd.days}天`;
                break;
            case 2:
                displayText = !isPast ? `${totalHours}时 ${minutes}分 ${seconds}秒` : `${pastText} ${totalHours}时 ${minutes}分 ${seconds}秒`;
                break;
            case 3:
                displayText = !isPast ? `${totalWeeks}周 ${days % 7}天` : `${pastText} ${totalWeeks}周 ${days % 7}天`;
                break;
            case 4:
                displayText = !isPast ? `${totalSeconds}秒` : `${pastText} ${totalSeconds}秒`;
                break;
            case 5:
                displayText = !isPast ? `${totalMinutes}分钟` : `${pastText} ${totalMinutes}分钟`;
                break;
            case 6:
                displayText = !isPast ? `${totalHours}小时` : `${pastText} ${totalHours}小时`;
                break;
            case 7:
                displayText = !isPast ? `${totalDays}天` : `${pastText} ${totalDays}天`;
                break;
            default:
                displayText = "计算错误";
        }
    } catch (error) {
        displayText = "计算错误";
    }

    return displayText;
}

function formatRealTimeCountdown(diff, mode, pastText, targetDate, fromDate) {
    try {
        const absDiff = Math.abs(diff);
        const totalSeconds = Math.floor(absDiff / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        const totalDays = Math.floor(totalHours / 24);
        const totalWeeks = Math.floor(totalDays / 7);

        const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);

        const ymd = diff >= 0 ? calcCalendarYMD(fromDate, targetDate) : calcCalendarYMD(targetDate, fromDate);

        let displayText = "";

        switch (mode) {
            case 0:
                displayText = diff >= 0 ? `${days}天 ${hours}时 ${minutes}分 ${seconds}秒` : `${pastText} ${days}天 ${hours}时 ${minutes}分 ${seconds}秒`;
                break;
            case 1:
                displayText = diff >= 0 ? `${ymd.years}年 ${ymd.months}月 ${ymd.days}天` : `${pastText} ${ymd.years}年 ${ymd.months}月 ${ymd.days}天`;
                break;
            case 2:
                displayText = diff >= 0 ? `${totalHours}时 ${minutes}分 ${seconds}秒` : `${pastText} ${Math.abs(totalHours)}时 ${minutes}分 ${seconds}秒`;
                break;
            case 3:
                displayText = diff >= 0 ? `${totalWeeks}周 ${days % 7}天` : `${pastText} ${Math.abs(totalWeeks)}周 ${days % 7}天`;
                break;
            case 4:
                displayText = diff >= 0 ? `${totalSeconds}秒` : `${pastText} ${Math.abs(totalSeconds)}秒`;
                break;
            case 5:
                displayText = diff >= 0 ? `${totalMinutes}分钟` : `${pastText} ${Math.abs(totalMinutes)}分钟`;
                break;
            case 6:
                displayText = diff >= 0 ? `${totalHours}小时` : `${pastText} ${Math.abs(totalHours)}小时`;
                break;
            case 7:
                displayText = diff >= 0 ? `${totalDays}天` : `${pastText} ${Math.abs(totalDays)}天`;
                break;
            default:
                displayText = "计算错误";
        }

        return displayText;
    } catch (error) {
        return "计算错误";
    }
}

function updateFixedCountdownDisplay(diff, timeElementId, noteElementId, mode, pastText, startTime, targetDate) {
    const timeElement = document.getElementById(timeElementId);
    const noteElement = document.getElementById(noteElementId);

    if (!timeElement || !noteElement) return;

    const formattedTime = formatFixedCountdown(diff, mode, pastText, targetDate, startTime);
    const formattedStartTime = formatDateTime(startTime);

    timeElement.textContent = formattedTime;
    noteElement.textContent = `从 ${formattedStartTime} 到目标时间的固定倒计时`;

    if (diff < 0) {
        timeElement.classList.add('expired');
    } else {
        timeElement.classList.remove('expired');
    }
}

function updateCountdown() {
    try {
        const now = new Date();
        const diff = countdownTarget.getTime() - now.getTime();
        const displayElement = document.getElementById('countdown-display');
        if (displayElement) {
            displayElement.textContent = formatRealTimeCountdown(diff, countdownMode, "已超时", countdownTarget, now);
        }
    } catch (error) {
        const displayElement = document.getElementById('countdown-display');
        if (displayElement) displayElement.textContent = "计算错误";
    }
}

function updateGta6Countdown() {
    try {
        const now = new Date();
        const diff = gta6CountdownTarget.getTime() - now.getTime();
        const displayElement = document.getElementById('gta6-countdown-display');
        if (displayElement) {
            displayElement.textContent = formatRealTimeCountdown(diff, gta6CountdownMode, "已发售", gta6CountdownTarget, now);
        }
    } catch (error) {
        const displayElement = document.getElementById('gta6-countdown-display');
        if (displayElement) displayElement.textContent = "计算错误";
    }
}

function calculateAndDisplayFixedCountdowns() {
    const countdownDiff = countdownTarget.getTime() - pageLoadTime.getTime();
    const gta6Diff = gta6CountdownTarget.getTime() - pageLoadTime.getTime();

    updateFixedCountdownDisplay(countdownDiff, 'fixed-countdown-time', 'fixed-countdown-note', fixedCountdownMode, "已拿房", pageLoadTime, countdownTarget);
    updateFixedCountdownDisplay(gta6Diff, 'gta6-fixed-countdown-time', 'gta6-fixed-countdown-note', fixedGta6CountdownMode, "GTA6 游戏已发售", pageLoadTime, gta6CountdownTarget);
}

function updateAllCountdowns() {
    updateCountdown();
    updateGta6Countdown();
}

function initCountdowns() {
    updateAllCountdowns();
    calculateAndDisplayFixedCountdowns();
    setInterval(updateAllCountdowns, 1000);

    // 华都云境悦府点击切换
    document.getElementById('countdown-container').addEventListener('click', function(e) {
        if (e.target.closest('.fixed-countdown')) return;
        countdownMode = (countdownMode + 1) % 8;
        fixedCountdownMode = countdownMode;
        updateCountdown();
        calculateAndDisplayFixedCountdowns();
    });

    document.getElementById('fixed-countdown').addEventListener('click', function() {
        fixedCountdownMode = (fixedCountdownMode + 1) % 8;
        countdownMode = fixedCountdownMode;
        calculateAndDisplayFixedCountdowns();
        updateCountdown();
    });

    // GTA6点击切换
    document.getElementById('gta6-countdown-container').addEventListener('click', function(e) {
        if (e.target.closest('.fixed-countdown')) return;
        gta6CountdownMode = (gta6CountdownMode + 1) % 8;
        fixedGta6CountdownMode = gta6CountdownMode;
        updateGta6Countdown();
        calculateAndDisplayFixedCountdowns();
    });

    document.getElementById('gta6-fixed-countdown').addEventListener('click', function() {
        fixedGta6CountdownMode = (fixedGta6CountdownMode + 1) % 8;
        gta6CountdownMode = fixedGta6CountdownMode;
        calculateAndDisplayFixedCountdowns();
        updateGta6Countdown();
    });
}

// ======================= 自定义倒计时功能 =======================

let customCountdowns = [];
let customCountdownUpdateList = [];

const customCountdownBtn = document.getElementById('custom-countdown-btn');
const customCountdownGenerator = document.getElementById('custom-countdown-generator');
const countdownGeneratorForm = document.getElementById('countdown-generator-form');
const customCountdownTitleInput = document.getElementById('custom-countdown-title');
const customCountdownDateInput = document.getElementById('custom-countdown-date');
const customCountdownTimeInput = document.getElementById('custom-countdown-time');
const customCountdownPastTextInput = document.getElementById('custom-countdown-past-text');
const cancelGeneratorBtn = document.getElementById('cancel-generator-btn');

const manageCustomCountdownsBtn = document.getElementById('manage-custom-countdowns-btn');
const manageCustomCountdownsPanel = document.getElementById('manage-custom-countdowns-panel');
const customCountdownsList = document.getElementById('custom-countdowns-list');
const noCustomCountdowns = document.getElementById('no-custom-countdowns');
const closeManagePanelBtn = document.getElementById('close-manage-panel-btn');
const deleteAllCustomCountdownsBtn = document.getElementById('delete-all-custom-countdowns-btn');
const customCountdownsContainer = document.getElementById('custom-countdowns-container');

function openCustomCountdownGenerator() {
    customCountdownGenerator.classList.add('open');
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    customCountdownDateInput.value = `${year}-${month}-${day}`;
    customCountdownTimeInput.value = '12:00';
    customCountdownPastTextInput.value = '已过期';
}

function closeCustomCountdownGenerator() {
    customCountdownGenerator.classList.remove('open');
}

function openManageCustomCountdownsPanel() {
    manageCustomCountdownsPanel.classList.add('open');
    updateCustomCountdownsList();
    setTimeout(() => {
        manageCustomCountdownsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

function closeManageCustomCountdownsPanel() {
    manageCustomCountdownsPanel.classList.remove('open');
}

function updateCustomCountdownsList() {
    customCountdownsList.innerHTML = '';

    if (customCountdowns.length === 0) {
        noCustomCountdowns.style.display = 'block';
        return;
    }

    noCustomCountdowns.style.display = 'none';

    customCountdowns.forEach((countdown, index) => {
        const item = document.createElement('div');
        item.className = 'custom-countdown-item';
        item.dataset.countdownId = countdown.id;

        const targetDate = new Date(countdown.targetDate);
        const targetDateStr = formatDateTime(targetDate);

        item.innerHTML = `
            <div class="custom-countdown-info">
                <div class="custom-countdown-name">${countdown.title}</div>
                <div class="custom-countdown-target">目标时间: ${targetDateStr}</div>
            </div>
            <div class="custom-countdown-actions">
                <button class="action-btn jump" data-countdown-id="${countdown.id}">跳转查看</button>
                <button class="action-btn delete" data-countdown-id="${countdown.id}">删除</button>
            </div>
        `;

        customCountdownsList.appendChild(item);
    });

    document.querySelectorAll('.custom-countdown-actions .jump').forEach(btn => {
        btn.addEventListener('click', function() {
            jumpToCountdown(this.dataset.countdownId);
        });
    });

    document.querySelectorAll('.custom-countdown-actions .delete').forEach(btn => {
        btn.addEventListener('click', function() {
            deleteCustomCountdown(this.dataset.countdownId);
        });
    });
}

function jumpToCountdown(countdownId) {
    const countdownElement = document.getElementById(countdownId);
    if (countdownElement) {
        countdownElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        countdownElement.style.animation = 'pulse 1s ease';
        setTimeout(() => {
            countdownElement.style.animation = '';
        }, 1000);
        closeManageCustomCountdownsPanel();
        showToast('已跳转到指定倒计时');
    } else {
        showToast('未找到指定的倒计时');
    }
}

function deleteCustomCountdown(countdownId) {
    const countdown = customCountdowns.find(c => c.id === countdownId);
    if (!countdown) return;

    const confirmDelete = confirm(`确定要删除倒计时 "${countdown.title}" 吗？`);
    if (!confirmDelete) return;

    customCountdowns = customCountdowns.filter(c => c.id !== countdownId);

    const countdownElement = document.getElementById(countdownId);
    if (countdownElement) countdownElement.remove();

    customCountdownUpdateList = customCountdownUpdateList.filter(item => item.countdownId !== countdownId);

    saveCustomCountdowns();
    updateCustomCountdownsList();
    showToast(`已删除倒计时: ${countdown.title}`);
}

function deleteAllCustomCountdowns() {
    if (customCountdowns.length === 0) {
        showToast('没有可删除的自定义倒计时');
        return;
    }

    const confirmDeleteAll = confirm(`确定要删除所有 ${customCountdowns.length} 个自定义倒计时吗？此操作不可撤销！`);
    if (!confirmDeleteAll) return;

    customCountdowns.forEach(countdown => {
        const element = document.getElementById(countdown.id);
        if (element) element.remove();
    });

    customCountdowns = [];
    customCountdownUpdateList = [];

    saveCustomCountdowns();
    updateCustomCountdownsList();
    showToast(`已删除所有自定义倒计时`);
}

function generateCustomCountdown(event) {
    event.preventDefault();

    const title = customCountdownTitleInput.value.trim();
    const date = customCountdownDateInput.value;
    const time = customCountdownTimeInput.value;
    const pastText = customCountdownPastTextInput.value.trim();

    if (!title) {
        showToast('请输入倒计时标题');
        return;
    }

    if (!date) {
        showToast('请选择目标日期');
        return;
    }

    const targetDateTime = new Date(`${date}T${time}`);
    if (isNaN(targetDateTime.getTime())) {
        showToast('日期时间格式错误');
        return;
    }

    createCustomCountdownGroup(title, targetDateTime, pastText);
    closeCustomCountdownGenerator();
    showToast(`已创建倒计时: ${title}`);
    saveCustomCountdowns();
}

function createCustomCountdownGroup(title, targetDate, pastText) {
    const countdownId = `custom-countdown-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fixedCountdownId = `custom-fixed-countdown-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const countdownContainer = document.createElement('div');
    countdownContainer.className = 'countdown-container tool-container';
    countdownContainer.id = countdownId;

    const fixedCountdown = document.createElement('div');
    fixedCountdown.className = 'fixed-countdown';
    fixedCountdown.id = fixedCountdownId;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-countdown-btn';
    deleteButton.innerHTML = '×';
    deleteButton.title = '删除此倒计时';
    deleteButton.dataset.countdownId = countdownId;
    fixedCountdown.appendChild(deleteButton);

    fixedCountdown.innerHTML += `
        <div class="fixed-countdown-time" id="${fixedCountdownId}-time">正在计算...</div>
        <div class="fixed-countdown-note" id="${fixedCountdownId}-note">从页面加载时到目标时间的固定倒计时</div>
    `;

    fixedCountdown.appendChild(deleteButton);

    countdownContainer.innerHTML = `
        <div class="countdown-title">${title}实时倒计时</div>
        <div class="countdown-display" id="${countdownId}-display">正在计算...</div>
    `;

    countdownContainer.insertBefore(fixedCountdown, countdownContainer.firstChild);
    customCountdownsContainer.appendChild(countdownContainer);

    customCountdowns.push({
        id: countdownId,
        fixedId: fixedCountdownId,
        title: title,
        targetDate: targetDate.getTime(),
        pastText: pastText,
        mode: 0,
        fixedMode: 0
    });

    addCountdownEventListeners(countdownContainer, fixedCountdown, countdownId, fixedCountdownId);
    updateCustomCountdown(countdownContainer, fixedCountdown, countdownId, fixedCountdownId);
    addToFixedCountdownUpdateList(countdownContainer, fixedCountdown, countdownId, fixedCountdownId);

    deleteButton.addEventListener('click', function(e) {
        e.stopPropagation();
        deleteCustomCountdown(countdownId);
    });
}

function addCountdownEventListeners(countdownContainer, fixedCountdown, countdownId, fixedCountdownId) {
    countdownContainer.addEventListener('click', function(e) {
        if (e.target.closest('.fixed-countdown') || e.target.closest('.delete-countdown-btn')) return;

        const countdown = customCountdowns.find(c => c.id === countdownId);
        if (countdown) {
            countdown.mode = (countdown.mode + 1) % 8;
            countdown.fixedMode = countdown.mode;
            updateCustomCountdown(countdownContainer, fixedCountdown, countdownId, fixedCountdownId);
            saveCustomCountdowns();
        }
    });

    fixedCountdown.addEventListener('click', function(e) {
        if (e.target.closest('.delete-countdown-btn')) return;

        const countdown = customCountdowns.find(c => c.id === countdownId);
        if (countdown) {
            countdown.fixedMode = (countdown.fixedMode + 1) % 8;
            countdown.mode = countdown.fixedMode;
            updateCustomCountdown(countdownContainer, fixedCountdown, countdownId, fixedCountdownId);
            saveCustomCountdowns();
        }
    });
}

function updateCustomCountdown(countdownContainer, fixedCountdown, countdownId, fixedCountdownId) {
    const countdown = customCountdowns.find(c => c.id === countdownId);
    if (!countdown) return;

    const now = new Date();
    const targetTime = countdown.targetDate;
    const diff = targetTime - now.getTime();
    const pastText = countdown.pastText;

    const displayElement = document.getElementById(`${countdownId}-display`);
    if (displayElement) {
        displayElement.textContent = formatRealTimeCountdown(diff, countdown.mode, pastText, new Date(targetTime), now);
    }

    const fixedTimeElement = document.getElementById(`${fixedCountdownId}-time`);
    const fixedNoteElement = document.getElementById(`${fixedCountdownId}-note`);

    if (fixedTimeElement && fixedNoteElement) {
        const fixedDiff = targetTime - pageLoadTime.getTime();
        const formattedTime = formatFixedCountdown(fixedDiff, countdown.fixedMode, pastText, new Date(targetTime), pageLoadTime);
        const formattedStartTime = formatDateTime(pageLoadTime);

        fixedTimeElement.textContent = formattedTime;
        fixedNoteElement.textContent = `从 ${formattedStartTime} 到目标时间的固定倒计时`;

        if (fixedDiff < 0) {
            fixedTimeElement.classList.add('expired');
        } else {
            fixedTimeElement.classList.remove('expired');
        }
    }
}

function addToFixedCountdownUpdateList(countdownContainer, fixedCountdown, countdownId, fixedCountdownId) {
    customCountdownUpdateList.push({
        countdownContainer: countdownContainer,
        fixedCountdown: fixedCountdown,
        countdownId: countdownId,
        fixedCountdownId: fixedCountdownId
    });
}

function updateAllCustomCountdowns() {
    customCountdownUpdateList.forEach(item => {
        updateCustomCountdown(
            item.countdownContainer,
            item.fixedCountdown,
            item.countdownId,
            item.fixedCountdownId
        );
    });
}

function saveCustomCountdowns() {
    try {
        const countdownsToSave = customCountdowns.map(c => ({
            id: c.id,
            fixedId: c.fixedId,
            title: c.title,
            targetDate: c.targetDate,
            pastText: c.pastText,
            mode: c.mode,
            fixedMode: c.fixedMode
        }));
        localStorage.setItem('customCountdowns', JSON.stringify(countdownsToSave));
    } catch (error) {
        console.error('保存自定义倒计时失败:', error);
    }
}

function loadCustomCountdowns() {
    try {
        const savedCountdowns = localStorage.getItem('customCountdowns');
        if (savedCountdowns) {
            const parsedCountdowns = JSON.parse(savedCountdowns);
            parsedCountdowns.forEach(saved => {
                const targetDate = new Date(saved.targetDate);
                createCustomCountdownGroup(saved.title, targetDate, saved.pastText);

                const countdown = customCountdowns.find(c => c.id === saved.id);
                if (countdown) {
                    countdown.mode = saved.mode || 1;
                    countdown.fixedMode = saved.fixedMode || 1;
                }
            });
        }
    } catch (error) {
        console.error('加载自定义倒计时失败:', error);
    }
}

function initCustomCountdowns() {
    customCountdownBtn.addEventListener('click', openCustomCountdownGenerator);
    countdownGeneratorForm.addEventListener('submit', generateCustomCountdown);
    cancelGeneratorBtn.addEventListener('click', closeCustomCountdownGenerator);

    manageCustomCountdownsBtn.addEventListener('click', openManageCustomCountdownsPanel);
    closeManagePanelBtn.addEventListener('click', closeManageCustomCountdownsPanel);
    deleteAllCustomCountdownsBtn.addEventListener('click', deleteAllCustomCountdowns);

    loadCustomCountdowns();
    setInterval(updateAllCustomCountdowns, 1000);
}

// ======================= Ping测试功能 =======================

const linkNameMap = {
    "https://g654321.com/": "18Game – 成人游戏合集大全",
    "https://opa.wjgelbub.com/": "MASOBU 麻涩部｜真人互動遊戲平台",
    "https://byrutgame.org/": "ByrutGame - PC游戏下载",
    "https://www.xyg688.com/": "小妖怪分享|兴趣使然的资源搬运Blog",
    "https://www.zzzzz688.com/": "游戏天堂-全球游戏下载基地",
    "https://lzlgo.com/": "梨子乐游戏",
    "https://www.vgter.net/": "上游世界 | SWITCH游戏下载 | PS4游戏下载",
    "http://flysheep.ysepan.com/": "flysheep资源避难所",
    "https://koyso.to/": "Koyso",
    "https://mod.3dmgame.com/ETS2": "3DM Mod站",
    "https://www.steambk.com/": "蒸汽游戏宝库",
    "https://www.microsoft.com/zh-cn/software-download": "微软官方下载",
    "https://msdn.itellyou.cn/": "MSDN, 我告诉你",
    "https://uupdump.net/": "UUP dump",
    "https://www.cmdpe.com/": "cmdpe网络版",
    "https://www.ventoy.net/cn/index.html": "Ventoy",
    "https://windngzs.mysxl.cn/": "Windows电脑工作室",
    "https://appy1bnmaqn7922.pc.xiaoe-tech.com/": "python在线学堂",
    "https://pythontutor.com/": "代码可视化网站",
    "https://www.rockstargames.com/zh/": "Rockstar Games",
    "https://panyq.com/": "盘友圈",
    "https://www.seedhub.cc/": "SeedHub",
    "https://timepulse.ravelloh.top/": "TimePulse倒计时",
    "https://transfer.52python.cn/": "文件传输服务",
    "https://kms.cx/": "KMS激活工具",
    "https://snapany.com/zh/": "视频图片解析下载",
    "https://www.catalog.update.microsoft.com/Home.aspx": "Microsoft Update Catalog",
    "https://www.mltzao.com/": "名龙堂造",
    "https://www.189.cn/": "中国电信网上营业厅",
    "https://blmp.cdzjryb.com/fplc_daas_portal/#/infoDetail?prevPageTitle=%E4%BD%8F%E5%BB%BA%E8%93%89e%E5%8A%9E&type=1&title=%E9%A2%84%2F%E7%8E%B0%E5%94%AE%E9%A1%B9%E7%9B%AE": "成都市建筑全生命周期管理平台",
    "https://vocalremover.org/zh": "分离人声 [AI] Vocal Remover",
    "https://html2web.com/": "HTML2WEB",
    "https://postome.com/": "PostoMe 时光邮局",
    "https://cd.ke.com/": "成都贝壳找房",
    "https://www.qiniu.com/": "七牛云",
    "https://bbs.potplayer.org/": "PotPlayer中文论坛",
    "https://live.jstv.com/": "江苏卫视在线直播",
    "https://live.douyin.com/654047241463": "李伯清直播间",
    "https://live.douyin.com/920378299357": "湖北发布的抖音直播间",
    "https://live.douyin.com/308244617136": "帮女郎在行动的抖音直播间",
    "https://live.douyin.com/867088577067": "红星新闻的抖音直播间",
    "https://live.douyin.com/282773369501": "央视新闻的抖音直播间",
    "https://live.douyin.com/470715389675": "Vista看天下的抖音直播间",
    "https://www.douyin.com/user/MS4wLjABAAAAUsD9x4kwhXyxXU6-ivZ2G8vchRMQZE0zwPL9Ha5jaRC-wHl7_BJ7AkxBWEnSWTyA?vid=7241412456315112715": "扫盲班主任的抖音",
    "https://www.douyin.com/user/MS4wLjABAAAAJ70_gbgcwaY2k-DBCEExdLYM8DzBtDD4isUxNXUKuNQ": "李伯清的抖音",
    "https://www.douyin.com/user/MS4wLjABAAAAQ1dFO9i4ulRYixl_ALyg1XFRoO_CpGDQR9LiacuDc_k": "在下莫老师的抖音",
    "https://ecnkklr3g1a7.feishu.cn/wiki/G4WOwPPWYigZc6k3zOIc5E9OnMb": "DJ老杨|黑K技工具箱 001"
};

function getLinkName(url) {
    const cleanUrl = url.replace(/\/$/, '');
    if (linkNameMap[cleanUrl]) return linkNameMap[cleanUrl];
    for (const [key, name] of Object.entries(linkNameMap)) {
        if (cleanUrl === key.replace(/\/$/, '')) return name;
    }
    for (const [key, name] of Object.entries(linkNameMap)) {
        if (url.includes(key.replace(/\/$/, '')) || key.replace(/\/$/, '').includes(url)) return name;
    }
    return url;
}

function pingUrl(url, timeout = 5000) {
    return new Promise((resolve) => {
        const startTime = Date.now();

        if (url.includes('.mp3') || url.includes('.wav') || url.includes('.ogg') || url.includes('.m4a') || url.includes('/live/')) {
            const audio = new Audio();
            let timer = setTimeout(() => {
                resolve({ success: false, time: timeout, error: '超时' });
                audio.src = '';
            }, timeout);

            audio.oncanplaythrough = () => {
                clearTimeout(timer);
                resolve({ success: true, time: Date.now() - startTime });
                audio.src = '';
            };

            audio.onerror = () => {
                clearTimeout(timer);
                resolve({ success: false, time: Date.now() - startTime, error: '连接失败' });
                audio.src = '';
            };

            audio.src = url + (url.indexOf('?') === -1 ? '?' : '&') + 't=' + Date.now();
            return;
        }

        if (url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png') || url.includes('.gif')) {
            const img = new Image();
            let timer = setTimeout(() => {
                resolve({ success: false, time: timeout, error: '超时' });
                img.onload = img.onerror = null;
            }, timeout);

            img.onload = () => {
                clearTimeout(timer);
                resolve({ success: true, time: Date.now() - startTime });
            };

            img.onerror = () => {
                clearTimeout(timer);
                resolve({ success: false, time: Date.now() - startTime, error: '无法加载' });
            };

            img.src = url + (url.indexOf('?') === -1 ? '?' : '&') + 't=' + Date.now();
            return;
        }

        testWithCORSProxy(url, startTime, timeout, resolve);
    });
}

function testWithCORSProxy(url, startTime, timeout, resolve, proxyIndex = 0) {
    const proxies = [
        `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
        `https://corsproxy.io/?url=${encodeURIComponent(url)}`
    ];

    if (proxyIndex >= proxies.length) {
        resolve({ success: false, time: Date.now() - startTime, error: '代理不可用' });
        return;
    }

    const controller = new AbortController();
    const signal = controller.signal;
    const proxyUrl = proxies[proxyIndex];

    let timer = setTimeout(() => {
        controller.abort();
        testWithCORSProxy(url, startTime, timeout, resolve, proxyIndex + 1);
    }, timeout);

    fetch(proxyUrl, { method: 'GET', signal })
        .then(response => {
            clearTimeout(timer);
            if (response.ok) {
                response.json()
                    .then(data => {
                        const statusCode = data.status?.http_code || response.status;
                        handleStatusCode(statusCode, Date.now() - startTime, resolve);
                    })
                    .catch(() => {
                        testWithCORSProxy(url, startTime, timeout, resolve, proxyIndex + 1);
                    });
            } else {
                testWithCORSProxy(url, startTime, timeout, resolve, proxyIndex + 1);
            }
        })
        .catch(() => {
            clearTimeout(timer);
            testWithCORSProxy(url, startTime, timeout, resolve, proxyIndex + 1);
        });
}

function handleStatusCode(statusCode, time, resolve) {
    if (statusCode >= 200 && statusCode < 400) {
        resolve({ success: true, time: time, status: statusCode });
    } else if (statusCode === 404 || statusCode === 410) {
        resolve({ success: false, time: time, error: `页面不存在(HTTP ${statusCode})` });
    } else if (statusCode >= 400 && statusCode < 500) {
        resolve({ success: false, time: time, error: `访问被拒绝(HTTP ${statusCode})` });
    } else if (statusCode >= 500) {
        resolve({ success: false, time: time, error: `服务器错误(HTTP ${statusCode})` });
    } else {
        resolve({ success: true, time: time, status: statusCode });
    }
}

async function testAllLinks() {
    const links = Array.from(document.querySelectorAll('a[href^="http"]'));
    const totalLinks = links.length;
    let testedLinks = 0;
    let successfulLinks = 0;
    let failedLinks = 0;

    const pingTestBtn = document.getElementById('ping-test-btn');
    const pingResults = document.getElementById('ping-results');
    const pingSummary = document.getElementById('ping-summary');
    const pingLinksList = document.getElementById('ping-links-list');

    pingTestBtn.disabled = true;
    pingTestBtn.textContent = '测试中...';

    pingResults.classList.add('show');
    pingSummary.textContent = `正在测试 ${totalLinks} 个链接...`;
    pingLinksList.innerHTML = '';

    for (const link of links) {
        const url = link.href;

        const listItem = document.createElement('div');
        listItem.className = 'ping-link-item';
        const linkName = getLinkName(url);
        listItem.innerHTML = `
            <div class="ping-link-url">
                <span class="link-name">${linkName}</span>
                ${url}
            </div>
            <div class="ping-link-status" style="color: #ff9966;">测试中...</div>
        `;
        pingLinksList.appendChild(listItem);

        try {
            const result = await pingUrl(url);
            testedLinks++;

            if (result.success) {
                successfulLinks++;
                const status = result.status ? ` (${result.status})` : '';
                listItem.querySelector('.ping-link-status').textContent = `✓ ${result.time}ms${status}`;
                listItem.querySelector('.ping-link-status').style.color = '#33cc99';
            } else {
                failedLinks++;
                const errorMsg = result.error || '不可达';
                listItem.querySelector('.ping-link-status').textContent = `✗ ${errorMsg}`;
                listItem.querySelector('.ping-link-status').style.color = '#ff5e62';
            }

            pingSummary.textContent = `已测试 ${testedLinks}/${totalLinks} 个链接，成功: ${successfulLinks}，失败: ${failedLinks}`;

        } catch (error) {
            testedLinks++;
            failedLinks++;
            listItem.querySelector('.ping-link-status').textContent = '✗ 测试出错';
            listItem.querySelector('.ping-link-status').style.color = '#ff5e62';
            pingSummary.textContent = `已测试 ${testedLinks}/${totalLinks} 个链接，成功: ${successfulLinks}，失败: ${failedLinks}`;
        }

        await new Promise(resolve => setTimeout(resolve, 100));
    }

    pingTestBtn.disabled = false;
    pingTestBtn.textContent = '重新测试所有链接';
    pingSummary.textContent = `测试完成！总共 ${totalLinks} 个链接，成功: ${successfulLinks}，失败: ${failedLinks}`;

    showToast(`链接测试完成：${successfulLinks}个成功，${failedLinks}个失败`);
}

function initPingTest() {
    document.getElementById('ping-test-btn').addEventListener('click', testAllLinks);
}

// ======================= 音乐播放器功能 =======================

const stations = [
    { url: "https://lhttp.qingting.fm/live/5022405/64k.mp3?app_id=web&type=", name: "AsiaFM 亚洲音乐台" },
    { url: "https://lhttp.qingting.fm/live/15318341/64k.mp3", name: "AsiaFM HD音乐台" },
    { url: "https://lhttp.qingting.fm/live/20071/64k.mp3", name: "AsiaFM 亚洲天空台" },
    { url: "https://lhttp.qingting.fm/live/5021912/64k.mp3", name: "AsiaFM 亚洲经典台" },
    { url: "https://lhttp.qingting.fm/live/5022308/64k.mp3", name: "500首华语经典" },
    { url: "https://lhttp.qingting.fm/live/4998/64k.mp3", name: "萤火虫网络电台" },
    { url: "https://lhttp.qingting.fm/live/20212402/64k.mp3", name: "曲艺评书广播" },
    { url: "http://mtradio.xbo.tw:8000/;", name: "ACG动漫音乐电台(暂挂)" },
    { url: "http://tedc.biz:8000/stream/1/", name: "MhR动漫音乐电台" },
    { url: "https://lhttp.qingting.fm/live/4915/64k.mp3", name: "清晨音乐台" },
    { url: "https://lhttp.qingting.fm/live/4804/64k.mp3", name: "怀集音乐之声" },
    { url: "https://lhttp.qingting.fm/live/5022107/64k.mp3", name: "动听音乐网络电台" },
    { url: "https://lhttp.qingting.fm/live/20026/64k.mp3", name: "郁南音乐台" },
    { url: "https://lhttp.qingting.fm/live/20207761/64k.mp3", name: "80后音悦台" },
    { url: "https://lhttp.qingting.fm/live/20210755/64k.mp3", name: "星河音乐" },
    { url: "https://lhttp.qingting.fm/live/20509/64k.mp3", name: "中国豫剧广播" },
    { url: "https://lhttp.qingting.fm/live/20210756/64k.mp3", name: "天籁古典" },
    { url: "https://lhttp.qingting.fm/live/15318393/64k.mp3", name: "河南电台网络戏曲广播" },
    { url: "https://lhttp.qingting.fm/live/20207762/64k.mp3", name: "河南经典FM" },
    { url: "https://lhttp.qingting.fm/live/20212393/64k.mp3", name: "麻辣966" },
    { url: "https://lhttp.qingting.fm/live/20207760/64k.mp3", name: "90后潮流音悦台" },
    { url: "https://lhttp.qingting.fm/live/20091/64k.mp3", name: "中国校园之声" },
    { url: "https://lhttp.qingting.fm/live/20207763/64k.mp3", name: "民谣音乐台" },
    { url: "https://lhttp.qingting.fm/live/5022379/64k.mp3", name: "西江之声" },
    { url: "https://lhttp.qingting.fm/live/5022542/64k.mp3", name: "全球华语音乐之声" },
    { url: "https://lhttp.qingting.fm/live/5021391/64k.mp3", name: "UmiMusic悠米音悦台" },
    { url: "https://lhttp.qingting.fm/live/20207765/64k.mp3", name: "摇滚天空台" },
    { url: "https://lhttp.qingting.fm/live/20207764/64k.mp3", name: "爵士FM" },
    { url: "https://lhttp.qingting.fm/live/15318191/64k.mp3", name: "520星恋情感电台" },
    { url: "https://lhttp.qingting.fm/live/4913/64k.mp3", name: "Yippee Play" },
    { url: "https://lhttp.qingting.fm/live/20452/64k.mp3", name: "瓢虫台" },
    { url: "https://lhttp.qingting.fm/live/20212320/64k.mp3", name: "中国交通网络应急广播" },
    { url: "https://lhttp.qingting.fm/live/15318519/64k.mp3", name: "声音控电台" },
    { url: "https://lhttp.qingting.fm/live/21055/64k.mp3", name: "明星FM" },
    { url: "https://lhttp.qingting.fm/live/4917/64k.mp3", name: "态度电台" },
    { url: "https://lhttp.qingting.fm/live/20500021/64k.mp3", name: "高源之声汽车音乐电台" },
    { url: "https://lhttp.qingting.fm/live/20212420/64k.mp3", name: "Piano FM" },
    { url: "https://lhttp.qingting.fm/live/5021917/64k.mp3", name: "心约之声公益广播" },
    { url: "https://lhttp.qingting.fm/live/20500038/64k.mp3", name: "卷卷猫电台" },
    { url: "https://lhttp.qingting.fm/live/5022491/64k.mp3", name: "蝠声家音频率" },
    { url: "https://lhttp-hw.qtfm.cn/live/4891/64k.mp3", name: "成都交通文艺广播FM91.4" },
    { url: "https://lhttp-hw.qtfm.cn/live/4581/64k.mp3", name: "亚洲音乐成都FM96.5" }
];

let currentStationIndex = -1;
let isCollapsed = true;
let currentFileName = "";
let volumePercentageTimeout;
let progressTimeTimeout;

const audio = document.getElementById('background-music');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const volumeSlider = document.getElementById('volume-slider');
const volumePercentage = document.getElementById('volume-percentage');
const musicTitle = document.getElementById('music-title');
const stationNameCollapsed = document.getElementById('station-name-collapsed');
const stationSelect = document.getElementById('station-select');
const toggleBtn = document.getElementById('toggle-btn');
const customPlayBtn = document.getElementById('custom-play-btn');
const customPlayInputContainer = document.getElementById('custom-play-input-container');
const customPlayInput = document.getElementById('custom-play-input');
const customPlaySubmit = document.getElementById('custom-play-submit');
const customPlayDragArea = document.getElementById('custom-play-drag-area');
const progressContainer = document.getElementById('progress-container');
const progressSlider = document.getElementById('progress-slider');
const progressTime = document.getElementById('progress-time');
const currentTimeDisplay = document.getElementById('current-time-display');

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateProgress() {
    if (!audio.duration || isNaN(audio.duration)) return;

    const currentTime = audio.currentTime;
    const duration = audio.duration;
    const progressPercent = (currentTime / duration) * 100;

    progressSlider.value = progressPercent;
    currentTimeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
}

function updateProgressTime(event) {
    if (!audio.duration || isNaN(audio.duration)) return;

    const rect = progressSlider.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    const time = percent * audio.duration;

    progressTime.textContent = `${formatTime(time)} / ${formatTime(audio.duration)}`;

    const min = progressSlider.min ? parseInt(progressSlider.min) : 0;
    const max = progressSlider.max ? parseInt(progressSlider.max) : 100;
    const sliderPercent = (percent * (max - min)) + min;

    progressTime.style.left = `${sliderPercent}%`;
    progressTime.classList.add('show');

    clearTimeout(progressTimeTimeout);
    progressTimeTimeout = setTimeout(() => {
        progressTime.classList.remove('show');
    }, 1000);
}

function updateVolumePercentage() {
    const value = volumeSlider.value;
    volumePercentage.textContent = `${value}%`;

    const min = volumeSlider.min ? parseInt(volumeSlider.min) : 0;
    const max = volumeSlider.max ? parseInt(volumeSlider.max) : 100;
    const percent = (value - min) / (max - min) * 100;

    volumePercentage.style.left = `${percent}%`;
    volumePercentage.classList.add('show');

    clearTimeout(volumePercentageTimeout);
    volumePercentageTimeout = setTimeout(() => {
        volumePercentage.classList.remove('show');
    }, 1000);
}

function updateDisplay(text) {
    musicTitle.textContent = text;
    stationNameCollapsed.textContent = text;
}

function updatePlayerWidth() {
    const musicPlayer = document.querySelector('.music-player');
    if (isCollapsed) {
        if (currentStationIndex >= 0 || currentFileName) {
            musicPlayer.style.width = 'auto';
            musicPlayer.style.padding = '12px 15px';
            stationNameCollapsed.style.display = 'block';
        } else {
            musicPlayer.style.width = '60px';
            musicPlayer.style.padding = '12px';
            stationNameCollapsed.style.display = 'none';
        }
    } else {
        musicPlayer.style.width = 'auto';
        musicPlayer.style.padding = '12px 20px';
        stationNameCollapsed.style.display = 'none';
    }
}

function togglePlayer() {
    const musicPlayer = document.querySelector('.music-player');
    isCollapsed = !isCollapsed;

    if (isCollapsed) {
        musicPlayer.classList.remove('expanded');
        toggleBtn.textContent = '→';
        customPlayInputContainer.classList.remove('show');
    } else {
        musicPlayer.classList.add('expanded');
        toggleBtn.textContent = '←';

        if (currentStationIndex >= 0) {
            const station = stations[currentStationIndex];
            if (audio.paused) {
                updateDisplay(`${station.name} - 点击播放`);
            } else {
                updateDisplay(`${station.name} - 正在播放`);
            }
        } else if (currentFileName) {
            if (audio.paused) {
                updateDisplay(`${currentFileName} - 点击播放`);
            } else {
                updateDisplay(`${currentFileName} - 正在播放`);
            }
        } else {
            updateDisplay("选择自己喜欢的电台");
        }
    }

    updatePlayerWidth();
}

function switchStation(index) {
    if (index >= 0 && index < stations.length) {
        currentStationIndex = index;
        const station = stations[index];

        audio.src = station.url;
        audio.load();

        updateDisplay(station.name);
        stationSelect.value = index;

        progressContainer.classList.remove('show');

        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                playPauseBtn.textContent = '⏸';
                if (!isCollapsed) {
                    updateDisplay(`${station.name} - 正在播放`);
                }
            }).catch(error => {
                console.log("播放被阻止:", error);
                playPauseBtn.textContent = '▶';
                if (!isCollapsed) {
                    updateDisplay(`${station.name} - 点击播放`);
                }
            });
        }
    } else {
        updateDisplay("选择自己喜欢的电台");
        stationSelect.value = "";
        audio.pause();
        playPauseBtn.textContent = '▶';
        progressContainer.classList.remove('show');
    }

    updatePlayerWidth();
}

function playCustomUrl(url) {
    if (!url) return;

    currentStationIndex = -1;
    stationSelect.value = "";
    currentFileName = "自定义音频";

    audio.src = url;
    audio.load();

    updateDisplay("自定义音频 - 正在播放");
    progressContainer.classList.add('show');
    progressSlider.value = 0;
    currentTimeDisplay.textContent = "00:00 / 00:00";

    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.then(_ => {
            playPauseBtn.textContent = '⏸';
            if (!isCollapsed) {
                updateDisplay("自定义音频 - 正在播放");
            }
        }).catch(error => {
            console.log("播放被阻止:", error);
            playPauseBtn.textContent = '▶';
            if (!isCollapsed) {
                updateDisplay("自定义音频 - 点击播放");
            }
            alert("播放失败，请检查音频URL是否正确且支持播放。");
        });
    }

    customPlayInputContainer.classList.remove('show');
    customPlayInput.value = "";
    updatePlayerWidth();
}

function playLocalFile(file) {
    if (!file) return;

    const validTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/ogg', 'audio/oga', 'audio/m4a', 'audio/x-m4a'];
    const validExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
        alert("不支持的文件格式，请选择MP3、WAV、M4A、AAC、OGG等音频文件");
        return;
    }

    currentStationIndex = -1;
    stationSelect.value = "";
    currentFileName = file.name.replace(/\.[^/.]+$/, "");

    const objectUrl = URL.createObjectURL(file);

    audio.src = objectUrl;
    audio.load();

    updateDisplay(`${currentFileName} - 正在播放`);
    progressContainer.classList.add('show');
    progressSlider.value = 0;
    currentTimeDisplay.textContent = "00:00 / 00:00";

    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.then(_ => {
            playPauseBtn.textContent = '⏸';
            if (!isCollapsed) {
                updateDisplay(`${currentFileName} - 正在播放`);
            }
        }).catch(error => {
            console.log("播放被阻止:", error);
            playPauseBtn.textContent = '▶';
            if (!isCollapsed) {
                updateDisplay(`${currentFileName} - 点击播放`);
            }
            alert("播放失败，可能是浏览器不支持该音频格式或文件已损坏。");
        });
    }

    customPlayInputContainer.classList.remove('show');
    updatePlayerWidth();
}

function initMusicPlayer() {
    const stationSelect = document.getElementById('station-select');

    stations.forEach((station, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = station.name;
        stationSelect.appendChild(option);
    });

    audio.volume = volumeSlider.value / 100;
    updateVolumePercentage();

    audio.addEventListener('timeupdate', updateProgress);

    audio.addEventListener('loadedmetadata', function() {
        if (currentStationIndex < 0) {
            updateProgress();
        }
    });

    audio.addEventListener('error', function(e) {
        console.error('音频加载错误:', e);
        updateDisplay('音频加载失败，请检查网络或URL');
        playPauseBtn.textContent = '▶';

        if (currentStationIndex >= 0) {
            setTimeout(() => {
                if (audio.error && currentStationIndex >= 0) {
                    let newIndex = currentStationIndex + 1;
                    if (newIndex >= stations.length) newIndex = 0;
                    switchStation(newIndex);
                }
            }, 2000);
        }
    });

    playPauseBtn.addEventListener('click', function() {
        if (currentStationIndex < 0 && !audio.src && !currentFileName) {
            showToast("请先选择电台、输入URL或拖拽文件");
            return;
        }

        if (audio.paused) {
            audio.play();
            playPauseBtn.textContent = '⏸';
            if (!isCollapsed) {
                if (currentStationIndex >= 0) {
                    updateDisplay(`${stations[currentStationIndex].name} - 正在播放`);
                } else if (currentFileName) {
                    updateDisplay(`${currentFileName} - 正在播放`);
                }
            }
        } else {
            audio.pause();
            playPauseBtn.textContent = '▶';
            if (!isCollapsed) {
                if (currentStationIndex >= 0) {
                    updateDisplay(`${stations[currentStationIndex].name} - 已暂停`);
                } else if (currentFileName) {
                    updateDisplay(`${currentFileName} - 已暂停`);
                }
            }
        }
    });

    progressSlider.addEventListener('input', function() {
        if (!audio.duration || isNaN(audio.duration)) return;
        const percent = this.value / 100;
        audio.currentTime = percent * audio.duration;
    });

    progressSlider.addEventListener('mousemove', updateProgressTime);
    progressSlider.addEventListener('mouseenter', function() {
        if (audio.duration && !isNaN(audio.duration)) {
            progressTime.classList.add('show');
        }
    });
    progressSlider.addEventListener('mouseleave', function() {
        clearTimeout(progressTimeTimeout);
        progressTimeTimeout = setTimeout(() => {
            progressTime.classList.remove('show');
        }, 500);
    });

    volumeSlider.addEventListener('input', function() {
        audio.volume = this.value / 100;
        updateVolumePercentage();
    });

    volumeSlider.addEventListener('mousedown', function() {
        volumePercentage.classList.add('show');
    });
    volumeSlider.addEventListener('mouseup', function() {
        clearTimeout(volumePercentageTimeout);
        volumePercentageTimeout = setTimeout(() => {
            volumePercentage.classList.remove('show');
        }, 1000);
    });
    volumeSlider.addEventListener('mouseenter', function() {
        volumePercentage.classList.add('show');
    });
    volumeSlider.addEventListener('mouseleave', function() {
        clearTimeout(volumePercentageTimeout);
        volumePercentageTimeout = setTimeout(() => {
            volumePercentage.classList.remove('show');
        }, 500);
    });

    prevBtn.addEventListener('click', function() {
        if (currentStationIndex < 0) {
            currentStationIndex = stations.length - 1;
        } else {
            let newIndex = currentStationIndex - 1;
            if (newIndex < 0) newIndex = stations.length - 1;
            currentStationIndex = newIndex;
        }
        switchStation(currentStationIndex);
    });

    nextBtn.addEventListener('click', function() {
        if (currentStationIndex < 0) {
            currentStationIndex = 0;
        } else {
            let newIndex = currentStationIndex + 1;
            if (newIndex >= stations.length) newIndex = 0;
            currentStationIndex = newIndex;
        }
        switchStation(currentStationIndex);
    });

    stationSelect.addEventListener('change', function() {
        const index = parseInt(this.value);
        if (!isNaN(index)) {
            switchStation(index);
        } else {
            switchStation(-1);
        }
    });

    toggleBtn.addEventListener('click', togglePlayer);

    customPlayBtn.addEventListener('click', function() {
        customPlayInputContainer.classList.toggle('show');
    });

    customPlaySubmit.addEventListener('click', function() {
        const url = customPlayInput.value.trim();
        playCustomUrl(url);
    });

    customPlayInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const url = customPlayInput.value.trim();
            playCustomUrl(url);
        }
    });

    document.addEventListener('click', function(e) {
        if (!customPlayInputContainer.contains(e.target) && e.target !== customPlayBtn) {
            customPlayInputContainer.classList.remove('show');
        }
    });

    customPlayDragArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        customPlayDragArea.classList.add('dragover');
    });

    customPlayDragArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        customPlayDragArea.classList.remove('dragover');
    });

    customPlayDragArea.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        customPlayDragArea.classList.remove('dragover');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            playLocalFile(files[0]);
        }
    });

    customPlayDragArea.addEventListener('click', function() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'audio/*,.mp3,.wav,.ogg,.m4a,.aac';
        fileInput.style.display = 'none';

        fileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                playLocalFile(this.files[0]);
            }
        });

        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    });

    switchStation(-1);
    audio.pause();
    playPauseBtn.textContent = '▶';

    document.querySelector('.music-player').classList.remove('expanded');
    toggleBtn.textContent = '→';
    updatePlayerWidth();

    // 滚动收缩
    let scrollCollapseTimer;
    window.addEventListener('scroll', function() {
        if (!isCollapsed) {
            clearTimeout(scrollCollapseTimer);
            scrollCollapseTimer = setTimeout(() => {
                if (!isCollapsed) {
                    togglePlayer();
                }
            }, 300);
        }
    });
}

// ======================= 广播电台查询 =======================

function initRadioQuery() {
    const radioData = {
        korea: {
            guannei: {
                '05:00-06:00': '短波(SW)9875(kHz) 11635(kHz)',
                '06:00-07:00': '短波(SW)9875(kHz) 11635(kHz)',
                '19:00-20:00': '短波(SW)7220(kHz) 9445(kHz)'
            },
            dongbei: {
                '05:00-06:00': '短波(SW)7235(kHz) 9445(kHz)',
                '06:00-07:00': '短波(SW)7235(kHz) 9445(kHz)',
                '13:00-14:00': '短波(SW)7220(kHz) 9445(kHz) 9730(kHz)',
                '16:00-17:00': '短波(SW)7220(kHz) 9445(kHz)'
            },
            southeastasia: {
                '12:00-13:00': '短波(SW)13650(kHz) 15105(kHz)',
                '15:00-16:00': '短波(SW)13650(kHz) 15105(kHz)'
            }
        },
        kbs: {
            '19:00-20:00': '中波(AM)1557(kHz)',
            '19:30-20:30': '短波(SW)6095 9770(kHz)',
            '20:30-21:30': '短波(SW)6095(kHz)',
            '21:00-22:00': '中波(AM)1170(kHz)',
            '07:00-08:00': '短波(SW)7215(kHz)'
        }
    };

    const radioTime = document.getElementById('radio-time');
    const radioResult = document.getElementById('radio-result');

    radioTime.addEventListener('change', function() {
        const time = this.value;
        radioResult.innerHTML = '<p style="margin: 0; text-align: center; color: #00ccff;">请选择电台信息查看详细内容</p>';

        if (time) {
            const isLightTheme = document.body.classList.contains('light-theme');
            const textColor = isLightTheme ? '#333333' : '#00ccff';
            const borderColor = isLightTheme ? 'rgba(49, 130, 206, 0.3)' : 'rgba(0, 204, 255, 0.3)';
            const bgColor = isLightTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)';

            const results = [];

            for (const direction in radioData.korea) {
                if (radioData.korea[direction][time]) {
                    results.push({
                        stationName: '朝鲜之声广播电台(Voice of Korea)',
                        directionName: direction === 'guannei' ? '关内方向' :
                            direction === 'dongbei' ? '东北方向' : '东南亚方向',
                        frequency: radioData.korea[direction][time]
                    });
                }
            }

            if (radioData.kbs[time]) {
                results.push({
                    stationName: '韩国国际广播电台(KBS World Radio)',
                    frequency: radioData.kbs[time]
                });
            }

            radioResult.style.background = bgColor;
            radioResult.style.border = `1px solid ${borderColor}`;

            if (results.length === 0) {
                radioResult.innerHTML = `<p style="margin: 0; text-align: center; color: ${textColor};">该时间没有广播电台信息</p>`;
            } else {
                let resultHTML = `<h4 style="margin: 0 0 15px 0; color: ${textColor}; text-align: center;">${time} 的广播电台信息</h4>`;

                results.forEach((result, index) => {
                    if (index > 0) {
                        resultHTML += `<hr style="margin: 15px 0; border: 1px solid ${borderColor};">`;
                    }

                    if (result.directionName) {
                        resultHTML += `
                            <p style="margin: 5px 0; color: ${textColor};"><strong>电台名称：</strong>${result.stationName}</p>
                            <p style="margin: 5px 0; color: ${textColor};"><strong>电台方向：</strong>${result.directionName}</p>
                            <p style="margin: 5px 0; color: ${textColor};"><strong>广播频率：</strong>${result.frequency}</p>
                        `;
                    } else {
                        resultHTML += `
                            <p style="margin: 5px 0; color: ${textColor};"><strong>电台名称：</strong>${result.stationName}</p>
                            <p style="margin: 5px 0; color: ${textColor};"><strong>广播频率：</strong>${result.frequency}</p>
                        `;
                    }
                });

                radioResult.innerHTML = resultHTML;
            }
        }
    });
}

// ======================= 工具展开/收起 =======================

function initToolToggles() {
    document.querySelectorAll('.tool-title').forEach(title => {
        title.addEventListener('click', function() {
            const container = this.closest('.tool-container');
            container.classList.toggle('open');
        });
    });

    document.querySelectorAll('.countdown-container .tool-title').forEach(title => {
        if (title) {
            title.addEventListener('click', function() {
                const container = this.closest('.tool-container');
                if (container) {
                    container.classList.toggle('open');
                }
            });
        }
    });
}

// ======================= 链接颜色渐变 =======================

function addGradientToLinks() {
    const allLinks = document.querySelectorAll('a');
    allLinks.forEach(link => {
        if (!link.classList.contains('douyin-link')) {
            link.classList.add('gradient-link');
        }
    });
}

// ======================= 浏览器标题动画 =======================

function initBrowserTitleAnimation() {
    const titles = [
        '欢迎访问本网页',
        '等你探索...',
        '本网页大部分内容由AI生成！',
        '持续更新...',
        '如有需求和问题',
        '请联系',
        'QQ：344497165344497165',
        '微信：woshibdj344497165woshibdj',
    ];

    let currentTitleIndex = 0;
    let currentIndex = 0;
    let isShowing = true;

    function animateTitle() {
        const titleText = titles[currentTitleIndex];

        if (isShowing) {
            if (currentIndex < titleText.length) {
                document.title = titleText.substring(0, currentIndex + 1);
                currentIndex++;
                setTimeout(animateTitle, 150);
            } else {
                isShowing = false;
                currentIndex = titleText.length - 1;
                setTimeout(animateTitle, 1000);
            }
        } else {
            if (currentIndex > 0) {
                document.title = titleText.substring(0, currentIndex);
                currentIndex--;
                setTimeout(animateTitle, 150);
            } else {
                currentTitleIndex = (currentTitleIndex + 1) % titles.length;
                const nextTitleText = titles[currentTitleIndex];
                document.title = nextTitleText.substring(0, 1);
                currentIndex = 1;
                isShowing = true;
                setTimeout(animateTitle, 150);
            }
        }
    }

    animateTitle();
}

// ======================= 鼠标点击冒泡社会主义核心价值观 =======================

function initCoreValuesBubble() {
    const coreValues = ['富强', '民主', '文明', '和谐', '自由', '平等', '公正', '法治', '爱国', '敬业', '诚信', '友善'];
    let currentIndex = 0;

    document.addEventListener('click', function(event) {
        const x = event.clientX;
        const y = event.clientY;

        const wordElement = document.createElement('div');
        wordElement.textContent = coreValues[currentIndex];

        wordElement.style.position = 'fixed';
        wordElement.style.left = x + 'px';
        wordElement.style.top = y + 'px';
        wordElement.style.transform = 'translate(-50%, -50%)';
        wordElement.style.fontSize = '18px';
        wordElement.style.fontWeight = 'bold';
        wordElement.style.color = '#00ccff';
        wordElement.style.textShadow = '0 0 10px rgba(0, 204, 255, 0.7)';
        wordElement.style.pointerEvents = 'none';
        wordElement.style.zIndex = '9999';
        wordElement.style.opacity = '1';
        wordElement.style.transition = 'all 1s ease-out';

        document.body.appendChild(wordElement);

        setTimeout(() => {
            wordElement.style.transform = 'translate(-50%, -150px)';
            wordElement.style.opacity = '0';

            setTimeout(() => {
                if (wordElement.parentNode) {
                    wordElement.parentNode.removeChild(wordElement);
                }
            }, 1000);
        }, 10);

        currentIndex = (currentIndex + 1) % coreValues.length;
    });
}

// ======================= 禁止右键菜单和开发者工具 =======================

function initSecurityMeasures() {
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();

        const isLightTheme = document.body.classList.contains('light-theme');
        const popup = document.createElement('div');
        popup.style.position = 'fixed';

        if (isLightTheme) {
            popup.style.background = 'rgba(255, 255, 255, 0.9)';
            popup.style.color = '#3182ce';
            popup.style.boxShadow = '0 0 20px rgba(49, 130, 206, 0.5)';
            popup.style.border = '1px solid rgba(49, 130, 206, 0.3)';
        } else {
            popup.style.background = 'rgba(0, 0, 0, 0.8)';
            popup.style.color = '#00ccff';
            popup.style.boxShadow = '0 0 20px rgba(0, 204, 255, 0.5)';
            popup.style.border = '1px solid rgba(0, 204, 255, 0.3)';
        }

        popup.style.padding = '15px 20px';
        popup.style.borderRadius = '8px';
        popup.style.fontSize = '16px';
        popup.style.fontWeight = 'bold';
        popup.style.zIndex = '9999';
        popup.style.textAlign = 'center';
        popup.style.left = `${e.clientX + 10}px`;
        popup.style.top = `${e.clientY + 10}px`;
        popup.textContent = '该网页不支持鼠标右键哦！';

        document.body.appendChild(popup);

        setTimeout(() => {
            if (popup.parentNode) popup.parentNode.removeChild(popup);
        }, 500);
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && e.key === 'I') ||
            (e.ctrlKey && e.shiftKey && e.key === 'J') ||
            (e.ctrlKey && e.key === 'U')) {
            e.preventDefault();
            alert('本网页禁止使用开发者工具');
        }
    });

    document.addEventListener('mousedown', function(e) {
        if (e.button === 2) e.preventDefault();
    });
}

// ======================= 页面关闭确认 =======================

function initBeforeUnload() {
    window.addEventListener('beforeunload', function(e) {
        e.preventDefault();
        e.returnValue = '确定要关闭网页或重启浏览器吗？';
    });
}

// ======================= 自动链接测试 =======================

function initAutoLinkTest() {
    function isLocalStorageAvailable() {
        try {
            const test = 'test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    function isFirstVisitToday() {
        if (!isLocalStorageAvailable()) return true;
        const today = new Date().toDateString();
        const lastVisit = localStorage.getItem('lastLinkTestDate');
        return lastVisit !== today;
    }

    function updateLastVisitDate() {
        if (isLocalStorageAvailable()) {
            localStorage.setItem('lastLinkTestDate', new Date().toDateString());
        }
    }

    async function testLinkConnectivity(link) {
        return new Promise((resolve) => {
            if (link.includes('javascript:') || link.includes('mailto:') || link.includes('tel:')) {
                resolve(true);
                return;
            }

            const isAndroid = /Android/i.test(navigator.userAgent);

            if (isAndroid) {
                const timeout = setTimeout(() => resolve(false), 10000);

                try {
                    fetch(link, { method: 'HEAD', mode: 'no-cors', timeout: 8000 })
                        .then(() => { clearTimeout(timeout);
                            resolve(true); })
                        .catch(() => {
                            const img = new Image();
                            img.onload = () => { clearTimeout(timeout);
                                resolve(true); };
                            img.onerror = () => { clearTimeout(timeout);
                                resolve(false); };
                            img.src = link + (link.includes('?') ? '&' : '?') + 'test=' + Date.now();
                        });
                } catch (error) {
                    const img = new Image();
                    img.onload = () => { clearTimeout(timeout);
                        resolve(true); };
                    img.onerror = () => { clearTimeout(timeout);
                        resolve(false); };
                    img.src = link + (link.includes('?') ? '&' : '?') + 'test=' + Date.now();
                }
            } else {
                const img = new Image();
                const timeout = setTimeout(() => resolve(false), 8000);

                img.onload = () => { clearTimeout(timeout);
                    resolve(true); };
                img.onerror = () => {
                    clearTimeout(timeout);
                    fetch(link, { method: 'HEAD', mode: 'no-cors', timeout: 5000 })
                        .then(() => resolve(true))
                        .catch(() => resolve(false));
                };

                img.src = link + (link.includes('?') ? '&' : '?') + 'test=' + Date.now();
            }
        });
    }

    async function testAllLinks() {
        const links = document.querySelectorAll('a[href^="http"]');
        let testedCount = 0;
        let successCount = 0;
        let failedCount = 0;
        const testResults = [];

        for (const link of links) {
            const statusElement = document.createElement('span');
            statusElement.className = 'link-status link-testing';
            statusElement.textContent = '测试中...';
            link.parentNode.insertBefore(statusElement, link.nextSibling);

            const isConnected = await testLinkConnectivity(link.href);

            testResults.push({
                url: link.href,
                text: link.textContent.trim() || link.href,
                connected: isConnected
            });

            statusElement.className = `link-status ${isConnected ? 'link-success' : 'link-failed'}`;
            statusElement.textContent = isConnected ? '可用' : '不可用';

            testedCount++;
            if (isConnected) successCount++;
            else failedCount++;

            await new Promise(resolve => setTimeout(resolve, 100));
        }

        const testData = {
            date: new Date().toISOString(),
            total: testedCount,
            success: successCount,
            failed: failedCount,
            results: testResults
        };

        if (isLocalStorageAvailable()) {
            localStorage.setItem('linkTestResults', JSON.stringify(testData));
        }

        if (testedCount > 0) {
            const resultElement = document.createElement('div');
            resultElement.style.cssText = `
                position: fixed;
                bottom: 100px;
                right: 25px;
                background: rgba(15, 20, 40, 0.95);
                color: #00ccff;
                padding: 15px;
                border-radius: 10px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 150, 255, 0.3);
                border: 1px solid rgba(0, 150, 255, 0.3);
                z-index: 10000;
                font-size: 14px;
                text-shadow: 0 0 5px rgba(0, 204, 255, 0.5);
            `;
            resultElement.innerHTML = `
                <strong>链接测试完成：</strong><br>
                测试总数：${testedCount}<br>
                可用链接：${successCount}<br>
                不可用链接：${failedCount}
            `;
            document.body.appendChild(resultElement);

            setTimeout(() => resultElement.remove(), 3000);
        }

        displayLinkTestResults(testData);
    }

    function displayLinkTestResults(testData) {
        const pingResults = document.getElementById('ping-results');
        const pingSummary = document.getElementById('ping-summary');
        const pingLinksList = document.getElementById('ping-links-list');

        if (pingResults && pingSummary && pingLinksList) {
            pingResults.classList.add('show');
            pingSummary.textContent = `共测试 ${testData.total} 个链接，成功: ${testData.success}，失败: ${testData.failed}`;
            pingLinksList.innerHTML = '';

            testData.results.forEach(result => {
                const listItem = document.createElement('div');
                listItem.className = 'ping-link-item';
                const linkName = result.text || result.url;
                listItem.innerHTML = `
                    <div class="ping-link-url">
                        <span class="link-name">${linkName}</span>
                        ${result.url}
                    </div>
                    <div class="ping-link-status" style="color: ${result.connected ? '#33cc99' : '#ff5e62'}">
                        ${result.connected ? '✓ 可用' : '✗ 不可用'}
                    </div>
                `;
                pingLinksList.appendChild(listItem);
            });
        }
    }

    if (isFirstVisitToday()) {
        showToast('正在进行网页链接连通性测试，请不要关闭网页或重启浏览器！');
        testAllLinks().then(() => {
            updateLastVisitDate();
            showToast('网页链接连通性测试已完成！');
        });
    } else if (isLocalStorageAvailable()) {
        const savedResults = localStorage.getItem('linkTestResults');
        if (savedResults) {
            try {
                displayLinkTestResults(JSON.parse(savedResults));
            } catch (error) {
                console.error('解析测试结果失败:', error);
            }
        }
    }
}

// ======================= 页面初始化 =======================

document.addEventListener('DOMContentLoaded', function() {
    console.log('页面初始化开始...');

    initTheme();
    initThemeSwitcher();
    initWatchChargeReminder();

    updateTime();
    setInterval(updateTime, 1000);

    initTimestampTool();
    initTimer();
    initStopwatch();
    initCountdowns();
    initCustomCountdowns();
    initPingTest();
    initMusicPlayer();
    initRadioQuery();
    initToolToggles();

    addGradientToLinks();
    initBrowserTitleAnimation();
    initCoreValuesBubble();
    initSecurityMeasures();
    initBeforeUnload();

    // 延迟执行自动链接测试
    setTimeout(initAutoLinkTest, 1000);

    console.log('页面初始化完成');
});