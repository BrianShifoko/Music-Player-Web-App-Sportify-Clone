document.addEventListener('DOMContentLoaded', () => {
    // Handle playlist creation
    const createPlaylistBtn = document.getElementById('create-playlist-btn');
    const createPlaylistModal = document.getElementById('create-playlist-modal');
    const closeCreatePlaylistModal = createPlaylistModal.querySelector('.close');
    const createPlaylistNameInput = document.getElementById('playlist-name-input');
    const createPlaylist = document.getElementById('create-playlist');
    const dynamicPlaylists = document.getElementById('dynamic-playlists');
    const availableSongs = document.getElementById('available-songs');
    const playlistSongs = document.getElementById('playlist-songs');
    const progressBar = document.getElementById('progress-bar'); 
    const currentTime = document.getElementById('current-time'); 
    const duration = document.getElementById('duration'); 

    let audio = new Audio();
    let isPlaying = false;
    let currentSongIndex = 0;
    const songList = [
        { title: 'Dream Girl Remix  ', url: 'audio/ Ir Sais Rauw Alejandro  Dream Girl Remix  Official Video.mp3' },
        { title: ' Loco Remix ', url: 'audio/ Loco Remix  Beéle x Farruko x Natti Natasha x Manuel Turizo.mp3' },
        { title: 'Shaky Shaky ', url: 'audio/ Daddy Yankee  Shaky Shaky Video Oficial.mp3' },
        { title: 'Dura ', url: 'audio/Daddy Yankee  Dura Video Oficial.mp3' },
        { title: 'Beamer Bad Boys', url: 'audio/Rema x Rvssian  Beamer Bad Boys Official Music Video.mp3' },
        { title: 'OMI  Cheerleader', url: 'audio/ OMI  Cheerleader Felix Jaehn Remix Official Video Ultra Records.mp3' },
    ];

    // Load available songs
    songList.forEach((song, index) => {
        const songItem = document.createElement('li');
        songItem.textContent = song.title;
        songItem.dataset.index = index;
        songItem.classList.add('song-item');
        availableSongs.appendChild(songItem);
    });

    // Handle adding songs to the playlist
    availableSongs.addEventListener('click', (event) => {
        if (event.target.classList.contains('song-item')) {
            const songIndex = event.target.dataset.index;
            const song = songList[songIndex];
            const playlistSongItem = document.createElement('div');
            playlistSongItem.classList.add('playlist-song');
            playlistSongItem.textContent = song.title;
            playlistSongItem.dataset.index = songIndex;
            playlistSongs.appendChild(playlistSongItem);
        }
    });

    createPlaylistBtn.addEventListener('click', () => {
        createPlaylistModal.style.display = 'block';
    });
    
    closeCreatePlaylistModal.addEventListener('click', () => {
        createPlaylistModal.style.display = 'none';
    });

    createPlaylist.addEventListener('click', () => {
        const playlistName = createPlaylistNameInput.value.trim();
        if (playlistName) {
            const listItem = document.createElement('li');
            listItem.classList.add('playlist-item');
            listItem.innerHTML = `
                <div class="playlist-content">
                    <h3>${playlistName}</h3>
                    <button class="delete-playlist"><i class="fas fa-trash-alt"></i></button>
                </div>
            `;
            dynamicPlaylists.appendChild(listItem);
            createPlaylistNameInput.value = '';
            createPlaylistModal.style.display = 'none';
        }
    });

    dynamicPlaylists.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-playlist') || event.target.closest('.delete-playlist')) {
            const listItem = event.target.closest('.playlist-item');
            dynamicPlaylists.removeChild(listItem);
        }
    });

    window.addEventListener('click', (event) => {
        if (event.target === createPlaylistModal) {
            createPlaylistModal.style.display = 'none';
        }
    });

     // Update progress bar as song plays
     audio.addEventListener('timeupdate', () => {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progressPercent;
        currentTime.textContent = formatTime(audio.currentTime);
        duration.textContent = formatTime(audio.duration);
    });

     // Handle seeking in the song when user interacts with the progress bar
     progressBar.addEventListener('input', () => {
        const seekTime = (progressBar.value / 100) * audio.duration;
        audio.currentTime = seekTime;
    });

    // Format time in MM:SS format
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    // Handle song playback
    playlistSongs.addEventListener('click', (event) => {
        if (event.target.classList.contains('playlist-song')) {
            currentSongIndex = event.target.dataset.index;
            playSong();
        }
    });

    const playBtn = document.getElementById('play');
    const nextBtn = document.getElementById('next');
    const prevBtn = document.getElementById('prev');
    const shuffleBtn = document.getElementById('shuffle');
    const repeatBtn = document.getElementById('repeat');

    const playSong = () => {
        audio.src = songList[currentSongIndex].url;
        audio.play();
        isPlaying = true;
        playBtn.querySelector('i').classList.remove('fa-play');
        playBtn.querySelector('i').classList.add('fa-pause');
        document.querySelector('.now-playing span').textContent = `Now Playing: ${songList[currentSongIndex].title}`;
    };

    const pauseSong = () => {
        audio.pause();
        isPlaying = false;
        playBtn.querySelector('i').classList.remove('fa-pause');
        playBtn.querySelector('i').classList.add('fa-play');
    };

    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    });

    nextBtn.addEventListener('click', () => {
        currentSongIndex = (currentSongIndex + 1) % songList.length;
        playSong();
    });

    prevBtn.addEventListener('click', () => {
        currentSongIndex = (currentSongIndex - 1 + songList.length) % songList.length;
        playSong();
    });

    shuffleBtn.addEventListener('click', () => {
        shuffleBtn.classList.toggle('active');
    });

    repeatBtn.addEventListener('click', () => {
        audio.loop = !audio.loop; 
        repeatBtn.classList.toggle('active'); 
    });

    // Handle volume control
    const volumeBar = document.getElementById('volume-bar');
    const volumeLabel = document.getElementById('volume-label');
    
    volumeBar.addEventListener('input', () => {
        audio.volume = volumeBar.value / 100;
        volumeLabel.textContent = `Volume: ${volumeBar.value}%`;
    });

    // Handle follow button with animation and icon change
    const followBtn = document.querySelector('.follow-btn');
    followBtn.addEventListener('click', () => {
        followBtn.classList.toggle('followed');
        if (followBtn.classList.contains('followed')) {
            followBtn.innerHTML = '<i class="fas fa-check"></i> Followed';
            followBtn.style.backgroundColor = '#1db954'; // Green background
        } else {
            followBtn.innerHTML = '<i class="fas fa-user-plus"></i> Follow';
            followBtn.style.backgroundColor = ''; // Reset background
        }
    });

    // Handle like button
    const likeBtn = document.querySelector('.like-btn');
    likeBtn.addEventListener('click', () => {
        likeBtn.classList.toggle('liked');
    });
});
