const overlay = document.getElementById('overlay');
const overlayButton = document.getElementById('overlayButton');
const audio = document.getElementById("audio");
const toggleButton = document.getElementById("togglePlayPause");

const audioList = [
  "assets/audios/audio1.mp3",
  "assets/audios/audio2.mp3",
  "assets/audios/audio3.mp3"
];

let audioIndex = 0;

const progress = document.getElementById("progress");
const currentTimeDisplay = document.getElementById("current-time");
const durationDisplay = document.getElementById("duration");
const volumeButton = document.getElementById("volumeButton");
const volumeSlider = document.getElementById("volumeSlider");

const tagline = document.querySelector('.tagline');
const taglineText = tagline?.getAttribute('data-text') || '';
if (tagline) tagline.textContent = '';

function loadAudio(index) {
  if (!audioList[index]) return;
  audio.src = audioList[index];
  audio.load();
  updateToggleIcon();
  updateProgressAria(0);
}

function togglePlayPause() {
  if (audio.paused) {
    audio.play().catch(console.warn);
  } else {
    audio.pause();
  }
}

function changeAudio(step) {
  audioIndex = (audioIndex + step + audioList.length) % audioList.length;
  loadAudio(audioIndex);
  audio.play().catch(console.warn);
}

function nextAudio() { changeAudio(1); }
function prevAudio() { changeAudio(-1); }

function updateToggleIcon() {
  const icon = toggleButton?.querySelector("i");
  if (!icon) return;
  icon.classList.toggle("fa-play", audio.paused);
  icon.classList.toggle("fa-pause", !audio.paused);
}

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${secs}`;
}

audio.addEventListener("timeupdate", () => {
  const { currentTime, duration } = audio;
  currentTimeDisplay.textContent = formatTime(currentTime);
  durationDisplay.textContent = formatTime(duration);
  const percent = duration ? (currentTime / duration) * 100 : 0;
  progress.style.width = `${percent}%`;
  updateProgressAria(percent);
});

audio.addEventListener("loadedmetadata", () => {
  durationDisplay.textContent = formatTime(audio.duration);
});

function updateProgressAria(value) {
  const progressBar = document.querySelector('.progress-bar');
  if (progressBar) {
    progressBar.setAttribute('aria-valuenow', Math.round(value));
  }
}

function seekAudio(event) {
  const { offsetX, currentTarget } = event;
  const duration = audio.duration;
  if (!isNaN(duration) && duration > 0) {
    audio.currentTime = (offsetX / currentTarget.offsetWidth) * duration;
  }
}

audio.addEventListener("ended", nextAudio);
audio.addEventListener("play", updateToggleIcon);
audio.addEventListener("pause", updateToggleIcon);

function toggleMute() {
  audio.muted = !audio.muted;
  updateVolumeIcon();
}

function updateVolumeIcon() {
  const icon = volumeButton?.querySelector("i");
  if (!icon) return;
  icon.classList.toggle("fa-volume-mute", audio.muted || audio.volume === 0);
  icon.classList.toggle("fa-volume-up", !audio.muted && audio.volume > 0);
}

volumeSlider.addEventListener("input", (e) => {
  audio.volume = e.target.value;
  audio.muted = audio.volume === 0;
});

audio.addEventListener("volumechange", () => {
  volumeSlider.value = audio.volume;
  updateVolumeIcon();
});

volumeSlider.value = audio.volume;
loadAudio(audioIndex);

function typeWriter(text, element, i = 0, speed = 100) {
  if (i < text.length) {
    element.textContent += text.charAt(i);
    setTimeout(() => typeWriter(text, element, i + 1, speed), speed);
  }
}

overlayButton?.addEventListener('click', () => {
  overlay.style.display = 'none';
  audio.play().catch(console.warn);
  typeWriter(taglineText, tagline);
  overlayButton.setAttribute('disabled', ''); 
});

function updateClock() {
  const clockElement = document.getElementById("clock");
  if (!clockElement) return;

  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12;
  clockElement.textContent = `${hours}:${minutes} ${ampm}`;
}

setInterval(updateClock, 1000);
updateClock();
