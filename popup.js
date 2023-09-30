// JavaScript code for managing state and functionality
let isVideoChecked = false;
let isAudioChecked = false;
let isScreenRecording = false;
let isVideoMuted = true;
let isFullScreenActive = false;
let isCurrentTabActive = false;
let isRecording = false;
let recordedContentURL = null;
let chunks = [];
let videoStream = null; // Store the video stream
let audioStream = null; // Store the audio stream
let screenRecordingStream = null; // Store the screen recording stream
let tabCaptureStream = null; // Store the tab capture stream

// Event handlers for buttons and icons
document.getElementById('recordingButton').addEventListener('click', recordingHandleToggle);
document.getElementById('fullScreenOption').addEventListener('click', screenHandleToggle);
document.getElementById('currentTabOption').addEventListener('click', tabRecordingHandleToggle);
document.getElementById('videoToggle').addEventListener('click', videoHandleToggle);
document.getElementById('audioToggle').addEventListener('click', audioHandleToggle);
document.getElementById('settingsIcon').addEventListener('click', handleCloseTab);
document.getElementById('closeTabIcon').addEventListener('click', handleCloseTab);

function recordingHandleToggle() {
    if (isRecording) {
        stopRecording();
        console.log("Recording stopped");
        document.getElementById('recordingButton').innerHTML ="Start Recording"
    } else {
        startRecording();
        console.log("Recording started");
        document.getElementById('recordingButton').innerHTML ="Stop Recording"

    }
}

function startRecording() {
    // Check if video, audio, or screen recording is checked and start recording accordingly
    if (isVideoChecked) {
        startVideoRecording();
    }
    if (isAudioChecked) {
        startAudioRecording();
    }
    if (isScreenRecording) {
        startScreenRecording();
    }
    if (isCurrentTabActive) {
        startTabRecording();
    }
    isRecording = true;
}

function stopRecording() {
    // Stop all recording and release the camera, audio, and screen recording streams
    if (isVideoChecked) {
        stopVideoRecording();
    }
    if (isAudioChecked) {
        stopAudioRecording();
    }
    if (isScreenRecording) {
        stopScreenRecording();
    }
    if (isCurrentTabActive) {
        stopTabRecording();
    }
    isRecording = false;

    // Generate a blob URL for previewing the recorded content
    if (chunks.length > 0) {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const recordedContentURL = URL.createObjectURL(blob);
        
        // Display the recorded content and link
        document.getElementById('recordedVideo').src = recordedContentURL;
        document.getElementById('recordedVideo').style.display = 'block';
        document.getElementById('recordedContentLink').href = recordedContentURL;
        document.getElementById('recordedContentLink').style.display = 'block';
    }
}

function screenHandleToggle() {
    // Toggle screen recording check and start/stop screen recording
    isFullScreenActive = !isFullScreenActive;
    if (isFullScreenActive) {
        startScreenRecording();
    } else {
        stopScreenRecording();
    }
}

function tabRecordingHandleToggle() {
    // Toggle current tab recording check and start/stop current tab recording
    isCurrentTabActive = !isCurrentTabActive;
    if (isCurrentTabActive) {
        startTabRecording();
    } else {
        stopTabRecording();
    }
}

function videoHandleToggle() {
    // Toggle video check and start/stop video recording
    isVideoChecked = !isVideoChecked;
    if (isVideoChecked) {
        startVideoRecording();
    } else {
        stopVideoRecording();
    }
}

function startVideoRecording() {
    // Request access to the camera
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            videoStream = stream;
            // Start video recording logic here
        })
        .catch((error) => {
            console.error("Error accessing camera:", error);
        });
}

function stopVideoRecording() {
    // Stop video recording and release the camera stream
    if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
        videoStream = null;
    }
    // Stop video recording logic here
}

function audioHandleToggle() {
    // Toggle audio check and start/stop audio recording
    isAudioChecked = !isAudioChecked;
    if (isAudioChecked) {
        startAudioRecording();
    } else {
        stopAudioRecording();
    }
}

function startAudioRecording() {
    // Request access to the microphone
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
            audioStream = stream;
            // Start audio recording logic here
        })
        .catch((error) => {
            console.error("Error accessing microphone:", error);
        });
}

function stopAudioRecording() {
    // Stop audio recording and release the audio stream
    if (audioStream) {
        audioStream.getTracks().forEach((track) => track.stop());
        audioStream = null;
    }
    // Stop audio recording logic here
}

function startScreenRecording() {
    // Request access to screen recording
    navigator.mediaDevices.getDisplayMedia({ video: true, audio: isAudioChecked })
        .then((stream) => {
            screenRecordingStream = stream;
            // Start screen recording logic here
        })
        .catch((error) => {
            console.error("Error accessing screen recording:", error);
        });
}

function stopScreenRecording() {
    // Stop screen recording and release the screen recording stream
    if (screenRecordingStream) {
        screenRecordingStream.getTracks().forEach((track) => track.stop());
        screenRecordingStream = null;
    }
    // Stop screen recording logic here
}

function startTabRecording() {
    // Check if tab capture is supported
    if (chrome.tabCapture) {
        // Options for tab capture
        const captureOptions = {
            audio: isAudioChecked, // Include audio if checked
            video: 'tab', // Capture the current tab
        };

        chrome.tabCapture.capture(captureOptions, function (stream) {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                return;
            }

            tabCaptureStream = stream;
            // Start tab recording logic here using 'tabCaptureStream'
            console.log("Tab recording started");
        });
    } else {
        console.error("Tab capture is not supported in this environment.");
    }
}

function stopTabRecording() {
    if (tabCaptureStream) {
        tabCaptureStream.getTracks().forEach((track) => track.stop());
        tabCaptureStream = null;
        // Stop tab recording logic here
        console.log("Tab recording stopped");
    }
}

function handleCloseTab() {
    window.close();
}
