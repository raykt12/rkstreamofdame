document.getElementById('videoUpload').addEventListener('change', function(event) {
    const videoFile = event.target.files[0];
    const videoPlayer = document.getElementById('videoPlayer');

    if (videoFile) {
        const fileURL = URL.createObjectURL(videoFile);
        videoPlayer.src = fileURL;
        videoPlayer.style.display = 'block';
        videoPlayer.play();
    }
});
