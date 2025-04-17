// src/components/utils/TimerforEmail.js

export function startTimer({ remainingTime, setRemainingTime, setIsSendEmail, saveTimerState }) {
    // Create a new interval when starting the timer
    let intervalId = setInterval(() => {
        if (remainingTime > 0) {
            remainingTime--;
            setRemainingTime(remainingTime);
            saveTimerState(remainingTime, true); // Save the state
        } else {
            setIsSendEmail(false);
            clearInterval(intervalId); // Stop the countdown
            localStorage.removeItem('remainingTime'); // Remove saved time once the timer ends
        }
    }, 1000);

    return intervalId; // Return the intervalId for future clearing
}

export function saveTimerState(remainingTime, isSendEmail) {
    // Save the state to localStorage
    localStorage.setItem('remainingTime', remainingTime);
    localStorage.setItem('isSendEmail', isSendEmail);
}

export function loadTimerState() {
    // Load the timer state from localStorage
    const savedTime = localStorage.getItem('remainingTime');
    const savedStatus = localStorage.getItem('isSendEmail');
    return {
        remainingTime: savedTime !== null ? parseInt(savedTime, 10) : 30, // Default to 30 if not available
        isSendEmail: savedStatus === 'true', // Parse boolean from string
    };
}
