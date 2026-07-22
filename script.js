const mp3Files = [
  "song1.mp3",
  "song2.mp3",
  "song3.mp3",
  "song4.mp3",
  "song5.mp3",
  "song6.mp3"
];

const container = document.getElementById("songs");
const player = new Audio();

let currentBtn = null;

mp3Files.forEach((file, i) => {
  container.innerHTML += `
    <div class="song">
      <span>${file.replace(".mp3","")}</span>
      <div class="buttons">
        <button onclick="playPause(${i},this)">▶</button>
        <button onclick="toggleLoop()">🔁</button>
      </div>
    </div>
  `;
});

function playPause(i, btn) {
  const src = "mp3/" + mp3Files[i];

  if (player.src.endsWith(src) && !player.paused) {
    player.pause();
    btn.innerHTML = "▶";
    return;
  }

  if (currentBtn) currentBtn.innerHTML = "▶";

  player.src = src;
  player.play();

  btn.innerHTML = "⏸";
  currentBtn = btn;
}

function toggleLoop() {
  player.loop = !player.loop;
}

player.onended = () => {
  if (currentBtn) currentBtn.innerHTML = "▶";
};