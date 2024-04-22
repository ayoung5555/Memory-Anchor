let source = 'default.wav';

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'playAudio') {
        source = message.source;
    }
    playSound();
});

async function playSound() {
    await createOffscreen();
    await chrome.runtime.sendMessage({ play: { source } });
}

// Create the offscreen document if it doesn't already exist
async function createOffscreen() {
    if (await chrome.offscreen.hasDocument()) return;
    await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['AUDIO_PLAYBACK'],
        justification: 'testing' // details for using the API
    });
}