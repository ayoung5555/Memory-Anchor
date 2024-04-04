let mediaRecorder;
let audioChunks = [];
let db;

function initDb() {
    // open db and if it does not exist, then create one
    const request = indexedDB.open('recordedTasksDB', 1);

    request.onupgradeneeded = function(event) {
        db = event.target.result;
        if (!db.objectStoreNames.contains('recordedTasks')) {
            db.createObjectStore('recordedTasks', { keyPath: 'id', autoIncrement: true });
            // sleep
            objectStore.transaction.oncomplete = (event) => {};
        }
    };

    request.onsuccess = function(event) {
        db = event.target.result;
        console.log('line20')
        updateStartTaskTab();
        console.log('line22')
    };

    request.onerror = function(event) {
        console.error('IndexedDB error:', event.target.errorCode);
    };
}

// Call the init function to start the database initialization
initDb();

document.getElementById('helpMessage').style.display = 'block';

document.getElementById('startTaskContainer').addEventListener('click', function () {
    document.getElementById('helpMessage').style.display = 'none';
    document.getElementById('recordTask').style.display = 'none';
    document.getElementById('taskStartSection').style.display = 'block';
    console.log('line39')
    updateStartTaskTab();
    console.log('line41')
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

function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            options = { mimeType: 'audio/mp4', audioBitsPerSecond: 96000};
            mediaRecorder = new MediaRecorder(stream, options);
            mediaRecorder.onstart = () => {
                audioChunks = [];
                document.getElementById('recordingStatus').innerText = 'Recording...';
                document.getElementById('stopRecording').disabled = false;
            };
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { 'type' : 'audio/mp4' });
                // const audioUrl = URL.createObjectURL(audioBlob);
                saveTaskDetails(audioBlob);
            };
            mediaRecorder.start();
            document.getElementById('startRecording').disabled = true;
        })
        .catch(error => console.error(error));
}

document.getElementById('startRecording').addEventListener('click', startRecording);



document.getElementById('stopRecording').addEventListener('click', function () {
    mediaRecorder.stop();
    document.getElementById('recordingStatus').innerText = 'Not Recording';
    this.disabled = true;
    document.getElementById('startRecording').disabled = false;
});

// Function to save task details to IndexedDB
function saveTaskDetails(audioBlob) {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const website = document.getElementById('taskWebsite').value;

    const transaction = db.transaction(['recordedTasks'], 'readwrite');
    const store = transaction.objectStore('recordedTasks');
    const task = { title, description, website, audioBlob };
    
    let id = store.add(task);

    transaction.oncomplete = (event) => {
        console.log('Task saved successfully:', id);
    };

    transaction.onerror = (event) => {
        console.error('Task save error:', event.target.errorCode);
    };
    
    updateStartTaskTab();
    
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDescription').value = '';
    document.getElementById('taskWebsite').value = '';
}

function bindInfoButtons() {
    document.querySelectorAll('.info').forEach(button => {
        button.removeEventListener('click', infoButtonHandler);
        button.addEventListener('click', infoButtonHandler);
    });
}

function infoButtonHandler() {
    const button = this;
    const taskId = Number(button.id.split('-')[2]);
      
    const transaction = db.transaction(['recordedTasks'], 'readonly');
    const store = transaction.objectStore('recordedTasks');
    
    let request = store.get(taskId);
    
    request.onsuccess = function(event) {
        const task = event.target.result;
      
        if (task) {
            document.getElementById('infoTitle').textContent = task.title ? task.title : 'No title provided';
            document.getElementById('infoDescription').textContent = task.description ? task.description : 'No description provided';
            document.getElementById('infoWebLink').href = task.website ? task.website : 'https://www.google.com';
            document.getElementById('infoWebLink').textContent = task.website ? task.website : 'Sample website link';
        }
    };
    
    document.getElementById('infoModal').style.display = 'block';

    request.onerror = (event) => {
        console.error('Task retrieval error:', event.target.errorCode);
    }
}

bindInfoButtons();

document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('infoModal').style.display = 'none';
});

function updateStartTaskTab() {
    console.log('hi')
    console.log(db)
    const store = db.transaction('recordedTasks', 'readonly').objectStore('recordedTasks');
    const request = store.openCursor();
    const taskStartSection = document.getElementById('taskStartSection');
    const fragment = document.createDocumentFragment();

    request.onsuccess = function(event) {
        let index = 0;
        const cursor = event.target.result;
        if (cursor) {
            const task = cursor.value;
            const taskItem = document.createElement('ul');
            taskItem.classList.add('task-item');
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
            fragment.appendChild(taskItem);
            index++;
            cursor.continue();
        } else {
            taskStartSection.appendChild(fragment);
            bindDeleteButtons();
            bindInfoButtons();
            bindStartButtons();
            adjustTaskSectionHeight();
        }
    };

    request.onerror = function(event) {
        console.error('Task retrieval error:', event.target.errorCode);
    }
}

function deleteButtonHandler() {
    const button = this;
    const taskId = Number(button.id.split('-')[2]);
      
    const transaction = db.transaction(['recordedTasks'], 'readwrite');
    const store = transaction.objectStore('recordedTasks');
    
    if (confirm(`Are you sure you want to delete the task "${store.get(taskId).title}"?`)) {
        store.delete(taskId);
        updateStartTaskTab();
    }

}

function adjustTaskSectionHeight() {
    const offsetTop = document.querySelector('.navbar').offsetHeight + document.querySelector('#header-bg').offsetHeight;
    const taskStartSection = document.getElementById('taskStartSection');
    taskStartSection.style.maxHeight = `calc(100vh - ${offsetTop}px)`;
}

function bindStartButtons() {
    document.querySelectorAll('.start').forEach(button => {
        button.removeEventListener('click', startButtonHandler);
        button.addEventListener('click', startButtonHandler);
    });
}

function bindDeleteButtons() {
    document.querySelectorAll('.delete').forEach(button => {
        button.removeEventListener('click', deleteButtonHandler);
        button.addEventListener('click', deleteButtonHandler);
    });
}

function startButtonHandler() {
    const button = this;
    const taskId = Number(button.id.split('-')[2]);

    const transaction = db.transaction(['recordedTasks'], 'readonly');
    const store = transaction.objectStore('recordedTasks');
    
    let request = store.get(taskId);

    request.onsuccess = function(event) {
        const task = event.target.result;
      
        if (task) {
            const audio = new Audio(task.audioBlob);
            audio.play().catch(error => console.error("Playback failed", error));
        }
    };
}

// document.addEventListener('DOMContentLoaded', updateStartTaskTab);
document.addEventListener('DOMContentLoaded', adjustTaskSectionHeight);