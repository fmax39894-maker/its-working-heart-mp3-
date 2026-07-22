// ===== MP3 Player =====

let currentAudio = null;
let currentButton = null;

const bars = document.querySelectorAll(".bar");

function startVisualizer() {
    bars.forEach(bar => {
        bar.style.animationPlayState = "running";
    });
}

function stopVisualizer() {
    bars.forEach(bar => {
        bar.style.animationPlayState = "paused";
    });
}

function stopAll() {

    document.querySelectorAll("audio").forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });

    document.querySelectorAll(".buttons button:first-child").forEach(btn => {
        btn.innerHTML = "▶";
    });

    stopVisualizer();
}

function togglePlay(id, btn) {

    const audio = document.getElementById("audio" + id);

    // Stop previous song
    if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;

        if (currentButton) {
            currentButton.innerHTML = "▶";
        }
    }

    if (audio.paused) {

        audio.play()
        .then(() => {

            currentAudio = audio;
            currentButton = btn;

            btn.innerHTML = "⏸";

            startVisualizer();

        })
        .catch(err => {
            alert("Cannot play this MP3.\n\nCheck the file name or location.");
            console.log(err);
        });

    } else {

        audio.pause();
        btn.innerHTML = "▶";
        stopVisualizer();

    }

    audio.onended = function () {
        btn.innerHTML = "▶";
        stopVisualizer();
    };

}

function toggleLoop(id, btn) {

    const audio = document.getElementById("audio" + id);

    audio.loop = !audio.loop;

    if (audio.loop) {
        btn.style.background = "#ff9800";
    } else {
        btn.style.background = "#2979ff";
    }

}