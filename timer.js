/* Function to display a Countdown timer with starting time from a form */
// sets variables for minutes and seconds

const timerDisplay = document.querySelector('.time_left');
const endTime = document.querySelector('.end_time');
const buttons = document.querySelectorAll('[data-time]');

let countdown;

function timer(seconds) {

    clearInterval(countdown);

    const now = Date.now();
    const future = now + seconds * 1000;
    displayTimeLeft(seconds);
    displayEndTime(future);

    countdown = setInterval(() => {
        const secondsLeft = Math.round((future - Date.now()) / 1000);
        if(secondsLeft < 0) {
            clearInterval(countdown);
            return;
          }
        displayTimeLeft(secondsLeft);
    }, 1000);
}

function displayTimeLeft(seconds) {
    const minute = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    const display = `${minute}:${remainderSeconds < 10 ? '0' : ''}${Math.floor(remainderSeconds)}`;
    timerDisplay.textContent = display;
}

function displayEndTime(timestamp) {
    const end = new Date(timestamp);
    const hour = end.getHours();
    const adjustedHour = hour > 12 ? hour - 12 : hour;
    const minutes = end.getMinutes();
    endTime.textContent = `Be Back At ${adjustedHour}:${minutes < 10 ? '0' : ''}${minutes}`;
}

function startTimer() {
    const seconds = parseInt(this.dataset.time);
    timer(seconds);
}

buttons.forEach(button => button.addEventListener('click', startTimer));

document.customForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const mins = this.minutes.value;
    if(isNaN(mins)){
      console.log("works")
      alert("Please enter a whole number of minutes!");
    }
    else{
      console.log(mins);
      timer(mins * 60);
      this.reset();
    }
});

document.getElementsByClassName('subject').addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    alert("works")
  }
})
