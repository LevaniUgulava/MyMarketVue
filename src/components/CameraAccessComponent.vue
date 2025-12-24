<template>
    <div v-if="props.open" class="modal-camera">
        <div class="camera-container">
            <button class="exit-button" @click="closeCamera">
                <svg xmlns="http://www.w3.org/2000/svg" height="35px" viewBox="0 -960 960 960" width="35px"
                    fill="currentcolor">
                    <path
                        d="m336-280-56-56 144-144-144-143 56-56 144 144 143-144 56 56-144 143 144 144-56 56-143-144-144 144Z" />
                </svg>
            </button>

            <button v-if="videoVisible && !isRecording && !photoVisible && !recordedVideo" class="flip-button"
                @click="switchCamera">
                <svg xmlns="http://www.w3.org/2000/svg" height="35px" viewBox="0 -960 960 960" width="35px"
                    fill="white">
                    <path
                        d="M320-280q-33 0-56.5-23.5T240-360v-240q0-33 23.5-56.5T320-680h40l40-40h160l40 40h40q33 0 56.5 23.5T720-600v240q0 33-23.5 56.5T640-280H320Zm0-80h320v-240H320v240Zm160-40q33 0 56.5-23.5T560-480q0-33-23.5-56.5T480-560q-33 0-56.5 23.5T400-480q0 33 23.5 56.5T480-400ZM342-940q34-11 68.5-15.5T480-960q94 0 177.5 33.5t148 93Q870-774 911-693.5T960-520h-80q-7-72-38-134.5t-79.5-110Q714-812 651-842t-135-36l62 62-56 56-180-180ZM618-20Q584-9 549.5-4.5T480 0q-94 0-177.5-33.5t-148-93Q90-186 49-266.5T0-440h80q8 72 38.5 134.5t79 110Q246-148 309-118t135 36l-62-62 56-56L618-20ZM480-480Z" />
                </svg>
            </button>

            <video ref="video" autoplay playsinline muted class="camera-preview"></video>


            <div v-if="!photoVisible && !recordedVideo" class="control-div">
                <div class="mode-toggle">
                    <button :class="['toggle-btn', mode === 'photo' ? 'active' : '']"
                        @click="mode = 'photo'; openCamera()">
                        Photo
                    </button>
                    <button :class="['toggle-btn', mode === 'video' ? 'active' : '']"
                        @click="mode = 'video'; openCamera()">
                        Video
                    </button>
                </div>


                <div class="controls" v-if="!photoVisible">
                    <button v-if="!isRecording" class="ios-capture-btn"
                        @click="mode === 'photo' ? capturePhoto() : startRecording()"></button>
                    <button v-else class="stop-btn" @click="stopRecording"></button>
                </div>
            </div>


            <div v-if="photoVisible" class="photo-preview-container">
                <img :src="photo" alt="Captured photo" class="photo-preview" />
                <div class="photo-actions">
                    <button class="delete-btn" @click="deletePhoto"><svg xmlns="http://www.w3.org/2000/svg"
                            height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor">
                            <path
                                d="M280-200v-80h284q63 0 109.5-40T720-420q0-60-46.5-100T564-560H312l104 104-56 56-200-200 200-200 56 56-104 104h252q97 0 166.5 63T800-420q0 94-69.5 157T564-200H280Z" />
                        </svg></button>
                    <button class="restore-btn" @click="confirmPhoto"><svg xmlns="http://www.w3.org/2000/svg"
                            height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor">
                            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                        </svg></button>
                </div>
            </div>

            <!-- Recorded Video Preview -->
            <div v-if="recordedVideo" class="photo-preview-container">
                <video :src="recordedVideo" controls class="photo-preview"></video>
                <div class="photo-actions">
                    <button class="delete-btn" @click="deleteRecordedVideo"><svg xmlns="http://www.w3.org/2000/svg"
                            height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor">
                            <path
                                d="M280-200v-80h284q63 0 109.5-40T720-420q0-60-46.5-100T564-560H312l104 104-56 56-200-200 200-200 56 56-104 104h252q97 0 166.5 63T800-420q0 94-69.5 157T564-200H280Z" />
                        </svg></button>
                    <button class="restore-btn" @click="confirmRecordedVideo"><svg xmlns="http://www.w3.org/2000/svg"
                            height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor">
                            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                        </svg></button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
    open: { type: Boolean, required: true },
})
const emit = defineEmits(['closeCamera', 'photoCaptured', 'videoCaptured'])

const video = ref(null)
const stream = ref(null)
const facingMode = ref('user')
const mode = ref('photo')

const videoVisible = ref(true)
const photoVisible = ref(false)
const isRecording = ref(false)
const photo = ref(null)
const recordedVideo = ref(null)
let mediaRecorder = null
let chunks = []

watch(
    () => props.open,
    async (val) => {
        if (val) await openCamera()
        else stopCamera()
    }
)

async function openCamera() {
    try {
        stopCamera()

        stream.value = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: facingMode.value },
            audio: mode.value === 'video',
        })

        if (video.value) {
            video.value.srcObject = stream.value
            await video.value.play()
        }
    } catch (err) {
        console.error('Camera access error:', err)
    }
}

function stopCamera() {
    if (stream.value) {
        stream.value.getTracks().forEach((track) => track.stop())
        stream.value = null
    }
}

function closeCamera() {
    stopCamera()
    emit('closeCamera', false)
}


function switchCamera() {
    facingMode.value = facingMode.value === 'user' ? 'environment' : 'user'
    openCamera()
}

function capturePhoto() {
    if (!video.value) return
    const canvas = document.createElement('canvas')
    canvas.width = video.value.videoWidth
    canvas.height = video.value.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video.value, 0, 0, canvas.width, canvas.height)
    photo.value = canvas.toDataURL('image/png')
    photoVisible.value = true
    stopCamera()
}

function deletePhoto() {
    photo.value = null
    photoVisible.value = false
    openCamera()
}

function confirmPhoto() {
    emit('photoCaptured', photo.value)
    closeCamera()
}



async function startRecording() {
    if (!stream.value) return
    isRecording.value = true
    chunks = []
    mediaRecorder = new MediaRecorder(stream.value)
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
    mediaRecorder.onstop = handleVideoStop
    mediaRecorder.start()
}

function stopRecording() {
    if (mediaRecorder && isRecording.value) {
        mediaRecorder.stop()
        isRecording.value = false
        stopCamera()
    }
}

function handleVideoStop() {
    const blob = new Blob(chunks, { type: 'video/mp4' })
    recordedVideo.value = URL.createObjectURL(blob)
}

function deleteRecordedVideo() {
    recordedVideo.value = null
    openCamera()
}

function confirmRecordedVideo() {
    if (!recordedVideo.value) return

    fetch(recordedVideo.value) 
        .then(res => res.blob()) 
        .then(blob => {
            const file = new File([blob], 'video.mp4', { type: 'video/mp4' }) 
            emit('videoCaptured', file)
            closeCamera()
        })
}

onMounted(() => {
    if (props.open) openCamera()
})

onBeforeUnmount(() => {
    stopCamera()
})
</script>

<style>
.modal-camera {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.85);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.camera-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    background-color: black;
    overflow: hidden;
}

.camera-preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
}

.mode-toggle {
    position: absolute;
    bottom: 16%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    background-color: rgba(255, 255, 255, 0.15);
    overflow: hidden;
    z-index: 20;
    border-radius: 12px;

    border: 1px solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(4px);
}

.toggle-btn {
    flex: 1;
    color: white;
    font-size: 1rem;
    font-weight: 500;
    padding: 8px 16px;
    border: none;
    border-radius: 12px;

    background: transparent;
    cursor: pointer;
    transition: all 0.2s ease;
}

.toggle-btn:hover {
    border-radius: 12px;

    background-color: rgba(255, 255, 255, 0.2);
}

.toggle-btn.active {
    background-color: rgba(255, 255, 255, 0.9);
    color: black;
    font-weight: 600;
}


.controls {
    position: absolute;
    bottom: 5%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
}

.exit-button {
    position: absolute;
    top: 5%;
    right: 5%;
    color: white;
    font-size: 2rem;
    background: none;
    border: none;
    cursor: pointer;
    z-index: 10;
}

.flip-button {
    position: absolute;
    bottom: 5%;
    left: 5%;
    width: 70px;
    height: 70px;
    color: white;
    font-size: 1.5rem;
    background: none;
    border: none;
    cursor: pointer;
    z-index: 10;
}

.ios-capture-btn {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 5px solid white;
    background-color: rgba(255, 255, 255, 0.3);
    cursor: pointer;
    transition: transform 0.1s;
}

.ios-capture-btn:active {
    transform: scale(0.85);
}

.stop-btn {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: red;
    border: 5px solid white;
    cursor: pointer;
}

/* Photo & Video preview */
.photo-preview-container {
    position: absolute;
    inset: 0;
    background-color: black;
}

.photo-preview {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.photo-actions {
    position: absolute;
    bottom: 10%;
    right: 5%;
    display: flex;
    gap: 1rem;
}

.delete-btn,
.restore-btn {
    font-size: 1.5rem;
    color: white;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 15px;
    border-radius: 10px;
    cursor: pointer;
}
</style>
