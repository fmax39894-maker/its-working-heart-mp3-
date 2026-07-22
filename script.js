let currentAudio = null;
let currentPlayBtn = null;

function togglePlay(id, btn) {

    const audio = document.getElementById("audio" + id);
    const player = audio.closest(".player");
    const bars = player.querySelectorAll(".bar");

    // Stop previous song
    if (currentAudio && currentAudio !== audio) {

        currentAudio.pause();
        currentAudio.currentTime = 0;

        if (currentPlayBtn)
            currentPlayBtn.innerHTML = "▶ Play";

        document.querySelectorAll(".bar").forEach(bar=>{
            bar.style.animationPlayState="paused";
        });

    }

    if (audio.paused) {

        audio.play();

        btn.innerHTML = "⏸ Pause";

        bars.forEach(bar=>{
            bar.style.animationPlayState="running";
        });

        currentAudio = audio;
        currentPlayBtn = btn;

    } else {

        audio.pause();

        btn.innerHTML = "▶ Play";

        bars.forEach(bar=>{
            bar.style.animationPlayState="paused";
        });

    }

    audio.onended = function(){

        btn.innerHTML="▶ Play";

        bars.forEach(bar=>{
            bar.style.animationPlayState="paused";
        });

    };

}

function toggleLoop(id, btn){

    const audio=document.getElementById("audio"+id);

    audio.loop=!audio.loop;

    btn.innerHTML=audio.loop ? "🔁 Loop On" : "🔁 Loop Off";

}