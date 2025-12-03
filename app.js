let currentIndex = 0;

const music = document.querySelector('#audio');

const seekBar = document.querySelector('.seek-bar');
const songName = document.querySelector('.music-name');
const artistName = document.querySelector('.artist-name');
const cover = document.querySelector('.cover');
const currentTime = document.querySelector('.current-time');
const musicDuration = document.querySelector('.song-duration');
const rightSpace = document.querySelector('.right-space');
const nextList = document.querySelector('.nextListHolder');
const ul = nextList.querySelector('ul');
const songCard = document.querySelector('.song-card');

const playBtn = document.querySelector('.play-btn');
const playBtnIcon = playBtn.querySelector('i');
const forwardBtn = document.querySelector('.forward-btn');
const backwardBtn = document.querySelector('.backward-btn');

const volumeBar = document.querySelector('.volume-bar');
const currentVolume = document.querySelector('.current-volume');
const volumeBtn = document.querySelector('.volume-btn');
const volumeBtnIcon = volumeBtn.querySelector('i');

const shuffleBtn = document.querySelector('.shuffle-btn');
const shuffleBtnIcon = shuffleBtn.querySelector('i');
const loopBtn = document.querySelector('.loop-btn');
const loopBtnIcon = loopBtn.querySelector('i');
const nextListBtn = document.querySelector('.nextList-btn');
const nextListBtnIcon = nextListBtn.querySelector('i');
const infoBtn = document.querySelector('.info-btn');
const infoBtnIcon = infoBtn.querySelector('i');
const infoWindow = document.querySelector('.info-window');

let songsList = [];
let isSeekActive = false;
let isVolumeSeekActive = false, isMute = false;
let isShuffle = false, isLoop = false, isNextList = false, isInfo = false;


music.addEventListener('pause', () => {
    if (playBtnIcon.classList.contains('fa-pause')) {
        playBtnIcon.classList.remove('fa-pause');
        playBtnIcon.classList.add('fa-play');
    }
});

music.addEventListener('play', () => {
    if (playBtnIcon.classList.contains('fa-play')) {
        playBtnIcon.classList.remove('fa-play');
        playBtnIcon.classList.add('fa-pause');
    }
});


songName.addEventListener('scroll', () => {
    songName.style.textOverflow = "clip";
})

artistName.addEventListener('scroll', () => {
    artistName.style.textOverflow = "clip";
})

playBtn.addEventListener('click', () => {
    if(playBtn.className.includes('pause'))
        music.play();
    else
        music.pause();

    playBtn.classList.toggle('pause');
})

// setup music

function updateSongIndicator() {
    let hoverToRemove = document.querySelector('.card-playing');
    if (hoverToRemove)
        hoverToRemove.classList.remove('card-playing');

    const nextListSongs = nextList.querySelectorAll('li');
    const targetSong = nextListSongs[currentIndex];
    const targetBtn = targetSong.querySelector('button');
    targetBtn.classList.add('card-playing');
}

const setMusic = (i) => {
    seekBar.value = 0; // Sets range slider value to 0
    let song = songs[i];
    music.src = song.path;

    songName.innerHTML = song.name;
    songName.style.textOverflow = "ellipsis";
    artistName.innerHTML = song.artist;
    artistName.style.textOverflow = "ellipsis";
    cover.style.backgroundImage = `url('${song.cover}')`;
    rightSpace.style.backgroundImage = `url('${song.background}')`;

    currentTime.innerHTML = '00 : 00';
    updateSongIndicator();
    
}

music.addEventListener('loadedmetadata', () => {
    seekBar.max = music.duration;
    musicDuration.innerHTML = formatTime(music.duration);
});


// Formatting time in min and seconds

const formatTime = (time) => {
    let min = Math.floor(time / 60);
    if(min < 10){
        min = `0${min}`; // 0 to the front if its a time less than one minute
    }
    let sec = Math.floor(time % 60);
    if (sec < 10){
        sec = `0${sec}`;
    }
    return `${min} : ${sec}`; // Final format
}

// Seek bar
setInterval(() => {
    if (!isSeekActive) {
        seekBar.value = music.currentTime;
        currentTime.innerHTML = formatTime(music.currentTime);
        if(Math.floor(music.currentTime) >= Math.floor(seekBar.max)) {
            if (!isLoop)
                forwardBtn.click();
            else {
                setMusic(songsList[currentIndex]);
                playMusic();
            }
                
        }
    } else {
        if(Math.floor(music.currentTime) >= Math.floor(seekBar.max)) {
            if(!playBtn.className.includes('pause')){
                playBtn.classList.toggle('pause');
            }
        }
    }
    if (isMute && !isVolumeSeekActive)
        currentVolume.innerHTML = "MUTED";
    else
        currentVolume.innerHTML = formatVolume(volumeBar.value);
        
}, 500)

// For changing position in seekBar 
seekBar.addEventListener('change', () => {
    isSeekActive = false;
    music.currentTime = seekBar.value;
})

seekBar.oninput = function() {
    isSeekActive = true;
    currentTime.innerHTML = formatTime(seekBar.value);
};

const playMusic = () => {
    music.play();
    if(playBtn.className.includes('pause')){
        playBtn.classList.toggle('pause');
    }
}

//Forward and backward button
forwardBtn.addEventListener('click', () => {
    if (playBtnIcon.classList.contains('fa-play')) {
        playBtnIcon.classList.remove('fa-play');
        playBtnIcon.classList.add('fa-pause');
    }

    if(currentIndex >= songs.length - 1)
        currentIndex = 0;
    else
        currentIndex++;
    
    setMusic(songsList[currentIndex]);
    playMusic();
})

backwardBtn.addEventListener('click', () => {
    if (playBtnIcon.classList.contains('fa-play')) {
        playBtnIcon.classList.remove('fa-play');
        playBtnIcon.classList.add('fa-pause');
    }

    if(currentIndex <= 0)
        currentIndex = songs.length - 1;
    else
        currentIndex--;

    setMusic(songsList[currentIndex]);
    playMusic();
})

function initializeSongs() {
    if (songsList.length == 0) {
        for (let i = 0; i < songs.length; ++i) {
            songsList.push(i);
        }
    } else {
        for (let i = 0; i < songs.length; ++i) {
            songsList[i] = i;
        }
    }
}

function arrangeNextList() {
    if (ul.childElementCount !== 0)
    {
        ul.innerHTML = "";
    }
    
    for (let i = 0; i < songsList.length; ++i)
    {
        const li = document.createElement('li');

        const songCard = document.createElement('button');
        songCard.classList.add('song-card');
        
        songCard.addEventListener('click', () => {
            currentIndex = i;
            setMusic(songsList[i]);
            playMusic();
            updateSongIndicator();
        });

        // ----- song-card child elements -----
        const cardCover = document.createElement('span');
        cardCover.classList.add('card-cover');
        cardCover.style.backgroundImage = `url('${songs[songsList[i]].cover}')`;

        const cardSong = document.createElement('span');
        cardSong.classList.add('card-song');
        cardSong.innerHTML = songs[songsList[i]].name;

        const cardArtist = document.createElement('span');
        cardArtist.classList.add('card-artist');
        cardArtist.innerHTML = songs[songsList[i]].artist;

        songCard.appendChild(cardCover);
        songCard.appendChild(cardSong);
        songCard.appendChild(cardArtist);
        // ------------------------------------
        li.appendChild(songCard);
        ul.appendChild(li);

        
        
    }
}

// Sets initial music volume to 50%
window.onload = function() {
    music.volume = 0.5;
    initializeSongs();
    arrangeNextList();
    setMusic(0);
};

const formatVolume = (volume) => {
    let formatVolume = Math.floor(volume);
    return `${formatVolume}%`; // Final format
}

// For changing volume via volumeBar

volumeBar.addEventListener('change', () => {
    isVolumeSeekActive = false;
    currentVolume.innerHTML = formatVolume(volumeBar.value);
    if (!isMute)
        music.volume = volumeBar.value / 100;
})

volumeBar.oninput = function() {
    isVolumeSeekActive = true;
    currentVolume.innerHTML = formatVolume(volumeBar.value);
    if (!isMute)
        music.volume = volumeBar.value / 100;
};


volumeBtn.addEventListener('click', () => {
    if (volumeBtnIcon.classList.contains('fa-volume-up')) {
        volumeBtnIcon.classList.remove('fa-volume-up');
        volumeBtnIcon.classList.add('fa-volume-xmark');
        volumeBtnIcon.style.color = 'rgb(158, 141, 162)';
    } else {
        volumeBtnIcon.classList.remove('fa-volume-xmark');
        volumeBtnIcon.classList.add('fa-volume-up');
        volumeBtnIcon.style.color = 'rgb(240, 20, 192)';
    }

    if (!isMute)
    {
        isMute = true;
        music.volume = 0;
    }
        
    else {
        isMute = false;
        music.volume = volumeBar.value / 100;
    }
        
})

function shuffleSongs() {
    // Swap current index with the first index, placing it at the beginning of the array
    // Guaranteed that the array is ordered like: 0, 1, 2, ...
    if (currentIndex != 0) {
        songsList[0] = currentIndex;
        songsList[currentIndex] = 0;
        currentIndex = 0;
    }

    let n = currentIndex;
    let index = songsList.length;
    let randomIndex;

    // Fisher-Yates Shuffle (pasted from a Stack Overflow post)
    while(--index > 0){
        randomIndex = Math.floor(Math.random()*(index-1) + 1); // from 1 (inclusive) to index (exclusive)
        temp = songsList[randomIndex];
        songsList[randomIndex] = songsList[index];
        songsList[index] = temp;
    }
}

shuffleBtn.addEventListener('click', () => {
    if(isShuffle) {
        isShuffle = false;
        currentIndex = songsList[currentIndex];
        initializeSongs();
        shuffleBtnIcon.style.color = 'rgb(158, 141, 162)';
    } else {
        isShuffle = true;
        shuffleSongs();
        shuffleBtnIcon.style.color = 'rgb(240, 20, 192)';
    }
    arrangeNextList()
    updateSongIndicator();
})

loopBtn.addEventListener('click', () => {
    if(isLoop) {
        isLoop = false;
        loopBtnIcon.style.color = 'rgb(158, 141, 162)';
    } else {
        isLoop = true;
        loopBtnIcon.style.color = 'rgb(240, 20, 192)';
    } 
})

nextListBtn.addEventListener('click', () => {
    if(isNextList) {
        isNextList = false;
        nextList.classList.add('hidden');
        nextListBtnIcon.style.color = 'rgb(158, 141, 162)';
    } else {
        isNextList = true;
        nextList.classList.remove('hidden');
        nextListBtnIcon.style.color = 'rgb(240, 20, 192)';
    } 
})

infoBtn.addEventListener('click', () => {
    if(isInfo) {
        isInfo = false;
        infoWindow.classList.add('hidden');
        infoBtnIcon.style.color = 'rgb(158, 141, 162)';
    } else {
        isInfo = true;
        infoWindow.classList.remove('hidden');
        infoBtnIcon.style.color = 'rgb(240, 20, 192)';
    } 
})