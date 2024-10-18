import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const startBtn = document.querySelector('button[data-start]');
const datePicker = document.getElementById('datetime-picker');
let userSelectedDate;

flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const now = new Date().getTime();
    const inFuture = selectedDates[0].getTime() - now > 0;

    if (!inFuture) {
      iziToast.show({
        message: 'Please choose a date in the future',
        color: 'red',
        position: 'topRight',
      });
      startBtn.disabled = true;
      return;
    }

    userSelectedDate = selectedDates[0];
    startBtn.disabled = false;
  },
});

startBtn.addEventListener('click', e => {
  e.target.disabled = true;
  datePicker.disabled = true;
  startTimer(userSelectedDate);
});

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function startTimer(targetDate) {
  const daysEl = document.querySelector('[data-days]');
  const hoursEl = document.querySelector('[data-hours]');
  const minutesEl = document.querySelector('[data-minutes]');
  const secondsEl = document.querySelector('[data-seconds]');

  function updateTimer() {
    const now = new Date().getTime();
    const timeLeft = targetDate - now;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      startBtn.disabled = false;
      datePicker.disabled = false;
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(timeLeft);

    daysEl.textContent = addLeadingZero(days);
    hoursEl.textContent = addLeadingZero(hours);
    minutesEl.textContent = addLeadingZero(minutes);
    secondsEl.textContent = addLeadingZero(seconds);
  }

  const timerInterval = setInterval(updateTimer, 1000);
  updateTimer();
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
