document.getElementById('helpMessage').style.display = 'block';

document.getElementById('startTaskContainer').addEventListener('click', function () {
    document.getElementById('helpMessage').style.display = 'none';
    document.getElementById('recordTask').style.display = 'none';
    document.getElementById('taskStartSection').style.display = 'block';
});

document.getElementById('recordTaskContainer').addEventListener('click', function () {
    document.getElementById('helpMessage').style.display = 'none';
    document.getElementById('taskStartSection').style.display = 'none';
    document.getElementById('recordTask').style.display = 'block';
});

document.getElementById('helpButtonContainer').addEventListener('click', function () {
    document.getElementById('recordTask').style.display = 'none';
    document.getElementById('taskStartSection').style.display = 'none';
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

    saveTaskDetails();
});

function bindInfoButtons() {
    document.querySelectorAll('.info').forEach(button => {
        button.removeEventListener('click', infoButtonHandler); 
        button.addEventListener('click', infoButtonHandler);
    });
}

function infoButtonHandler() {
    const button = this;
    const taskId = button.id.split('-')[2]; 
    const tasks = JSON.parse(localStorage.getItem('recordedTasks')) || [];
    const task = tasks[taskId - 1]; 

    const title = task.title;
    const description = task.description || `Description for ${title}`;
    const website = task.website || 'https://example.com/';

    document.getElementById('infoTitle').textContent = title;
    document.getElementById('infoDescription').textContent = description;
    document.getElementById('infoWebLink').href = website;
    document.getElementById('infoWebLink').textContent = website;
    
    document.getElementById('infoModal').style.display = 'block';
}

bindInfoButtons();

document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('infoModal').style.display = 'none';
});

function saveTaskDetails() {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const website = document.getElementById('taskWebsite').value;

    const tasks = JSON.parse(localStorage.getItem('recordedTasks')) || [];
    tasks.push({ title, description, website });
    localStorage.setItem('recordedTasks', JSON.stringify(tasks));

    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDescription').value = '';
    document.getElementById('taskWebsite').value = '';

    updateStartTaskTab();
}

function bindDeleteButtons() {
    document.querySelectorAll('.editdelete').forEach(button => {
        button.removeEventListener('click', deleteButtonHandler); 
        button.addEventListener('click', deleteButtonHandler);
    });
}

function updateStartTaskTab() {
    const tasks = JSON.parse(localStorage.getItem('recordedTasks')) || [];
    const taskStartSection = document.getElementById('taskStartSection');
    taskStartSection.innerHTML = '';

    tasks.forEach((task, index) => {
        const taskItem = document.createElement('ul');
        taskItem.classList.add('line-item');
        taskItem.innerHTML = `
            <b class="edit-text2" id="task${index + 1}-title">${task.title}</b>
            <button class="start" id="start-button-${index + 1}">
                <img class="line-item-icon" alt="" src="./public/play-solid.svg" />
            </button>
            <button class="info" id="info-button-${index + 1}">
                <img class="line-item-icon" alt="" src="./public/info-solid.svg" />
            </button>
            <button class="editdelete" id="delete-button-${index + 1}">
                <img class="line-item-icon" alt="" src="./public/trash-regular.svg" />
            </button>
        `;
        taskStartSection.appendChild(taskItem);
    });

    bindInfoButtons();
    bindDeleteButtons();
    adjustTaskSectionHeight();
}


function deleteButtonHandler() {
    const button = this;
    const taskId = button.id.split('-')[2]; 
    let tasks = JSON.parse(localStorage.getItem('recordedTasks')) || [];
    
    if (tasks.length >= taskId && taskId > 0) {
        const task = tasks[taskId - 1]; 
        const taskTitle = task.title;

        if (confirm(`Are you sure you want to delete the task "${taskTitle}"?`)) {
            tasks = tasks.filter((_, index) => index !== (taskId - 1)); 
            localStorage.setItem('recordedTasks', JSON.stringify(tasks));

            updateStartTaskTab();
        }
    } else {
        console.log('Task ID is invalid or tasks array is empty.');
    }
}

function adjustTaskSectionHeight() {
    var offsetTop = document.querySelector('.navbar').offsetHeight + document.querySelector('#header-bg').offsetHeight;
    var taskStartSection = document.getElementById('taskStartSection');
    taskStartSection.style.maxHeight = `calc(100vh - ${offsetTop}px)`;
}

document.addEventListener('DOMContentLoaded', updateStartTaskTab);
document.addEventListener('DOMContentLoaded', adjustTaskSectionHeight);
