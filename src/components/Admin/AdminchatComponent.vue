<template>
    <div class="admin-chat">

        <div class="user-list">
            <div class="mode-toggle">
                <button :class="['toggle-btn', mode === 'user' ? 'active' : '']" @click="mode = 'user'">
                    User
                </button>
                <button :class="['toggle-btn', mode === 'guest' ? 'active' : '']" @click="mode = 'guest'">
                    guest
                </button>
            </div>
            <ul>
                <li v-for="user in (mode === 'user' ? usersWithActive : guestusers)" :key="user.id"
                    @click="selectUser(user, mode)" :class="{ active: activeUser && activeUser.id === user.id }">
                    <img src="../../assets/no_profile_img.png" />
                    <div>{{ user.name }} {{ user.surname }} <span class="status-dot"
                            :class="user.isActive ? 'online' : 'offline'"></span>
                    </div>
                </li>
            </ul>
        </div>

        <div class="chat">
            <div class="header" v-if="activeUser">
                <img src="../../assets/no_profile_img.png" />
                <span>{{ activeUser.name }} {{ activeUser.surname }}</span>
            </div>

            <div class="messages" ref="messagesContainer">
                <div v-if="isTyping" class="typing-indicator">მომხმარებელი წერს...
                </div>
                <div v-for="msg in messages" :key="msg.id" :class="['message', msg.sender === 'me' ? 'admin' : 'user']">
                    <div v-for="(item, index) in msg.attachments" :key="index">
                        <img v-if="item.type === 'restored'" :src="item.media_url">
                        <video v-if="item.type === 'video'" :src="item.media_url" controls playsinline></video>
                        <AudioSim v-if="item.type === 'blob'" :media="item.media_url" />
                    </div>
                    <span v-if="msg.message" :class="['text', msg.sender === 'me' ? 'admin' : 'user']">{{ msg.message
                        }}</span>
                </div>


            </div>

            <input type="file" ref="fileInput" style="display: none" @change="handleFileUpload" multiple>
            <div class="local-image">
                <div v-for="(url, index) in previewUrl" :key="index">
                    <img :src="url" alt="preview" />
                    <span @pointerdown="removeLocalImg(index)">
                        <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px"
                            fill="currentcolor">
                            <path
                                d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                        </svg>
                    </span>
                </div>
            </div>


            <div class="chat-input">
                <svg @pointerdown="triggerFileInput" class="attachment-btn" xmlns="http://www.w3.org/2000/svg"
                    height="30px" viewBox="0 -960 960 960" width="30px" fill="#7c317c">
                    <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                </svg>

                <EmojiPickerComponent v-model="newMessage" />

                <input v-model="newMessage" @input="handleTyping" @keyup.enter="sendMessage"
                    placeholder="Type a message..." />
                <button class="send-button" @click="sendMessage">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"
                        fill="currentColor">
                        <path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Z" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import api from '@/api'
import { ref, onMounted, nextTick, watch, computed } from 'vue'
import { OnlineUser } from '@/components/utils/globalVariable'
import EmojiPickerComponent from '../EmojiPickerComponent.vue';
import AudioSim from '../AudioSim.vue';


const messagesContainer = ref(null);

const users = ref([])
const mode = ref('user');
const guestusers = ref([])
const fileInput = ref(null)
const previewUrl = ref([])
const files = ref([]);
const messages = ref([])
const newMessage = ref('')

const activeUser = ref(null)
const isTyping = ref(false);
const scrollToBottom = () => {
    nextTick(() => {
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
    });
};



const triggerFileInput = () => {
    fileInput.value.click()
}

const handleFileUpload = (event) => {
    files.value = event.target.files
    if (!files.value || !files.value.length) return

    previewUrl.value = []

    Array.from(files.value).forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
            previewUrl.value.push(e.target.result)
            sessionStorage.setItem('previewUrls', JSON.stringify(previewUrl.value))
        }
        reader.readAsDataURL(file)
    })
}
const removeLocalImg = (index) => {
    previewUrl.value.splice(index, 1)
    sessionStorage.setItem('previewUrls', JSON.stringify(previewUrl.value))

}



function selectUser(user, mode) {
    activeUser.value = user
    messages.value = []
    if (mode === "user") {
        getChat(user.id);
        websocket(user.id);

    } else {
        getGuestChat(user.uuid);
        websocket(user.uuid);

    }
}
async function getGuestChat(id) {
    try {
        const response = await api.post(`/getGuestChat`, {
            uuid: id
        }, {
            tokenRequired: true
        })
        messages.value.push(...response.data)
        scrollToBottom()
        // markedAsSeen();


    } catch (error) {
        console.log(error.response);
    }
}
async function markedAsSeen(id) {
    try {
        await api.post(`/markedSeen/${id}`, {}, {
            tokenRequired: true
        });

    } catch (error) {
        console.log(error);
    }
}

let channel = null;
function websocket(id) {

    channel = window.Echo.join(`chat.${id}`);

    channel.listen('.PrivateChatEvent', (e) => {
        console.log(e);
        if (e.sender_id != 1) {
            messages.value.unshift(e)
            markedAsSeen(id);

        }
    });
    channel.listen('.MessageSeen', () => {
        messages.value.forEach(msg => {
            if (!msg.seen) {
                msg.seen = true;
            }
        });
    })
    channel.listenForWhisper('typing', (e) => {
        isTyping.value = e.isTyping;
    });
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
watch(isTyping, () => {
    scrollToBottom()
})

async function getChat(id) {
    try {
        const response = await api.get(`/getChat/${id}`, {
            tokenRequired: true
        })
        messages.value.push(...response.data)

        markedAsSeen(id);

    } catch (error) {
        console.log(error.response);
    }
}
const usersWithActive = computed(() => {
    return users.value.map(user => ({
        ...user,
        isActive: OnlineUser.value.some(u => Number(u.id) === Number(user.id))
    }));
});

async function getUser() {
    try {
        const response = await api.get('admin/users', { tokenRequired: true })

        users.value = response.data;
    } catch (error) {
        console.log(error)
    }
}
async function getGuestUsers() {
    try {
        const response = await api.get('admin/getGuestUsers', { tokenRequired: true })

        guestusers.value = response.data;
    } catch (error) {
        console.log(error)
    }
}

onMounted(() => {
    getUser();
    getGuestUsers();
    const saved = sessionStorage.getItem('previewUrls')
    if (saved) {
        previewUrl.value = JSON.parse(saved)
    }
})


async function sendMessage() {
    if (!newMessage.value.trim()) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const formData = new FormData();
    let reciever_id = mode.value === 'user' ? activeUser.value.id : activeUser.value.uuid;
    let chat_id = mode.value === 'user' ? activeUser.value.id : activeUser.value.uuid;
    formData.append('reciever_id', reciever_id);
    formData.append('chat_id', chat_id);
    formData.append('message', newMessage.value);
    formData.append('sender_id', 1);
    if (files.value && files.value.length > 0) {
        Array.from(files.value).forEach(file => {
            formData.append('attachment[]', file)
        })
    }



    try {
        await api.post('/sendMessage', formData, {
            tokenRequired: true
        })

        messages.value.unshift({
            message: newMessage.value,
            image_urls: files.value,
            sender: 'me',
            time: timeStr,
            seen: false
        });


    } catch (error) {
        console.log(error);
    }
    newMessage.value = '';


}
</script>

<style scoped>
.attachment-btn {
    cursor: pointer;
}

.attachment-btn:hover {
    background-color: #7946792d;
    border-radius: 10px;
}

.local-image {
    display: flex;
    flex-direction: row;
    background-color: #f9fbfd;
    padding: 0 20px;
    gap: 5px;

}

.local-image>div {
    position: relative;
}

.local-image img {
    width: 100px;
    height: 150px;
    object-fit: cover;
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

.status-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
}

.status-dot.online {
    background-color: #4caf50;
}

.status-dot.offline {
    background-color: #f44336;
}

.admin-chat {
    display: flex;
    width: 100%;
    height: 700px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    font-family: 'Inter', sans-serif;
}

.mode-toggle {
    display: flex;
    background-color: rgb(0 0 0 / 15%);
    overflow: hidden;
    border-radius: 12px;
    margin-bottom: 15px;
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


.user-list {
    width: 22%;
    background-color: #f0f4f8;
    padding: 15px;
    border-right: 1px solid #e0e0e0;
    overflow-y: auto;
}

.user-list ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.typing-indicator {
    font-size: 12px;
    color: #666;
    font-style: italic;
    margin-left: 10px;
}

.user-list li {
    padding: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.1s;
}

.user-list li:hover {
    background-color: #e6f0ff;
    transform: translateX(3px);
}

.user-list li.active {
    background-color: #d0e4ff;
    font-weight: 500;
}

.user-list img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
}

.chat {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: #fff;
}

.header {
    display: flex;
    align-items: center;
    padding: 15px;
    background-color: #f7f9fb;
    border-bottom: 1px solid #e0e0e0;
    gap: 10px;
    font-weight: 500;
}

.header img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.messages {
    flex: 1;
    padding: 15px;
    overflow-y: auto;
    background-color: #f9fbfd;
    display: flex;
    flex-direction: column-reverse;
}

.message {
    display: flex;
    flex-direction: column;
    max-width: 70%;
    margin-bottom: 10px;
    padding: 8px 12px;
}

.message img {
    width: 150px;
    height: 200px;
    object-fit: cover;
    border-radius: 12px;
}

.message.user {
    align-self: flex-start;
}

.message.admin {
    align-self: flex-end;
}


.text.user {
    padding: 8px 12px;
    background-color: #e6f0ff;
    border-radius: 12px;


}

.text.admin {
    padding: 8px 12px;
    background-color: #d1ffd6;
    border-radius: 12px;
}

.message .sender {
    font-weight: 500;
    font-size: 0.85rem;
    margin-bottom: 3px;
}

.typing-indicator {
    font-style: italic;
    font-size: 0.85rem;
    color: #555;
    margin: 5px 0;
    align-self: flex-start;
    /* typing ყოველთვის მარცხნივ */
}


.message .text {
    word-break: break-word;
    font-size: 0.95rem;
}

.chat-input {
    position: relative;
    display: flex;
    padding: 12px 15px;
    border-top: 1px solid #e0e0e0;
    align-items: center;
    gap: 10px;
    background-color: #f7f9fb;
}

.chat-input input {
    flex: 1;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 10px 15px;
    font-size: 16px;
    outline: none;
    transition: border-color 0.2s;
}

.chat-input input:focus {
    border-color: #7c317c;
}

.send-button {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    border: none;
    background-color: #7c317c;
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s, transform 0.1s;
}

.send-button:hover {
    background-color: #5b2360;
    transform: scale(1.05);
}
</style>
