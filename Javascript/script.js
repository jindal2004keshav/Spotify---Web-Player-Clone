let playbtn = document.querySelector(".playbtn");
var currSong = new Audio();
let playbackPosition = 0;
let block = document.querySelectorAll(".block");
let progress = document.querySelector("#progress");
let songNumber = 0;
let songs;
let nextSong = document.querySelector("#nextSong");
let prevSong = document.querySelector("#prevSong");
let volume = document.querySelector(".volume");
let displayPlaylist = document.querySelectorAll(".playimg");
let temp;

function secondsToMinutes(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;
    var minutesStr = (minutes < 10 ? '0' : '') + minutes;
    var secondsStr = (remainingSeconds < 10 ? '0' : '') + remainingSeconds;
    if(isNaN(seconds) || seconds < 0){
        return "00:00";
    }
    return minutesStr + ':' + secondsStr;
}

let getSongs = async (playlistName) => {
    let a = await fetch(`./songs/${playlistName}`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let listItem = div.getElementsByTagName("a");
    let link = [];
    for(let item of listItem){
        if(item.href.endsWith(".mp3")){
            link.push(item.href);
        }
    }
    return link;
}

let playAudio = async (playimg,playlistName,songNumber,pause = false) => {
    songs = await getSongs(playlistName);
    currSong.src = songs[songNumber];
    if(!pause){
        currSong.play();
        const parts = currSong.src.split('/');
        const encodedSongName = parts[parts.length - 1];
        let songN = encodedSongName.replace(/%20/g, ' ').replace('.mp3', '');
        const songPart = songN.split("%26");
        let songName = songPart[0];
        let singerName = decodeURIComponent(songPart[1]);
        
        document.querySelector("#currSongName").innerText = songName;
        document.querySelector("#currSongSinger").innerText = singerName;
        let imgURL = `./songs/${playlistName}/${songName.replaceAll(" ","_")}.jpeg`;
        document.querySelector(".currSongimg").src = imgURL;
        playimg.src = "./SVG/pause.svg";
    }    
};

for(e of displayPlaylist){
    let playlistName = e.parentElement.innerText;
    let playimg  = playbtn.querySelector("img");
    let img = e.querySelector("img");
    img.addEventListener("click", (evt) => {
        songNumber = 0;
        let playIcon = evt.target.src.split("/").pop();
        if(playIcon == "play.svg"){
            evt.target.parentElement.parentElement.style.backgroundColor = "#504545";
            evt.target.src = "./SVG/pause.svg";
            // console.log(evt.target.src);
            if(currSong.src === ""){
                temp = evt.target.parentElement.parentElement;
                temp.querySelector(".playimg").classList.add("hover-prop");
                playAudio(playimg, playlistName, songNumber);
            }
            else{
                if(temp.innerText === evt.target.parentElement.parentElement.innerText && currSong.paused){
                    currSong.play();
                }
                else{
                    playAudio(playimg, playlistName, songNumber);
                    temp.querySelector(".playimg").querySelector("img").src = "./SVG/play.svg";
                    temp.style.backgroundColor = "#332726";
                    temp.querySelector(".playimg").classList.remove("hover-prop");
                    temp = evt.target.parentElement.parentElement;
                    temp.querySelector(".playimg").classList.add("hover-prop");
                }
                playimg.src = "./SVG/pause.svg";
            }
        }
        else{
            evt.target.src = "./SVG/play.svg";
            currSong.pause();
            playimg.src = "./SVG/play.svg";
        }
    });
}

for(e of block){
    let playlistName = e.querySelector("h3").innerText;
    let playimg  = playbtn.querySelector("img");
e.addEventListener("click", (e) => {
    songNumber = 0;
    playAudio(playimg, playlistName, songNumber);
    updatePlaylist(e.target);
});
}

let updatePlaylist = (e) => {
    for(evt of displayPlaylist){
        if(evt.parentElement.innerText == e.querySelector(".block-text").querySelector("h3").innerHTML){
            evt.parentElement.querySelector(".playimg").classList.add("hover-prop");
            evt.parentElement.querySelector(".playimg").querySelector("img").src = "./SVG/pause.svg";
            evt.parentElement.style.backgroundColor = "#504545";
            temp = evt.parentElement;
        }
        else{
            evt.parentElement.style.backgroundColor = "#332726";
            evt.parentElement.querySelector(".playimg").querySelector("img").src = "./SVG/play.svg";
            evt.parentElement.querySelector(".playimg").classList.remove("hover-prop");
        }
    }
};

nextSong.addEventListener("click", () => {
    let playimg  = playbtn.querySelector("img");
    const parts = currSong.src.split('/');
    const encodedSongName = parts[parts.length - 2];
    const playlistName = decodeURIComponent(encodedSongName);
    if(songNumber+1 < songs.length && currSong.src != ""){
        songNumber += 1;
        playAudio(playimg,playlistName,songNumber);
    }
    else if(songNumber + 1 == songs.length && currSong.src != ""){
        songNumber = 0;
        playAudio(playimg,playlistName,songNumber);
    }
});

prevSong.addEventListener("click", () => {
    const parts = currSong.src.split('/');
    const encodedSongName = parts[parts.length - 2];
    const playlistName = decodeURIComponent(encodedSongName);
    let playimg  = playbtn.querySelector("img");
    if(songNumber-1 >= 0 && currSong.src != ""){
        songNumber -= 1;
        playAudio(playimg,playlistName,songNumber);
    }
    else if(songNumber - 1 < 0 && currSong.src != ""){
        songNumber = songs.length - 1;
        playAudio(playimg,playlistName,songNumber);
    }
});


playbtn.addEventListener("click", () => {
    let playimg  = playbtn.querySelector("img");
    let playIcon = playimg.src.split("/").pop();
    if(playIcon === "play.svg"){
        if(currSong.src === ""){
        }
        else{
            currSong.play();
            playimg.src = "./SVG/pause.svg";
            for(evt of displayPlaylist){
                if(evt.classList.contains("hover-prop")){
                    evt.querySelector("img").src = "./SVG/pause.svg";
                }
            }
        }
    }
    else{
        currSong.pause();
        playimg.src = "./SVG/play.svg";
        for(evt of displayPlaylist){
            if(evt.classList.contains("hover-prop")){
                evt.querySelector("img").src = "./SVG/play.svg";
            }
        }
    }
});

currSong.addEventListener('timeupdate', () => {
    document.querySelector("#songDuration").innerHTML =secondsToMinutes(Math.floor(currSong.duration));
    document.querySelector("#songTrack").innerHTML = secondsToMinutes(Math.floor(currSong.currentTime));
    progress.max = currSong.duration;
    progress.value = currSong.currentTime;
});

progress.oninput = () => {
    if(currSong.src === ""){
        progress.value = 0;
    }
    currSong.currentTime = progress.value;
}

document.querySelector("#shuffle").addEventListener("click" , () => {
    let shuffle = document.querySelector("#shuffle");
    if (shuffle.classList.contains("green-filter")) {
        shuffle.classList.remove("green-filter");
        shuffle.classList.add("invert");
    } else {
        shuffle.classList.add("green-filter");
        shuffle.classList.remove("invert");
    }
});

document.querySelector("#loop").addEventListener("click" , () => {
    let loop = document.querySelector("#loop");
    if (loop.classList.contains("green-filter")) {
        loop.classList.remove("green-filter");
        loop.classList.add("invert");
    } else {
        loop.classList.add("green-filter");
        loop.classList.remove("invert");
    }
});

volume.oninput = () => {
    if(volume.value == 0){
        document.querySelector("#mute").src = "./SVG/mute.svg";
    }
    else{
        document.querySelector("#mute").src = "./SVG/volume.svg"
    }
    currSong.volume = volume.value / 100;
}

document.querySelector("#mute").addEventListener("click", (evt) => {
    if(evt.target.src == "./SVG/volume.svg"){
        volume.value = 0;
        currSong.volume = 0;
        evt.target.src = "./SVG/mute.svg"
    }
    else{
        volume.value = 100;
        currSong.volume = 1;
        evt.target.src = "./SVG/volume.svg"
    }
});

document.querySelector(".favourite").addEventListener("click", (evt) => {
    if(evt.target.classList.contains("invert")){
        evt.target.classList.remove("invert");
        evt.target.src = "SVG/greenHeart.svg";
        setTimeout(function() {
            evt.target.classList.add('shake');
        }, 10);
        evt.target.classList.remove('shake');
    }
    else{
        evt.target.classList.add("invert");
        evt.target.src = "SVG/favourite.svg";
        setTimeout(function() {
            evt.target.classList.add('shake');
        }, 10);
        evt.target.classList.remove('shake');
    }
});

document.querySelector(".slider").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0px";
});

document.querySelector("#slideBack").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-430px";
});
