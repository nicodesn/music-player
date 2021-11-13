const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
musicBody = document.querySelector("body"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
showMusicBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = musicList.querySelector("#close");


let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);

window.addEventListener ("load", ()=>{
    loadMusic(musicIndex);
    playingNow();
})

function loadMusic(indexNumb){
  musicName.innerText = allMusic[indexNumb - 1].name;
  musicArtist.innerText = allMusic[indexNumb - 1].artist;
  musicImg.src = `image/${allMusic[indexNumb - 1].src}.jpg`;
  mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
}

function Body(){
    musicBody.classList.add('musicImg');
    musicBody.querySelector('musicImg');
}

function playMusic (){
    wrapper.classList.add('paused');
    playPauseBtn.querySelector('i').innerText = "pause"; // adicionando icone.
    mainAudio.play();
}
function pauseMusic (){
    wrapper.classList.remove('paused');
    playPauseBtn.querySelector('i').innerText = "play_arrow";
    mainAudio.pause();
}

function nextMusic(){
    musicIndex++;
    musicIndex > allMusic.length ? musicIndex = 1: musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

function prevMusic(){
    musicIndex--;
    musicIndex < 1 ? musicIndex = allMusic.length: musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}
playPauseBtn.addEventListener("click", () => {
    const isMusicPaused = wrapper.classList.contains("paused");
    //se isPlayMusic for verdadeiro então chame pauseMusic senão chame playMusic
    //no primeiro clique, ele retornará falso porque não há nenhuma classe pausada no wrapper, então a função de reprodução de música chamará e adicionaremos uma classe pausada dentro da função playmusic
    isMusicPaused ? pauseMusic () : playMusic ();
    playingNow();
});

nextBtn.addEventListener("click", () =>{
    nextMusic();
});

prevBtn.addEventListener("click", () =>{
    prevMusic();
});

mainAudio.addEventListener("timeupdate", (e)=>{
    //console.log(e); verficar a currentTime.
    const currentTime = e.target.currentTime; //obtendo a hora atual da música
    const duration = e.target.duration; //obtendo a duração total da música
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current-time"),
    musicDuration = wrapper.querySelector(".max-duration");

    mainAudio.addEventListener("loadeddata", ()=>{
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10){ // adicionando 0 secundos se for menor que 10.
            totalSec = `0${totalSec}`;
        }

        musicDuration.innerText = `${totalMin} : ${totalSec}`;
    });

    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10){ // adicionando 0 secundos se for menor que 10.
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin} : ${currentSec}`;
});

progressArea.addEventListener("click", (e)=>{
    let progressWidthval = progressArea.clientWidth; //obtendo largura para barra de progresso
    let clickedOffsetX = e.offsetX; //obtendo valor de compensação
    let songDuration = mainAudio.duration; // obtendo o total de duração.
    mainAudio.currentTime = (clickedOffsetX / progressWidthval) * songDuration;
    playMusic();
});

const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", ()=>{
    let getText = repeatBtn.innerText;
    //Fazendo mudanças diferentes em um ícone diferente, Quando é pressionado o botão.
    switch(getText){
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Repetir uma");
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Aleatório");
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Repetir todas");
            break;
    }
});

mainAudio.addEventListener("ended", ()=>{
    let getText = repeatBtn.innerText;
    switch(getText){
        case "repeat":
            nextMusic();
            break;
        case "repeat_one":
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle":
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do{
                randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            }while(musicIndex == randIndex);
            musicIndex = randIndex;  //passando randomIndex para musicIndex para que a música aleatória toque
            loadMusic(musicIndex);
            playMusic();
            playingNow();
            break;
    }
});

showMusicBtn.addEventListener("click", ()=>{
    musicList.classList.toggle("show");
});
hideMusicBtn.addEventListener("click", ()=>{
    showMusicBtn.click();
});

const ulTag = wrapper.querySelector("ul");
for(let i = 0; i < allMusic.length; i++) {
    
    let liTag = `<li li-index="${i + 1}">
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <span id="${allMusic[i].src}" class="audio-duration">2:28</span>
                    <audio class="${allMusic[i].src}" id="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let listAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", ()=>{
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10){ // adicionando 0 secundos se for menor que 10.
            totalSec = `0${totalSec}`;
        }

        listAudioDuration.innerText = `${totalMin} : ${totalSec}`;
        listAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });
}   
const allLiTags = ulTag.querySelectorAll("li");

// reproduz uma música específica da lista ao clicar na tag li
function playingNow(){
    for(let j = 0; j < allLiTags.length; j++){

        let audioTag = allLiTags[j].querySelector(".audio-duration");

        if(allLiTags[j].classList.contains("playing")){
            allLiTags[j].classList.remove("playing");
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration;
        }
        if(allLiTags[j].getAttribute("li-index") == musicIndex){
            allLiTags[j].classList.add("playing");
            audioTag.innerText = "tocando";
        }
        allLiTags[j].setAttribute("onclick", "clicked(this)")
    }
}
//vai tocar uma música quando será clicado no li
function clicked(element){ // obtendo o índice li de um clique específico
    let getLiIndex= element.getAttribute("li-index");
    musicIndex = getLiIndex; // passando o musicIndex p/ getLiIndex.
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}