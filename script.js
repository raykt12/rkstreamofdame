const videoUpload = document.getElementById('videoUpload');
const videoPlayer = document.getElementById('videoPlayer');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const connectBtn = document.getElementById('connectBtn');
const peerIdInput = document.getElementById('peerId');

const peer = new Peer();

peer.on('open', (id) => {
    console.log('My peer ID is: ' + id);
});

peer.on('connection', (conn) => {
    conn.on('data', (data) => {
        if (data.type === 'play') {
            videoPlayer.play();
        } else if (data.type === 'pause') {
            videoPlayer.pause();
        } else if (data.type === 'timeUpdate') {
            videoPlayer.currentTime = data.time;
        }
    });
});

videoUpload.addEventListener('change', async (event) => {
    const videoFile = event.target.files[0];
    if (videoFile) {
        const fileURL = URL.createObjectURL(videoFile);
        videoPlayer.src = fileURL;
        videoPlayer.style.display = 'block';
        videoPlayer.play();
    }
});

playBtn.addEventListener('click', () => {
    videoPlayer.play();
    sendAction('play');
});

pauseBtn.addEventListener('click', () => {
    videoPlayer.pause();
    sendAction('pause');
});

videoPlayer.addEventListener('timeupdate', () => {
    sendAction('timeUpdate', videoPlayer.currentTime);
});

connectBtn.addEventListener('click', () => {
    const peerId = peerIdInput.value;
    const conn = peer.connect(peerId);
    
    conn.on('open', () => {
        console.log('Connected to ' + peerId);
    });
});

function sendAction(type, time) {
    const data = { type };
    if (time !== undefined) data.time = time;

    peer.connections.forEach((conn) => {
        conn.forEach((c) => {
            c.send(data);
        });
    });
}
