
document.getElementById('helpMessage').style.display = 'block';

document.getElementById('startTaskContainer').addEventListener('click', function () {
    // Hide other sections
    document.getElementById('helpMessage').style.display = 'none';
    document.getElementById('recordTask').style.display = 'none';
    // Show the start task section
    document.getElementById('taskStartSection').style.display = 'block';
});

document.getElementById('recordTaskContainer').addEventListener('click', function () {
    // Hide other sections
    document.getElementById('helpMessage').style.display = 'none';
    document.getElementById('taskStartSection').style.display = 'none';
    // Show the record task section
    document.getElementById('recordTask').style.display = 'block';
});

document.getElementById('helpButtonContainer').addEventListener('click', function () {
    // Hide other sections
    document.getElementById('recordTask').style.display = 'none';
    document.getElementById('taskStartSection').style.display = 'none';
    // Show the help message section
    document.getElementById('helpMessage').style.display = 'block';
});

document.getElementById('startRecording').addEventListener('click', function () {
    document.getElementById('recordingStatus').innerText = 'Recording...';
    this.disabled = true;
    document.getElementById('stopRecording').disabled = false;
});

document.getElementById('stopRecording').addEventListener('click', function () {
    document.getElementById('recordingStatus').innerText = 'Not Recording';
    this.disabled = true;
    document.getElementById('startRecording').disabled = false;
});

document.getElementById('info-button').addEventListener('click', function() {
    const title = document.querySelector('.edit-text2').textContent;
    
    const description = 'Click the "Sign In" button in the top right corner';
    const website = 'https://wolverineaccess.umich.edu/';
    
    document.getElementById('infoTitle').textContent = title;
    document.getElementById('infoDescription').textContent = description;
    document.getElementById('infoWebLink').href = website;
    document.getElementById('infoWebLink').textContent = website;
    
    document.getElementById('infoModal').style.display = 'block';
});

document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('infoModal').style.display = 'none';
});


