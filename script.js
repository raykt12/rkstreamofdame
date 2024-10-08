const socket = io();
const videoUpload = document.getElementById('videoUpload');
const videoPlayer = document.getElementById('videoPlayer');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');

videoUpload.addEventListener('change', async (event) => {
    const videoFile = event.target.files[0];
    if (videoFile) {
        const formData = new FormData();
        formData.append('video', videoFile);

        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        videoPlayer.src = data.videoPath;
        videoPlayer.style.display = 'block';
        videoPlayer.play();
        socket.emit('play');
    }
});

playBtn.addEventListener('click', () => {
    videoPlayer.play();
    socket.emit('play');
});

pauseBtn.addEventListener('click', () => {
    videoPlayer.pause();
    socket.emit('pause');
});

videoPlayer.addEventListener('timeupdate', () => {
    socket.emit('timeUpdate', videoPlayer.currentTime);
});

// Synchronizing play and pause actions across clients
socket.on('play', () => {
    videoPlayer.play();
});

socket.on('pause', () => {
    videoPlayer.pause();
});

socket.on('timeUpdate', (time) => {
    videoPlayer.currentTime = time;
});
