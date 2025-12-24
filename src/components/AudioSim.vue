<template>
    <div class="voice-container">
        <div class="mic-button" @click="togglePlay">
            <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                width="24px" fill="white">
                <path d="M320-200v-560l440 280-440 280Z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                fill="white">
                <path d="M560-200v-560h160v560H560Zm-320 0v-560h160v560H240Z" />
            </svg>
        </div>

        <div class="progress-section">
            <div class="progress-container">
                <div class="progress" :style="{ transform: `scaleX(${progress / 100})` }"></div>
            </div>
            <div class="down">
                <div class="duration">
                    <div v-if="!isPlaying">
                        {{ formatTime(audioDuration) }}
                    </div>
                    <div v-else>
                        {{ formatTime(currentTime) }}
                    </div>
                </div>
                <div>
                    <div class="speed-control" @click="changeSpeed">{{ playbackRate }}x</div>

                </div>
            </div>

        </div>


        <audio ref="audioRef" :src="media" @timeupdate="updateProgress" @loadedmetadata="onLoadedMetadata"
            hidden></audio>
    </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
    media: {
        type: String,
        default: null,
    },
});

const isPlaying = ref(false);
const audioRef = ref(null);
const audioDuration = ref(0);
const currentTime = ref(0);
const progress = ref(0);
const playbackRate = ref(1);

let smoothTimer = null;

watch(
    () => props.media,
    (newUrl) => {
        if (!newUrl) return;
        if (audioRef.value) {
            audioRef.value.pause();
            audioRef.value.src = "";
        }

        const newAudio = new Audio(newUrl);
        newAudio.addEventListener("loadedmetadata", () => {
            audioDuration.value = newAudio.duration;
        });
        newAudio.addEventListener("timeupdate", () => {
            currentTime.value = newAudio.currentTime;
            progress.value = (currentTime.value / audioDuration.value) * 100;
        });
        newAudio.addEventListener("ended", () => {
            isPlaying.value = false;
            progress.value = 0;
            clearInterval(smoothTimer);
        });
        audioRef.value = newAudio;
    },
    { immediate: true }
);

function togglePlay() {
    if (!audioRef.value) return;

    if (isPlaying.value) {
        audioRef.value.pause();
        isPlaying.value = false;
        clearInterval(smoothTimer);
    } else {
        audioRef.value.playbackRate = playbackRate.value;
        audioRef.value.play();
        isPlaying.value = true;
        startSmoothProgress();
    }
}
function updateProgress() {
    if (!audioRef.value) return;
    currentTime.value = audioRef.value.currentTime;
    progress.value = (currentTime.value / audioDuration.value) * 100;
}


function startSmoothProgress() {
    clearInterval(smoothTimer);
    smoothTimer = setInterval(() => {
        if (!audioRef.value) return;
        const target = (audioRef.value.currentTime / audioDuration.value) * 100;
        progress.value += (target - progress.value) * 0.25; // inertia feel
        if (!isPlaying.value) clearInterval(smoothTimer);
    }, 50);
}

function changeSpeed() {
    playbackRate.value = playbackRate.value === 1 ? 2 : playbackRate.value === 2 ? 0.5 : 1;
    if (audioRef.value) audioRef.value.playbackRate = playbackRate.value;
}

function formatTime(sec) {
    if (!sec) return "0:00";
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60)
        .toString()
        .padStart(2, "0");
    return `${minutes}:${seconds}`;
}
</script>

<style scoped>
.voice-container {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #1e1e1e;
    border-radius: 40px;
    padding: 5px 15px 5px 5px;
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.25);
}

.mic-button {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #4a90e2;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s ease;
}

.mic-button:hover {
    background: #357ac9;
}

.progress-section {
    flex-grow: 1;
}

.progress-container {
    margin-top: 5px;
    width: 150px;
    height: 6px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 3px;
    overflow: hidden;
    transform-origin: left;
}

.progress {
    height: 100%;
    background: linear-gradient(90deg, #4a90e2, #6bc1ff);
    transform-origin: left;
    transform: scaleX(0);
    transition: transform 0.1s linear;
}

.down {
    display: flex;
    justify-content: space-between;
}

.duration {
    color: #ccc;
    font-size: 12px;
    margin-top: 4px;
}

.speed-control {
    cursor: pointer;
    font-size: 10px;
    margin-top: 5px;
    color: #fff;
    background: rgba(255, 255, 255, 0.15);
    padding: 4px 8px;
    border-radius: 6px;
    transition: background 0.2s ease, transform 0.1s ease;
    user-select: none;
}

.speed-control:hover {
    background: rgba(255, 255, 255, 0.25);
}

.speed-control:active {
    transform: scale(0.9);
}
</style>
