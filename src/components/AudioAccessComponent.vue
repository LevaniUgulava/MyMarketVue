<template>
    <div class="voice-container">
        <!-- მიკროფონის ღილაკი -->
        <div class="mic-button" :class="{ recording: isRecording }"
            @click="isRecording ? stopRecording() : startRecording()">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white">
                <path d="M480-400q-50 0-85-35t-35-85v-240q0-50 35-85t85-35q50 0 85 
          35t35 85v240q0 50-35 85t-85 35Zm-40 
          280v-123q-104-14-172-93t-68-184h80q0 
          83 58.5 141.5T480-320q83 0 
          141.5-58.5T680-520h80q0 
          105-68 184t-172 93v123h-80Z" />
            </svg>
        </div>

        <div class="waveform">
            <div v-for="(bar, i) in bars" :key="i" class="bar" :style="{ height: bar + 'px' }"></div>
        </div>

    </div>
</template>

<script setup>
import { ref, onUnmounted } from "vue";



const emit = defineEmits(['recorder'])
const isRecording = ref(false);
const audioUrl = ref(null);
const bars = ref(new Array(20).fill(5));

const audioContext = ref(null);
const analyser = ref(null);
const dataArray = ref(null);
const source = ref(null);
const recorder = ref(null);
const chunks = ref([]);
let animationId = null;

async function startRecording() {
    isRecording.value = true;
    chunks.value = [];

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext.value = new (window.AudioContext || window.webkitAudioContext)();
    source.value = audioContext.value.createMediaStreamSource(stream);
    analyser.value = audioContext.value.createAnalyser();
    analyser.value.fftSize = 256;
    const bufferLength = analyser.value.frequencyBinCount;
    dataArray.value = new Uint8Array(bufferLength);
    source.value.connect(analyser.value);

    recorder.value = new MediaRecorder(stream, { mimeType: 'audio/webm' });
    recorder.value.ondataavailable = (e) => chunks.value.push(e.data);
    recorder.value.onstop = () => {
        const blob = new Blob(chunks.value, { type: "audio/webm" });
        audioUrl.value = URL.createObjectURL(blob);
    };

    recorder.value.start();
    animateBars();
}

function stopRecording() {
    isRecording.value = false;
    recorder.value.onstop = () => {
        const blob = new Blob(chunks.value, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);

        audioUrl.value = url;

        emit("recorded", { blob, url });
    };
    recorder.value.stop();
    cancelAnimationFrame(animationId);
}

function animateBars() {
    const len = bars.value.length;
    function draw() {
        animationId = requestAnimationFrame(draw);
        analyser.value.getByteFrequencyData(dataArray.value);

        const step = Math.floor(dataArray.value.length / len);
        for (let i = 0; i < len; i++) {
            const v = dataArray.value[i * step] / 255;
            bars.value[i] = 1 + v * 25;
        }
    }
    draw();
}

onUnmounted(() => {
    cancelAnimationFrame(animationId);
    if (audioContext.value) audioContext.value.close();
});
</script>

<style scoped>
.voice-container {
    display: flex;
    align-items: center;
    background: white;
    border-radius: 40px;
    height: 25px;
    padding: 5px;
    width: fit-content;
    transition: box-shadow 0.3s ease;
}



.mic-button {
    width: 30px;
    height: 30px;
    background: #7c317c;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    flex-shrink: 0;
}

.mic-button.recording {
    background: #ff3b3b;
    animation: pulse 1s infinite alternate;
}

@keyframes pulse {
    0% {
        transform: scale(1);
        box-shadow: 0 0 10px rgba(255, 59, 59, 0.5);
    }

    100% {
        transform: scale(1.1);
        box-shadow: 0 0 20px rgba(255, 59, 59, 0.7);
    }
}

.waveform {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    gap: 3px;
    margin-left: 5px;
    margin-right: 10px;

}

.bar {
    width: 4px;
    background: #7c317c;
    border-radius: 2px;
    transform-origin: center center;
    transition: height 0.1s linear;
}
</style>
