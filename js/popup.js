let mediaRecorder;
let audioChunks = [];
let db;
let ObjectURLstore = [];
let PlayedAudios = [];

function initDb() {
    // open db and if it does not exist, then create one
    const request = indexedDB.open('recordedTasksDB', 1);

    request.onupgradeneeded = function (event) {
        db = event.target.result;
        if (!db.objectStoreNames.contains('recordedTasks')) {
            db.createObjectStore('recordedTasks', { keyPath: 'id', autoIncrement: true });
        }
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        updateStartTaskTab();
    };

    request.onerror = function (event) {
        console.error('IndexedDB error:', event.target.errorCode);
        // note: if diagnosing db bugs, delete the db by running 
        // by going to dev console > applications > indexedDB > recordedTasksDB > right click > delete
    };
}

// Call the init function to start the database initialization
initDb();

document.getElementById('helpMessage').style.display = 'block';

document.getElementById('startTaskContainer').addEventListener('click', function () {
    document.getElementById('helpMessage').style.display = 'none';
    document.getElementById('recordTask').style.display = 'none';
    document.getElementById('taskStartSection').style.display = 'block';
    updateStartTaskTab();
});

document.getElementById('recordTaskContainer').addEventListener('click', function () {
    document.getElementById('helpMessage').style.display = 'none';
    document.getElementById('taskStartSection').style.display = 'none';
    document.getElementById('recordTask').style.display = 'block';
    // autofill the website field with the current tab's URL
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        let url = tabs[0].url;
        document.getElementById('taskWebsite').value = url;
    });
});

document.getElementById('helpButtonContainer').addEventListener('click', function () {
    document.getElementById('recordTask').style.display = 'none';
    document.getElementById('taskStartSection').style.display = 'none';
    document.getElementById('helpMessage').style.display = 'block';
});

function startRecording() {
    document.getElementById('addTask').disabled = true;
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            options = { audioBitsPerSecond: 96000 }; // save storage space and reduce latency
            mediaRecorder = new MediaRecorder(stream, options);
            mediaRecorder.onstart = () => {
                audioChunks = [];
                document.getElementById('recordingStatus').innerText = 'Recording...';
                document.getElementById('stopRecording').disabled = false;
                document.getElementById('addTask').disabled = true;
            };
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);

            };
            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { 'type': 'audio/ogg' });
                tempAudioBlob = audioBlob;
                document.getElementById('addTask').disabled = false;

            };
            mediaRecorder.start();
            document.getElementById('startRecording').disabled = true;
            // document.getElementById('addTask').disabled = false;
        })
        .catch(error => console.error(error));
}

document.getElementById('startRecording').addEventListener('click', () => {
    this.disabled = true;
    document.getElementById('startRecording').setAttribute('style', 'display: none;');
    document.getElementById('stopRecording').setAttribute('style', 'display: inline;');
    startRecording();
}
);

document.getElementById('stopRecording').addEventListener('click', function () {
    mediaRecorder.stop();
    document.getElementById('recordingStatus').innerText = 'Not Recording';

    this.disabled = true;
    document.getElementById('stopRecording').setAttribute('style', 'display: none;');
    document.getElementById('startRecording').disabled = false;
    document.getElementById('startRecording').setAttribute('style', 'display: inline;');
});

function bindInfoButtons() {
    document.querySelectorAll('.info').forEach(button => {
        button.removeEventListener('click', infoButtonHandler);
        button.addEventListener('click', infoButtonHandler);
    });
}

function infoButtonHandler() {
    const button = this;
    const key = Number(document.getElementById(button.id).getAttribute('data-key'));

    const transaction = db.transaction(['recordedTasks'], 'readonly');
    const store = transaction.objectStore('recordedTasks');

    const request = store.get(key);

    request.onsuccess = (event) => {
        const task = event.target.result;
        if (task) {
            document.getElementById('infoTitle').textContent = task.title ? task.title : 'Untitled Task';
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

document.querySelector('.close').addEventListener('click', function () {
    document.getElementById('infoModal').style.display = 'none';
});

function saveTaskDetails(audioBlob) {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const website = document.getElementById('taskWebsite').value;
    const faviconUrl = null;

    // Check if the website value has the same base as the current URL
    // if so, use the current favicon and save it.
    // let currurl
    // let websiteInput = URL(website)
    // chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    //     currurl = tabs[0].url;
    // });
    // currurl = URL(currurl)
    // if (websiteInput.hostname == currurl) {
    //     // save the favicon
    //     faviconUrl = chrome.tabs.faviconUrl;
    //     console.log("Saving favicon: ", faviconUrl);
    // }

    const transaction = db.transaction(['recordedTasks'], 'readwrite');
    const store = transaction.objectStore('recordedTasks');
    const task = { title, description, website, audioBlob };

    let id = store.add(task);

    transaction.oncomplete = (event) => {
        // console.log('Task saved successfully:', id);
    };

    transaction.onerror = (event) => {
        console.error('Task save error:', event.target.errorCode);
    };

    updateStartTaskTab();

    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDescription').value = '';
    // not resetting url because it autofills or was manually changed
}

function updateStartTaskTab() {
    const store = db.transaction('recordedTasks', 'readonly').objectStore('recordedTasks');
    const request = store.openCursor();
    const taskStartSection = document.getElementById('taskStartSection');
    taskStartSection.innerHTML = '';
    const fragment = document.createDocumentFragment();

    let index = 0;
    request.onsuccess = function (event) {
        const cursor = event.target.result;
        if (cursor) {
            console.log("index ", index)
            const task = cursor.value;
            const taskItem = document.createElement('ul');
            taskItem.classList.add('line-item');
            if (task.audioBlob) {
                taskItem.innerHTML = `
                <b class="edit-text2" id="task${index + 1}-title">${task.title}</b>
                <button class="start" data-key="${cursor.key}"id="start-button-${index + 1}">
                    <img class="line-item-icon" alt="" src="./public/play-solid.svg" />
                </button>
                <button class="info" data-key="${cursor.key}" id="info-button-${index + 1}">
                    <img class="line-item-icon" alt="" src="./public/info-solid.svg" />
                </button>
                <button class="editdelete" data-key="${cursor.key}" id="delete-button-${index + 1}">
                    <img class="line-item-icon" alt="" src="./public/trash-regular.svg" />
                </button>
                `;
            } else {
                // if type is other or null, then there was no audio recorded
                taskItem.innerHTML = `
                <b class="edit-text2" id="task${index + 1}-title">${task.title}</b>
                <button class="info" data-key="${cursor.key}" id="info-button-${index + 1}">
                    <img class="line-item-icon" alt="" src="./public/info-solid.svg" />
                </button>
                <button class="editdelete" data-key="${cursor.key}" id="delete-button-${index + 1}">
                    <img class="line-item-icon" alt="" src="./public/trash-regular.svg" />
                </button>
                `;
            }
            index += 1;
            fragment.appendChild(taskItem);
            cursor.continue();
        } else {
            taskStartSection.appendChild(fragment);
            bindDeleteButtons();
            bindInfoButtons();
            bindStartButtons();
        }
    };

    request.onerror = function (event) {
        console.error('Task retrieval error:', event.target.errorCode);
    }
}

function bindDeleteButtons() {
    document.querySelectorAll('.editdelete').forEach(button => {
        button.removeEventListener('click', deleteButtonHandler);
        button.addEventListener('click', deleteButtonHandler);
    });
}

function deleteButtonHandler() {
    const button = this;
    const key = Number(document.getElementById(button.id).getAttribute('data-key'));
    const transaction = db.transaction(['recordedTasks'], 'readwrite');
    const store = transaction.objectStore('recordedTasks');
    const request = store.get(key);

    request.onsuccess = function (event) {
        const task = event.target.result;
        if (confirm(`Are you sure you want to delete the task "${task.title}"?`)) {
            console.log('deleting task', key);
            console.log('task title:', task.title);
            store.delete(key);
            updateStartTaskTab();
        }
    };
    request.onerror = (event) => {
        console.error('Task deletion error:', event.target.errorCode);
    }
}

// function adjustTaskSectionHeight() {
//     const offsetTop = document.querySelector('.navbar').offsetHeight + document.querySelector('#header-bg').offsetHeight;
//     const taskStartSection = document.getElementById('taskStartSection');
//     // taskStartSection.style.maxHeight = `calc(100vh - ${offsetTop}px)`;
// }

function bindStartButtons() {
    document.querySelectorAll('.start').forEach(button => {
        button.removeEventListener('click', startButtonHandler);
        button.addEventListener('click', startButtonHandler);
    });
}

function stopAllAudio() {
    PlayedAudios.forEach((x) => {
        x.pause();
        x.currentTime = 0;
    });
    ObjectURLstore.forEach((url) => {
        URL.revokeObjectURL(url);
    });
}

function startButtonHandler() {
    const button = this;
    const key = Number(document.getElementById(button.id).getAttribute('data-key'));

    const transaction = db.transaction(['recordedTasks'], 'readonly');
    const store = transaction.objectStore('recordedTasks');
    const request = store.get(key);

    request.onsuccess = function (event) {
        const task = event.target.result;
        if (task) {
            stopAllAudio();
            const audioBlob = task.audioBlob;
            const audioUrl = URL.createObjectURL(audioBlob);
            ObjectURLstore.push(audioUrl);
            const audio = new Audio(audioUrl);
            PlayedAudios.push(audio);
            chrome.runtime.sendMessage({ action: 'playAudio', source: audioUrl });
            // audio.play().catch(error => console.error("Playback failed", error));
        }
    };
}

document.getElementById('addTask').addEventListener('click', async function () {
    const title = document.getElementById('taskTitle').value.trim();
    // do the save
    if (title) {
        saveTaskDetails(tempAudioBlob || null);
        tempAudioBlob = null;
    } else {
        alert('Please provide a title for the task.');
    }

});
