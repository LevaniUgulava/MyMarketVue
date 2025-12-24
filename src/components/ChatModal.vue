<template>
    <div v-if="props.open" class="modal" :style="{ bottom: props.isMobile ? '170px' : '100px' }">
        <div class="chat-header">
            <div class="profile">
                <img class="profile-img" src="../assets/no_profile_img.png" alt="Profile" />
            </div>
            <div class="info">
                <span class="name">ოპერატორი</span>
                <div class="status-row">
                    <span class="status-dot" :class="isAdminOnline ? 'online' : 'offline'"></span>
                    <span class="status-text">{{ isAdminOnline ? 'აქტიურია' : 'გასული' }}</span>
                </div>
            </div>
            <div class="actions">
                <button v-if="guest_token" class="action-btn" @pointerdown="stopGuestChat">ჩატის დასრულება</button>
            </div>
        </div>

        <div v-if="isAuthenticate || guest_token" ref="messagesContainer" class="messages">
            <div class="local-image" v-if="files.length > 0">
                <div v-for="(preview, index) in previewUrl" :key="index">
                    <img v-if="preview.type === 'image/png'" :src="preview.url" alt="preview" />
                    <video v-else :src="preview.url" controls playsinline></video>
                    <span @pointerdown="removeLocalImg(index)">
                        <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px"
                            fill="currentcolor">
                            <path
                                d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                        </svg>
                    </span>
                </div>
            </div>
            <div v-if="isTyping" class="typing-indicator">ოპერატორი წერს...</div>

            <div v-for="(msg, index) in messages" :key="index" class="message-container">
                <div :class="['chat-img', msg.sender === 'me' ? 'my-image' : 'other-image']"
                    v-for="(item, index) in (msg.uploading ? (msg.attachments.length > 0 ? msg.attachments : ['loading']) : msg.attachments)"
                    :key="index">
                    <img v-if="item !== 'loading' && item.type === 'restored'" :src="item.media_url">
                    <div v-else-if="item.type === 'restored'" class="placeholder">
                        <svg class="progress-circle" viewBox="0 0 36 36">
                            <path class="bg" d="M18 2.0845
           a 15.9155 15.9155 0 0 1 0 31.831
           a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path class="progress" d="M18 2.0845
           a 15.9155 15.9155 0 0 1 0 31.831
           a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                    </div>
                    <video v-if="item.type === 'video'" :src="item.media_url" controls playsinline></video>
                    <AudioSim v-if="item.type === 'blob'" :media="item.media_url" />

                </div>
                <div v-if="msg.message"
                    :class="['message', msg.sender === 'me' ? 'my-message-container' : 'other-message-container']">
                    {{ msg.message }}
                </div>

                <div :class="msg.sender === 'me' ? 'me-message-meta' : 'other-message-meta'">
                    <span class="time">{{ msg.time }}</span>
                    <span v-if="msg.sender === 'me'" class="seen"> <i v-if="msg.seen"
                            class="fa fa-check-double seen"></i>
                        <i v-else class="fa fa-check"></i></span>
                </div>

            </div>

        </div>
        <div v-else class="notAuth">
            <div v-if="!open" class="btns">
                <button class="btn with">ავტორიზაცია</button>
                <button @pointerdown.stop.prevent="openForm" class="btn without">ანგარიშის გარეშე</button>
            </div>
            <div v-else>
                <div class="form-container">
                    <div class="close-div">
                        <button class='close' @click="openForm">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    <div class="input-container">
                        <label for="name">სახელი</label>

                        <span v-if="guestUser.nameError" class="error-text">{{ guestUser.nameError }}</span>
                        <input v-model="guestUser.name" :class="{ 'input-error': guestUser.nameError }" type="text"
                            name="name" id="name" placeholder=" " />
                    </div>
                    <div class="input-container">
                        <label for="surname">გვარი</label>

                        <span v-if="guestUser.surnameError" class="error-text">{{ guestUser.surnameError }}</span>
                        <input v-model="guestUser.surname" :class="{ 'input-error': guestUser.surnameError }"
                            type="text" name="surname" id="surname" placeholder=" " />
                    </div>
                    <div class="input-container">
                        <label for="email">ელ.ფოსტა</label>
                        <span v-if="guestUser.emailError" class="error-text">{{ guestUser.emailError }}</span>
                        <input v-model="guestUser.email" :class="{ 'input-error': guestUser.emailError }" type="text"
                            name="email" id="email" placeholder=" " />
                    </div>

                    <div class="input-button">
                        <button @pointerdown.stop.prevent="createGuest" class="form-button">ჩატის დაწყება</button>
                    </div>
                </div>
            </div>
        </div>
        <input type="file" ref="fileInput" style="display: none" @change="handleFileUpload" multiple>

        <div class="functional">
            <div class="action">

                <div class="attachment-btn">
                    <div v-if="openAttachment" class="popup-message">
                        <span @pointerdown="triggerFileInput"> <svg xmlns="http://www.w3.org/2000/svg" height="22px"
                                viewBox="0 -960 960 960" width="22px" fill="currentcolor">
                                <path
                                    d="M160-160q-33 0-56.5-23.5T80-240v-400q0-33 23.5-56.5T160-720h240l80-80h320q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm73-280h207v-207L233-440Zm-73-40 160-160H160v160Zm0 120v120h640v-480H520v280q0 33-23.5 56.5T440-360H160Zm280-160Z" />
                            </svg> ფაილები</span>
                        <span @pointerdown="emit('openCamera')"> <svg xmlns="http://www.w3.org/2000/svg" height="22px"
                                viewBox="0 -960 960 960" width="22px" fill="currentcolor">
                                <path
                                    d="M480-260q75 0 127.5-52.5T660-440q0-75-52.5-127.5T480-620q-75 0-127.5 52.5T300-440q0 75 52.5 127.5T480-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM160-120q-33 0-56.5-23.5T80-200v-480q0-33 23.5-56.5T160-760h126l74-80h240l74 80h126q33 0 56.5 23.5T880-680v480q0 33-23.5 56.5T800-120H160Zm0-80h640v-480H638l-73-80H395l-73 80H160v480Zm320-240Z" />
                            </svg> ფოტო</span>
                        <span @pointerdown="openAudioModal"><svg xmlns="http://www.w3.org/2000/svg" height="22px"
                                viewBox="0 -960 960 960" width="22px" fill="currentcolor">
                                <path
                                    d="M480-400q-50 0-85-35t-35-85v-240q0-50 35-85t85-35q50 0 85 35t35 85v240q0 50-35 85t-85 35Zm0-240Zm-40 520v-123q-104-14-172-93t-68-184h80q0 83 58.5 141.5T480-320q83 0 141.5-58.5T680-520h80q0 105-68 184t-172 93v123h-80Zm40-360q17 0 28.5-11.5T520-520v-240q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760v240q0 17 11.5 28.5T480-480Z" />
                            </svg> აუდიო</span>

                        <div class="arrow-down"></div>
                    </div>
                    <svg @pointerdown="openAttachmentModal" xmlns="http://www.w3.org/2000/svg" height="24px"
                        viewBox="0 -960 960 960" width="24px" fill="currentcolor">
                        <path
                            d="M720-330q0 104-73 177T470-80q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v350q0 46-32 78t-78 32q-46 0-78-32t-32-78v-370h80v370q0 13 8.5 21.5T470-320q13 0 21.5-8.5T500-350v-350q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q70 0 119-49.5T640-330v-390h80v390Z" />
                    </svg>

                </div>
                <div class="attachment-btn">
                    <EmojiPickerComponent v-model="newMessage" />
                </div>
            </div>


            <input v-if="!openAudio" v-model="newMessage" @input="handleTyping" type="text" placeholder="შეიყვანეთ..."
                class="chat-input" :disabled="open" @keyup.enter="sendMessage" />

            <div v-if="openAudio" class="audio-input">
                <AudioAccessComponent @recorded="handleRecorded" />
                <div class="emojiko">
                    <svg v-if="!isPlay" @pointerdown="startAudio" xmlns="http://www.w3.org/2000/svg" height="24px"
                        viewBox="0 -960 960 960" width="24px" fill="currentcolor">
                        <path d="M320-200v-560l440 280-440 280Z" />
                    </svg>

                    <svg v-else @pointerdown="stopAudio" xmlns="http://www.w3.org/2000/svg" height="24px"
                        viewBox="0 -960 960 960" width="24px" fill="currentcolor">
                        <path d="M560-200v-560h160v560H560Zm-320 0v-560h160v560H240Z" />
                    </svg>
                </div>
                <div class="emojiko">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                        fill="currentcolor">
                        <path
                            d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
                    </svg>
                </div>
            </div>

            <button :disabled="open" class="send-button" @pointerdown.stop.prevent="sendMessage">
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"
                    fill="currentcolor">
                    <path
                        d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup>
import api from '@/api';
import { ref, nextTick, onMounted, computed, reactive, watch } from 'vue';
import { validateInputFields } from '@/components/utils/validate';

const fileInput = ref(null)
const previewUrl = ref([])
const files = ref([]);
const messagesContainer = ref(null);
const newMessage = ref('');
const isTyping = ref(false);
const openAttachment = ref(false);
const openAudio = ref(false);
const isPlay = ref(false);
const isAdminOnline = ref(false);
const audioRecorder = reactive({
    blob: null,
    url: null,
    audioInstance: null

});
import { useStore } from 'vuex'
import EmojiPickerComponent from './EmojiPickerComponent.vue';
import AudioAccessComponent from './AudioAccessComponent.vue';
import AudioSim from './AudioSim.vue';

const guestUser = reactive({
    name: '',
    surname: '',
    email: ''
});

const store = useStore()
const messages = ref([]);
const open = ref(localStorage.getItem('openForm') === 'true');
const guest_token = ref(localStorage.getItem('guest_token'));
const props = defineProps({
    open: { type: Boolean, Required: true },
    Rawattachment: { type: String, Required: false },
    isMobile: { type: Boolean, Required: true }
})
const emit = defineEmits(['openCamera'])

function openAttachmentModal() {
    openAttachment.value = !openAttachment.value
}
function openAudioModal() {
    openAudio.value = !openAudio.value
    openAttachmentModal();
}
function stopGuestChat() {
    localStorage.removeItem('guest_token');
    guest_token.value = null;

}

function handleRecorded({ blob, url }) {

    audioRecorder.blob = blob
    files.value.push(blob);
    audioRecorder.url = url;
    audioRecorder.audioInstance = new Audio(url);

}
function startAudio() {
    if (audioRecorder.audioInstance) {
        isPlay.value = true
        audioRecorder.audioInstance.play();
        audioRecorder.audioInstance.addEventListener('ended', () => {
            isPlay.value = false
        });
    }
}

function stopAudio() {
    if (audioRecorder.audioInstance) {
        isPlay.value = false
        audioRecorder.audioInstance.pause();
    }
}


watch(isTyping, () => {
    scrollToBottom();
})

const id = computed(() => {
    return store.getters['auth/getId'] || guest_token.value
})
const isAuthenticate = computed(() => store.getters['auth/isAuthenticated'])
const scrollToBottom = () => {
    nextTick(() => {
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
    });
};
const triggerFileInput = () => {
    fileInput.value.click()
    scrollToBottom();

}
const handleFileUpload = (event) => {
    files.value = event.target.files
    if (!files.value || !files.value.length) return

    previewUrl.value = []

    Array.from(files.value).forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
            previewUrl.value.push(e.target.result)
        }
        reader.readAsDataURL(file)
    })
    scrollToBottom();

}
const removeLocalImg = (index) => {
    previewUrl.value.splice(index, 1)
    if (previewUrl.value.length == 0) {
        files.value = [];
    }

}

let channel = null;
function websocket() {
    channel = window.Echo.join(`chat.${id.value}`);

    channel.listen('.PrivateChatEvent', (e) => {
        if (e.sender_id != id.value) {
            messages.value.unshift({
                message: e.message,
                sender: e.sender_id == id.value ? 'me' : 'other',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                seen: false,
                image_urls: e.mediaUrls
            })
        }
        scrollToBottom();
    });
    channel.listen('.MessageSeen', () => {
        messages.value.forEach(msg => {
            if (!msg.seen && isAdminOnline.value) {
                msg.seen = true;
            }
        });
    })

    channel.joining((user) => {
        if (user)
            isAdminOnline.value = true;
    }).leaving((user) => {
        if (user)
            isAdminOnline.value = false;
    });

    channel.listenForWhisper('typing', (e) => {
        isTyping.value = e.isTyping;
    });
}
watch(id, () => {
    websocket();
}, {
    immediate: true
})


async function markedAsSeen() {
    try {
        await api.post(`/markedSeen/${id.value}`, {}, {
            tokenRequired: true
        });

    } catch (error) {
        console.log(error);
    }
}
let typingTimer = null;

function handleTyping() {
    if (!typingTimer) {
        channel.whisper('typing', { isTyping: true });
    }
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
        channel.whisper('typing', { isTyping: false });
        typingTimer = null;
    }, 2000);
}


function openForm() {
    open.value = !open.value
    localStorage.setItem('openForm', open.value);
}
async function createGuest() {
    const isValid = validateInputFields(guestUser, [
        { model: 'name', errorKey: 'nameError', message: 'სახელი აუცილებელია' },
        { model: 'surname', errorKey: 'surnameError', message: 'გვარი აუცილებელია' },
        { model: 'email', errorKey: 'emailError', message: 'მეილი აუცილებელია' }
    ]);
    if (!isValid) return;
    try {
        const response = await api.post('/create/guest', { name: guestUser.name, surname: guestUser.surname, email: guestUser.email });
        if (response.status === 200) {
            localStorage.setItem('guest_token', response.data.uuid);
            openForm()
        }

    } catch (error) {
        console.log(error);
    }

}
async function getChat() {
    try {
        const response = await api.get(`/getChat/1`, {
            tokenRequired: true
        })
        messages.value.push(...response.data)
        scrollToBottom()
        markedAsSeen();



    } catch (error) {
        console.log(error.response);
    }
}
async function getGuestChat() {
    try {
        const response = await api.post(`/getGuestChat`, { guest_uuid: id.value }, {
            tokenRequired: true
        })
        messages.value.push(...response.data)
        scrollToBottom()
        // markedAsSeen();


    } catch (error) {
        console.log(error.response);
    }
}
function base64ToFile(base64, filename = 'photo.png') {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
}
watch(
    () => props.Rawattachment,
    (newImage) => {
        if (!newImage) return;

        let file;
        if (!newImage.type) {
            file = base64ToFile(newImage, 'restored.png')
        } else {
            file = newImage
        }
        previewUrl.value.push({ url: URL.createObjectURL(file), type: file.type })
        files.value.push(file);
        scrollToBottom()

    }
)


onMounted(() => {
    if (isAuthenticate.value) {
        getChat();
    } else if (guest_token.value) {
        getGuestChat();
    }
});

async function sendMessage() {

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formData = new FormData();
    formData.append('reciever_id', 1);
    formData.append('chat_id', id.value);
    formData.append('message', newMessage.value);
    formData.append('sender_id', id.value);
    formData.append('guest_uuid', id.value);
    if (files.value && files.value.length > 0) {
        Array.from(files.value).forEach(file => {
            formData.append('attachment[]', file)
        })
    }


    const tempMessage = reactive({
        message: newMessage.value,
        attachments: [],
        sender: 'me',
        time: timeStr,
        seen: false,
        uploading: files.value.length > 0 ? files.value.length : 0
    });
    messages.value.unshift(tempMessage);
    files.value = [];

    try {
        const response = await api.post('/sendMessage', formData, {
            tokenRequired: true
        })

        tempMessage.attachments = response.data.attachments;


    } catch (error) {
        console.log(error);
    }

    newMessage.value = '';


    scrollToBottom();
}

</script>

<style scoped>
.seen {
    font-size: 10px;
    margin-left: 3px;
    color: gray;
}

.fa-check-double.seen {
    color: #4fc3f7;
}

.placeholder {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 150px;
    height: 200px;
    border-radius: 12px;
    background-color: #e0e0e0;
    animation: pulse 1.5s infinite ease-in-out;

    position: relative;
}

@keyframes pulse {
    0% {
        background-color: #f0f0f0;
    }

    50% {
        background-color: #e0e0e0;
    }

    100% {
        background-color: #f0f0f0;
    }
}

.progress-circle {
    width: 40px;
    height: 40px;
}

.progress-circle .bg {
    fill: none;
    stroke: #ddd;
    stroke-width: 2.8;
}

.progress-circle .progress {
    fill: none;
    stroke: #3498db;
    stroke-width: 2.8;
    stroke-linecap: round;
    stroke-dasharray: 100, 100;
    stroke-dashoffset: 100;
    animation: fillCircle 2s linear infinite;
}

@keyframes fillCircle {
    0% {
        stroke-dashoffset: 100;
    }

    100% {
        stroke-dashoffset: 0;
    }
}

.local-image {
    display: flex;
    flex-direction: row-reverse;
    background-color: #f9fbfd;
    gap: 5px;
    max-width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    min-height: 130px;

    flex-wrap: nowrap;

}

.local-image::-webkit-scrollbar {
    height: 3px;
}

.local-image::-webkit-scrollbar-track {
    background: transparent;
}

.local-image::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 10px;
}

.local-image::-webkit-scrollbar-thumb:hover {
    background-color: #aaa;
}

.local-image>div {
    position: relative;
}

.local-image img,
video {
    flex: 0 0 auto;
    width: 90px;
    height: 120px;
    object-fit: fill;
    border-radius: 10px;

}

.local-image span {
    position: absolute;
    display: flex;
    align-items: center;
    cursor: pointer;
    top: 5px;
    right: 5px;
    background-color: white;
    padding: 3px;
    border-radius: 10px;
}

.local-image span:hover {
    background-color: rgb(227, 226, 226);

}

.popup-message {
    position: absolute;
    bottom: 100%;
    left: 150%;
    transform: translateX(-35%);
    background-color: #fff;
    color: #333;
    border: 1px solid #d1d1d1;
    border-radius: 6px;
    padding: 8px 10px;
    font-size: 13px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    white-space: nowrap;
    z-index: 9;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.popup-message .arrow-down {
    position: absolute;
    top: 100%;
    left: 10%;
    margin-left: -5px;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #d1d1d1;
}

.popup-message span {
    padding: 5px 10px;
    font-size: 14px;
    gap: 5px;
}

.popup-message span:hover {
    background-color: #e1e0e0;
    border-radius: 10px;
}

.attachment-btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 45px;
    width: 30px;
    color: #7c317c;
    border-radius: 10px;
    cursor: pointer;
}

.attachment-btn:hover {
    color: #000000e5;

}

.chat-img img,
video {
    width: 180px;
    min-height: 150px;
    object-fit: cover;
    border-radius: 12px;
}

.notAuth {
    flex: 1;
    padding: 10px;
    justify-content: center;
    overflow-y: auto;
    gap: 8px;
    scroll-behavior: smooth;
}

.btns {
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 10px;
}

.btn {
    padding: 10px 25px;
    border-radius: 20px;
    border: 1px solid #7c317c;
    cursor: pointer;
}

.with {
    background-color: #7c317c;
    color: white;
}

.without {
    color: #7c317c;
    background-color: white;
}

.with:hover {
    background-color: #7c317ce5;
}

.without:hover {
    background-color: #efeeee;
}

.modal {
    position: fixed;
    right: 20px;
    height: 60%;
    width: 350px;
    max-width: 90%;
    border-radius: 15px;
    background: linear-gradient(180deg, #ffffff 0%, #f9f9f9 100%);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3), 0 5px 15px rgba(0, 0, 0, 0.1);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-family: Arial, sans-serif;
}

.chat-header {
    display: flex;
    align-items: center;
    background: linear-gradient(90deg, #162e63, #091530);
    padding: 10px 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    color: white;
}

.profile {
    flex-shrink: 0;
}

.profile-img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(255, 255, 255, 0.3);
}

.info {
    margin-left: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.name {
    font-weight: 600;
    font-size: 16px;
}

.status-row {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    opacity: 0.85;
}

.status-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
}

.status-dot.online {
    background-color: #4caf50;
}

.status-dot.offline {
    background-color: #f44336;
}

.actions {
    display: flex;
    gap: 10px;
    margin-left: auto;
}

.action-btn {
    background: rgba(255, 255, 255, 0.15);
    border: none;
    font-size: 10px;
    border-radius: 8px;
    padding: 6px 10px;
    color: white;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.1s ease;
}

.action-btn:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.05);
}

.messages {
    flex: 1;
    padding: 10px;
    overflow-y: auto;
    display: flex;
    flex-direction: column-reverse;
    gap: 8px;
    scroll-behavior: smooth;
}



.message-container {
    display: flex;
    flex-direction: column;
    max-width: 100%;
}


.my-message-container,
.my-image {
    align-self: flex-end;
}

.other-message-container,
.other-image {
    align-self: flex-start;
}

.message {
    padding: 10px 15px;
    border-radius: 20px;
    font-size: 14px;
    max-width: 50%;
    word-wrap: break-word;
    transition: all 0.1s;
}

.my-message-container {
    background-color: #d1ffd6;
}

.other-message-container {
    background-color: #ffffff;
    border: 1px solid #ddd;
}

.me-message-meta,
.other-message-meta {
    font-size: 10px;
    color: #888;
    margin-top: 2px;
    display: flex;
}

.me-message-meta {
    justify-content: flex-end;
    margin-right: 10px;

}

.other-message-meta {
    justify-content: flex-start;
    margin-left: 10px;
}

.typing-indicator {
    font-style: italic;
    font-size: 0.85rem;
    color: #555;
    margin: 5px 0;
    align-self: flex-start;
}

.action {
    display: flex;
}

/* Input area */
.functional {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 10px;
    border-top: 1px solid #ddd;
    background-color: #fafafa;
}

.chat-input {
    flex: 1;
    padding: 10px 15px;
    border-radius: 15px;
    font-size: 15px;
    border: 1px solid #ccc;
    outline: none;
    transition: all 0.2s;
}

.audio-input {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
}

.chat-input:disabled {
    cursor: not-allowed;
}

.chat-input:focus {
    border-color: #7c317c;
    box-shadow: 0 0 5px rgba(124, 49, 124, 0.5);
}

.send-button:hover:disabled {
    background-color: #d2d0d0;
}

.send-button:disabled {
    background-color: #d2d0d0;

    cursor: not-allowed;

}

.send-button {
    height: 40px;
    width: 40px;
    display: flex;
    justify-content: center;
    border-radius: 15px;
    align-items: center;
    border: none;
    background-color: #7c317c;
    color: white;
    cursor: pointer;
    transition: 0.2s;
}

.send-button:hover {
    background-color: #5b2360;
}

.close-div {
    display: flex;
    justify-content: flex-end;
}

.close {
    background-color: transparent;
    border: none;
    cursor: pointer;
    border-radius: 40%;
    font-size: 20px;

}

.form-container {
    width: 90%;
    margin: auto;
}

.input-button {
    display: flex;
    justify-content: center;
    z-index: 1000;
}

.form-button {
    padding: 10px 25px;
    border: none;
    border-radius: 20px;
    color: white;
    background-color: #7c317c;
    cursor: pointer;
}


.input-container {
    position: relative;
    margin-bottom: 10px;

}

.input-container label {
    display: flex;
    font-size: 13px;
    margin-bottom: 5px;
    color: #7c317c;
}


.input-container input {
    width: 100%;
    padding: 0px 0px !important;
    text-indent: 15px;
    height: 40px;
    border: 1px solid #dbdbdb;
    border-radius: 10px;
    outline: none;
    transition: border-color 0.3s, box-shadow 0.3s;
}

.error-text {
    position: absolute;
    top: 2px;
    right: 0;
    color: #e74c3c;
    font-size: 12px;
    background: white;
    padding: 0 5px;
}
</style>
