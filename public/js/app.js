const main = document.querySelector(".main"),
  listSongWrap = main.querySelector(".songs-list__songs"),
  songImg = main.querySelector(".disc-wrap img"),
  songName = main.querySelector(".disc-wrap__name"),
  songAuthor = main.querySelector(".disc-wrap__author"),
  mainAudio = main.querySelector("#main-audio"),
  playBtn = main.querySelector(".play"),
  pauseBtn = main.querySelector(".pause"),
  backBtn = main.querySelector(".back"),
  nextBtn = main.querySelector(".next"),
  progressArea = main.querySelector(".progress-area"),
  progressBar = main.querySelector(".progress-bar");
const repeatBtn = main.querySelector(".repeat");
let musicIndex = Math.floor(Math.random() * songs.length + 1);
// Start music
window.addEventListener("load", () => {
  loadMusic(musicIndex);
  playingNow();
  scrollActiveSongToView(); //
});
renderMusic();
// Main
// render number of songs
const headingArea = main.querySelector(".main-area__heading");
headingArea.innerHTML = `<h3> Most Popular</h3> 
<span>${songs.length} Songs (<a href="https://soundcloud.com">© SoundCloud</a>)</span>`;
// Render Music
function renderMusic() {
  const arrRender = [];
  for (let i = 0; i < songs.length; i++) {
    let htmls = `<div class="song">
            <div class="song-info" div-index='${i + 1}' onclick='clicked(this)'>
            <img src="${songs[i].image}">
            <span class="song-info__number">${i + 1}</span>
            <span class="song-info__author">${songs[i].singer}</span>
            <span class="song-info__dash">-</span>
            <span class="song-info__name">${songs[i].name}</span>
            </div>
            <i class="ri-heart-fill love"></i>
        </div>`;
    arrRender.push(htmls);
  }
  listSongWrap.innerHTML = arrRender.join("");
}
// handle left display
// Load music
const loadMusic = (indexNum) => {
  songName.innerHTML = songs[indexNum - 1].name;
  songAuthor.innerHTML = songs[indexNum - 1].singer;
  songImg.src = `${songs[indexNum - 1].image}`;
  mainAudio.src = `${songs[indexNum - 1].path}`;
};
// CD Rotate
const cdAnimate = songImg.animate([{ transform: "rotate(360deg)  " }], {
  duration: 10000,
  iterations: Infinity,
});
cdAnimate.pause();
// Play , Pause Music Functions
const playMusic = () => {
  playBtn.classList.add("active");
  mainAudio.play();
  cdAnimate.play();
};
const pauseMusic = () => {
  playBtn.classList.remove("active");
  mainAudio.pause();
  cdAnimate.pause();
};
// Next / Previous Music Functions
const nextMusic = () => {
  musicIndex++;
  musicIndex > songs.length ? (musicIndex = 1) : musicIndex;
  loadMusic(musicIndex);
  playMusic();
};
const PreMusic = () => {
  musicIndex--;
  musicIndex < 1 ? (musicIndex = songs.length) : musicIndex;
  loadMusic(musicIndex);
  playMusic();
};
//  play Music Event
playBtn.addEventListener("click", () => {
  const isMusicPause = playBtn.classList.contains("active");
  if (!isMusicPause) {
    playMusic();
  }
});
// pause
pauseBtn.addEventListener("click", () => {
  const isMusicPlay = playBtn.classList.contains("active");
  if (isMusicPlay) {
    pauseMusic();
  }
});
// prev , next button event
backBtn.addEventListener("click", () => {
  PreMusic();
  playingNow();
  scrollActiveSongToView();
});
nextBtn.addEventListener("click", () => {
  nextMusic();
  playingNow();
  scrollActiveSongToView();
});
// handle Progress bar update time
mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;
  let progressWidth = (currentTime * 100) / duration;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = main.querySelector(".current"),
    musicDuration = main.querySelector(".duration");
  mainAudio.addEventListener("loadeddata", () => {
    // duration update
    let audioDuration = mainAudio.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    musicDuration.innerText = `${totalMin}:${totalSec}`;
  });
  // Current Time Update
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) {
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});
// progress bar update time when click
progressArea.addEventListener("click", (e) => {
  let progressWidthValue = progressArea.clientWidth;
  let clickOffSetX = e.offsetX;
  let songDuration = mainAudio.duration;
  mainAudio.currentTime = (clickOffSetX * songDuration) / progressWidthValue;
  playMusic();
});
// song repeat ,repeat one, shuffle
repeatBtn.addEventListener("click", () => {
  let getText = repeatBtn.innerText;
  switch (getText) {
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      break;
  }
});
mainAudio.addEventListener("ended", () => {
  let getText = repeatBtn.innerText;
  switch (getText) {
    case "repeat":
      nextMusic();
      playingNow();
      scrollActiveSongToView();
      break;
    case "repeat_one":
      mainAudio.currentTime = 0;
      loadMusic(musicIndex);
      playMusic();
      break;
    case "shuffle":
      let randIndex = Math.floor(Math.random() * songs.length + 1);
      do {
        randIndex = Math.floor(Math.random() * songs.length + 1);
      } while (musicIndex === randIndex);
      musicIndex = randIndex;
      loadMusic(musicIndex);
      playingNow();
      scrollActiveSongToView();
      playMusic();
      break;
  }
});
// Change Volume
function setVolume() {
  const volRange = main.querySelector(".volume-bar__range");
  mainAudio.volume = volRange.value / 100;
}
// Volume Bar
const volBtn = main.querySelector(".vol");
volBtn.onclick = () => {
  volBtn.classList.toggle("active");
};
//end handle left display
// handle right display
// play song when click
const clicked = (e) => {
  let getDivIndex = e.getAttribute("div-index");
  console.log(getDivIndex);
  musicIndex = getDivIndex;
  loadMusic(getDivIndex);
  playMusic();
  playingNow();
};
// Set Class 'playing'
const allSong = listSongWrap.querySelectorAll("div.song");
const allSongInfo = listSongWrap.querySelectorAll("div.song-info");
function playingNow() {
  for (let i = 0; i < allSongInfo.length; i++) {
    if (allSong[i].classList.contains("playing")) {
      allSong[i].classList.remove("playing");
    } else if (allSongInfo[i].getAttribute("div-index") == musicIndex) {
      allSong[i].classList.add("playing");
    }
  }
}
// scroll into view
function scrollActiveSongToView() {
  setTimeout(() => {
    main.querySelector(".song.playing").scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, 300);
}
// Love Loved
const love = document.querySelectorAll(".love");
love.forEach((luv) => {
  luv.addEventListener("click", () => {
    luv.classList.toggle("active");
  });
});
// Nav Change Tab
const navA = document.querySelectorAll(".nav__list-item-link");
navA.forEach((a) => {
  a.onclick = () => {
    navA.forEach((a) => {
      if (a.classList.contains("active")) {
        a.classList.remove("active");
      }
    });
    a.classList.add("active");
  };
});
localStorage;
