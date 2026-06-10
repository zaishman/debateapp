/*
pre-set: 5:00
when click "play", timer 
when click "increase" -> math.floor (minutes + 1) 
minutes = ""/60
seconds = 60
*/
const fiveStart = 300;
let currentSeconds = fiveStart;
let timerInterval = null;

function countdown(timeSeconds) {
    clearInterval(timerInterval);
    let timeLeft = timeSeconds;

    timerInterval = setInterval(() => {
        const display = document.getElementById('timer');
        let minutes = Math.floor(timeLeft/60);
        let seconds = timeLeft % 60;

        const formattedMinutes = minutes < 10 ? "0" + minutes : String(minutes);
        const formattedSeconds = seconds < 10 ? "0" + seconds : String(seconds);

        display.textContent = `${formattedMinutes}:${formattedSeconds}`

        currentSeconds = timeLeft; 

        if (--timeLeft < 0) {
            clearInterval(timer);
            display.textContent = "00:00"
        }
    }, 1000);
}

const upTime = document.getElementById('increaseTime');
const downTime = document.getElementById('decreaseTime');


    upTime.addEventListener('click', function() {
        const wasRunning = timerInterval !== null;
        clearInterval(timerInterval);
        timerInterval = null;
        currentSeconds += 60;
        if (wasRunning) countdown(currentSeconds);
        else updateDisplay(currentSeconds);
    });

    downTime.addEventListener('click', function () {
        const wasRunning = timerInterval !== null;
        clearInterval(timerInterval);
        timerInterval = null;
        currentSeconds = Math.max(0, currentSeconds - 60);
        if (wasRunning) countdown(currentSeconds);
        else updateDisplay(currentSeconds);
    });

    let clickCount = 0;
    const coolButton = document.getElementById('playButton');

    coolButton.addEventListener('click', () => {
    clickCount++;
    const display1 = coolButton

    if (clickCount % 2 === 1) {
        display1.textContent = "pause";
        if (!timerInterval && currentSeconds > 0) {
            countdown(currentSeconds);
        }
    } else {
        display1.textContent = "play";
        if (timerInterval !== null) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }
    });

    /*
    document.getElementById('pauseButton').addEventListener('click', pauseTimer);

        document.getElementById('playButton').addEventListener('click', function() {
        if (!timerInterval && currentSeconds > 0) {
            countdown(currentSeconds);
    }});*/
