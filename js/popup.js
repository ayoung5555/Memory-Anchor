// popup.js
//document.getElementById('startTask').addEventListener('click', function () {
    // Handle START TASK button click
    // Add your logic here
//});

document.getElementById('recordTaskContainer').addEventListener('click', function () {
    document.getElementById('recordTaskModal').style.display = 'block';
});

document.querySelector('.close-button').addEventListener('click', function () {
    document.getElementById('recordTaskModal').style.display = 'none';
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

document.getElementById('helpButtonContainer').addEventListener('click', function () {
    alert('Press the "Record Task" button to record a message for future use. Press the green arrow button on an existing task to listen to an existing task.');
});
