// Todo List Functionality
const todoButton = document.querySelector('.todo-button');
const todoPanel = document.querySelector('.todo-panel');
const closeBtn = document.querySelector('.close-btn');
const todoInput = document.getElementById('todoInput');
const addTodoBtn = document.getElementById('addTodo');
const todoList = document.getElementById('todoList');

// Toggle Todo Panel
todoButton.addEventListener('click', () => {
    todoPanel.classList.add('active');
});

closeBtn.addEventListener('click', () => {
    todoPanel.classList.remove('active');
});

// Add Todo Item
function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${todoText}</span>
            <button class="delete-btn"><i class="fas fa-trash"></i></button>
        `;
        
        // Add delete functionality
        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            li.remove();
        });

        todoList.appendChild(li);
        todoInput.value = '';
    }
}

addTodoBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// Music Player Functionality
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progress = document.querySelector('.progress');
const songTitle = document.getElementById('songTitle');

let isPlaying = false;
let currentSong = 0;

// Playlist with actual songs from assets folder
const playlist = [
    {
        title: "In Dream Land",
        url: "assets/musics/1-indreamland.mp3"
    },
    {
        title: "2:00 AM",
        url: "assets/musics/2-2am.mp3"
    }
];

// Create audio element
const audio = new Audio();

// Update progress bar
audio.addEventListener('timeupdate', () => {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = `${progressPercent}%`;
});

// When song ends, play next song
audio.addEventListener('ended', () => {
    currentSong = (currentSong + 1) % playlist.length;
    loadSong(currentSong);
    if (isPlaying) {
        audio.play();
    }
});

// Play/Pause functionality
playBtn.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        audio.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
    isPlaying = !isPlaying;
});

// Previous song
prevBtn.addEventListener('click', () => {
    currentSong = (currentSong - 1 + playlist.length) % playlist.length;
    loadSong(currentSong);
    if (isPlaying) {
        audio.play();
    }
});

// Next song
nextBtn.addEventListener('click', () => {
    currentSong = (currentSong + 1) % playlist.length;
    loadSong(currentSong);
    if (isPlaying) {
        audio.play();
    }
});

// Load song
function loadSong(index) {
    audio.src = playlist[index].url;
    songTitle.textContent = playlist[index].title;
    if (isPlaying) {
        audio.play();
    }
}

// Initialize with first song
loadSong(currentSong);

// --- Pomodoro Timer FAB & Panel (독립 동작) ---
const openTimerBtn = document.getElementById('open-timer-btn');
const timerPanel = document.getElementById('timer-panel');

function showTimerPanel() {
  timerPanel.style.opacity = '1';
  timerPanel.style.pointerEvents = 'all';
  timerPanel.style.transform = 'translateY(0)';
  // 타이머 패널이 열릴 때 투두 패널 닫기
  if (todoPanel) {
    todoPanel.classList.remove('active');
  }
}
function hideTimerPanel() {
  timerPanel.style.opacity = '0';
  timerPanel.style.pointerEvents = 'none';
  timerPanel.style.transform = 'translateY(30px)';
}

if (openTimerBtn && timerPanel) {
  openTimerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (timerPanel.style.opacity === '1') {
      hideTimerPanel();
    } else {
      showTimerPanel();
    }
  });

  document.addEventListener('click', (e) => {
    // 패널 내부 클릭은 무시 (버튼 등 포함)
    if (timerPanel.contains(e.target) || e.target === openTimerBtn) {
      return;
    }
    hideTimerPanel();
  });
}

// Prevent timer panel from closing when clicking any button inside it
if (timerPanel) {
  timerPanel.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
    });
  });
}

// --- Pomodoro Timer Logic ---
const startTimerBtn = document.getElementById('startTimer');
const resetTimerBtn = document.getElementById('resetTimer');
const settingsBtn = document.getElementById('timer-settings-btn');
const timerSettings = document.querySelector('.timer-settings');
const saveSettingsBtn = document.getElementById('saveSettings');
const workTimeInput = document.getElementById('workTime');
const breakTimeInput = document.getElementById('breakTime');
const repeatCountInput = document.getElementById('repeatCount');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const currentRoundSpan = document.getElementById('currentRound');
const totalRoundsSpan = document.getElementById('totalRounds');
const timerProgress = document.getElementById('timerProgress');

let timeLeft = 25 * 60;
let timerId = null;
let isWorkTime = true;
let workTime = 25;
let breakTime = 5;
let repeatCount = 4;
let currentRound = 1;
const CIRCLE_LENGTH = 2 * Math.PI * 74;

if (settingsBtn && timerSettings) {
    settingsBtn.addEventListener('click', () => {
        timerSettings.classList.toggle('active');
    });
}

if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', () => {
        workTime = parseInt(workTimeInput.value);
        breakTime = parseInt(breakTimeInput.value);
        repeatCount = parseInt(repeatCountInput.value);
        totalRoundsSpan.textContent = repeatCount;
        resetTimer();
        timerSettings.classList.remove('active');
    });
}

if (startTimerBtn) {
    startTimerBtn.addEventListener('click', () => {
        if (timerId === null) {
            startTimer();
            startTimerBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            pauseTimer();
            startTimerBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    });
}

if (resetTimerBtn) {
    resetTimerBtn.addEventListener('click', () => {
        resetTimer();
        startTimerBtn.innerHTML = '<i class="fas fa-play"></i>';
    });
}

function startTimer() {
    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay();
        updateCircle();
        if (timeLeft === 0) {
            clearInterval(timerId);
            timerId = null;
            if (!isWorkTime) {
                currentRound++;
                currentRoundSpan.textContent = currentRound;
            }
            if (currentRound > repeatCount) {
                startTimerBtn.innerHTML = '<i class="fas fa-play"></i>';
                // Play notification sound
                const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
                audio.play();
                return;
            }
            isWorkTime = !isWorkTime;
            timeLeft = (isWorkTime ? workTime : breakTime) * 60;
            updateDisplay();
            updateCircle();
            startTimerBtn.innerHTML = '<i class="fas fa-play"></i>';
            // Play notification sound
            const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
            audio.play();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerId);
    timerId = null;
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = true;
    timeLeft = workTime * 60;
    currentRound = 1;
    currentRoundSpan.textContent = currentRound;
    totalRoundsSpan.textContent = repeatCount;
    updateDisplay();
    updateCircle();
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    updateCircle();
}

function updateCircle() {
    let total = (isWorkTime ? workTime : breakTime) * 60;
    let percent = timeLeft / total;
    if (timerProgress) {
        timerProgress.setAttribute('stroke-dasharray', CIRCLE_LENGTH);
        timerProgress.setAttribute('stroke-dashoffset', CIRCLE_LENGTH * (1 - percent));
    } else {
        console.warn('timerProgress SVG element not found!');
    }
}

// 초기화
resetTimer(); 