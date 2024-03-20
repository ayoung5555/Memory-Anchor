
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

document.querySelectorAll('.info').forEach(button => {
    button.addEventListener('click', function() {

        const taskId = button.id.split('-')[2]; 
        const title = document.getElementById(`task${taskId}-title`).textContent;
        
        let description;
        if (title === "Sign In") {
            description = "Click the sign in button in the top right corner. Select the blue log in button";
        } else if (title === "Student Business") {
            description = "Click the search bar at the top of the screen and type student business in the search bar. Then click the rectangular tile that has student business on it";
        } else if (title === "Payroll and Compensation") {
            description = "Click the square that says payroll and compensation. It is on the left side and the second tile from the top of the screen. Select payroll and compensation on the left sidebar, and click view paycheck";
        } else {
            description = `Description for ${title}`;
        }
        
        const website = `https://wolverineaccess.umich.edu/`;
        
        document.getElementById('infoTitle').textContent = title;
        document.getElementById('infoDescription').textContent = description;
        document.getElementById('infoWebLink').href = website;
        document.getElementById('infoWebLink').textContent = website;
        
        document.getElementById('infoModal').style.display = 'block';
    });
});

document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('infoModal').style.display = 'none';
});


