<template>
    <div class="wrapper">
        <div class="modal" v-if="openParams">
            <div class="wrapper-fn">
                <!-- Moderation Level -->
                <div>
                    <h3 class="section-title">Moderation Level</h3>
                    <div class="btn-groups">
                        <button @click="updateDetails('moderation_level', 'conservative')" class="btn"
                            :class="{ active: details.moderation_level === 'conservative' }">Conservative</button>
                        <button @click="updateDetails('moderation_level', 'permissive')" class="btn"
                            :class="{ active: details.moderation_level === 'permissive' }">Permissive</button>
                        <button @click="updateDetails('moderation_level', 'none')" class="btn"
                            :class="{ active: details.moderation_level === 'none' }">None</button>
                    </div>
                </div>


                <!-- Garment Photo Type -->
                <div>
                    <h3 class="section-title">Garment Photo Type
                    </h3>
                    <div class="btn-groups">
                        <button @click="updateDetails('garment_photo_type', 'auto')" class="btn"
                            :class="{ active: details.garment_photo_type === 'auto' }">Auto</button>
                        <button @click="updateDetails('garment_photo_type', 'flat-lay')" class="btn"
                            :class="{ active: details.garment_photo_type === 'flat-lay' }">Flat-Lay</button>
                        <button @click="updateDetails('garment_photo_type', 'model')" class="btn"
                            :class="{ active: details.garment_photo_type === 'model' }">Model</button>
                    </div>
                </div>


                <!-- Mode -->
                <div>

                    <h3 class="section-title">Generation Mode</h3>
                    <div class="btn-groups">
                        <button @click="updateDetails('mode', 'performance')" class="btn"
                            :class="{ active: details.mode === 'performance' }">Performance</button>
                        <button @click="updateDetails('mode', 'balanced')" class="btn"
                            :class="{ active: details.mode === 'balanced' }">Balanced</button>
                        <button @click="updateDetails('mode', 'quality')" class="btn"
                            :class="{ active: details.mode === 'quality' }">Quality</button>
                    </div>
                </div>
            </div>

        </div>
        <!-- Upload placeholders -->
        <div class="upload-grid">
            <div class="upload-box">
                <div class="label">მოდელის ფოტო</div>

                <div class="image-placeholder">
                    <div v-if="!ModelResponse.image_url && !generatingModel">3:4 მოდელის ფოტო</div>

                    <div v-else-if="!ModelResponse.image_url && generatingModel" class="spinner-box">
                        <div class="loader-ai"></div>
                    </div>

                    <img v-else :src="ModelResponse.image_url" />
                </div>

            </div>

            <div class="upload-box">
                <div class="label">სამოსის ფოტო</div>
                <div class="image-placeholder">
                    <div v-if="!garmentImage && !UploadGarment" style="display:flex;flex-direction: column;gap: 10px;">
                        <div style="display: flex; justify-content: center;">3:4 სამოსის ფოტო</div>
                        <div class="upload-row">
                            <button class="btn" @click="triggerInputFile"><svg xmlns="http://www.w3.org/2000/svg"
                                    width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                    class="lucide lucide-image-plus h-5 w-5" aria-hidden="true">
                                    <path d="M16 5h6"></path>
                                    <path d="M19 2v6"></path>
                                    <path d="M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5"></path>
                                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                                    <circle cx="9" cy="9" r="2"></circle>
                                </svg> აირჩიე ფოტო</button>
                            <input type="file" ref="fileInput" style="display: none" @change="handleFileUpload"
                                multiple>
                        </div>
                    </div>

                    <div v-else-if="!garmentImage && UploadGarment" class="spinner-box">
                        <div class="loader-ai"></div>
                    </div>
                    <div v-else>
                        <button @pointerdown="removeGarment" class="close-btn">

                            <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px"
                                fill="currentcolor">
                                <path
                                    d="M256-227.69 227.69-256l224-224-224-224L256-732.31l224 224 224-224L732.31-704l-224 224 224 224L704-227.69l-224-224-224 224Z" />
                            </svg>

                        </button>
                        <img :src="previewUrl" />

                    </div>


                </div>
            </div>
        </div>

        <!-- Specs blocks -->
        <div class="image-row" v-if="openmodelImages">
            <img v-for="(item, index) in modelImages" :key="index" :src="item.path"
                :class="{ selected: selectedImage === item.path }"
                @click="selectImage(item.prediction_id, item.path)" />
        </div>
        <div class="specs">
            <div class="spec" v-if="!ModelResponse.image_url && !generatingModel">

                <div class="spec-block">
                    <button class="btn" @click="openPromptModal">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="lucide lucide-sparkles h-4 w-4" aria-hidden="true">
                            <path
                                d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z">
                            </path>
                            <path d="M20 3v4"></path>
                            <path d="M22 5h-4"></path>
                            <path d="M4 17v2"></path>
                            <path d="M5 18H3"></path>
                        </svg> Ai მოდელის გენერაცია
                    </button>
                </div>

                <div class="spec-block">
                    <button @click="retriverModelImages" class="btn">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                            fill="currentcolor">
                            <path
                                d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640H447l-80-80H160v480l96-320h684L837-217q-8 26-29.5 41.5T760-160H160Zm84-80h516l72-240H316l-72 240Zm0 0 72-240-72 240Zm-84-400v-80 80Z" />
                        </svg> მოდელის არჩევა
                    </button>
                </div>
            </div>
            <div v-else class="spec">
                <div class="spec-block">
                    <button class="btn" @click="saveFromUrl">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                            fill="currentColor">
                            <path
                                d="M480-120q-151 0-255.5-46.5T120-280v-400q0-66 105.5-113T480-840q149 0 254.5 47T840-680v400q0 67-104.5 113.5T480-120Zm0-479q89 0 179-25.5T760-679q-11-29-100.5-55T480-760q-91 0-178.5 25.5T200-679q14 30 101.5 55T480-599Zm0 199q42 0 81-4t74.5-11.5q35.5-7.5 67-18.5t57.5-25v-120q-26 14-57.5 25t-67 18.5Q600-528 561-524t-81 4q-42 0-82-4t-75.5-11.5Q287-543 256-554t-56-25v120q25 14 56 25t66.5 18.5Q358-408 398-404t82 4Zm0 200q46 0 93.5-7t87.5-18.5q40-11.5 67-26t32-29.5v-98q-26 14-57.5 25t-67 18.5Q600-328 561-324t-81 4q-42 0-82-4t-75.5-11.5Q287-343 256-354t-56-25v99q5 15 31.5 29t66.5 25.5q40 11.5 88 18.5t94 7Z" />
                        </svg> შენახვა
                    </button>
                </div>

                <div class="spec-block">
                    <button class="btn" @click="deleteModelImage">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                            fill="currentColor">
                            <path
                                d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                        </svg> წაშლა
                    </button>
                </div>
            </div>
            <div class="spec">
                <div class="spec-block ">
                    <div class="btn-group">
                        <button @click="updateDetails('category', 'auto')" class="btn"
                            :class="{ active: category === 'auto' }">Auto</button>
                        <button @click="updateDetails('category', 'tops')" class="btn"
                            :class="{ active: category === 'tops' }"><svg width="18" height="18" viewBox="0 0 18 18"
                                fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4">
                                <path
                                    d="M4.50024 6.75V12.513C4.50024 13.8713 4.50024 14.5508 4.93974 14.973C5.92524 15.9195 11.8922 16.095 13.0607 14.973C13.5002 14.55 13.5002 13.8713 13.5002 12.513V6.75"
                                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                                    stroke-linejoin="round">
                                </path>
                                <path
                                    d="M4.30537 9.00068L2.28337 7.04318C1.76137 6.53693 1.50037 6.28568 1.50037 5.97068C1.50037 5.65718 1.76137 5.40443 2.28262 4.89968L3.78337 3.44768C4.04362 3.19568 4.17337 3.06968 4.32862 2.97743C4.48387 2.88443 4.65862 2.82818 5.00662 2.71568L6.24112 2.31743C6.42112 2.25893 6.51187 2.23043 6.57337 2.26493C6.63487 2.30018 6.65437 2.40068 6.69337 2.60243C6.89587 3.65768 7.85137 4.45643 9.00037 4.45643C10.1494 4.45643 11.1049 3.65768 11.3081 2.60243C11.3464 2.40068 11.3659 2.30018 11.4281 2.26493C11.4881 2.23043 11.5789 2.25893 11.7596 2.31743L12.9941 2.71568C13.3429 2.82818 13.5176 2.88443 13.6721 2.97743C13.8266 3.07043 13.9571 3.19568 14.2174 3.44768L15.7174 4.89968C16.2401 5.40518 16.5004 5.65793 16.5004 5.97143C16.5004 6.28493 16.2394 6.53768 15.7181 7.04243L13.6946 9.00068"
                                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                                    stroke-linejoin="round">
                                </path>
                            </svg> ზედა</button>
                        <button @click="updateDetails('category', 'bottoms')" class="btn"
                            :class="{ active: category === 'bottoms' }"><svg width="16" height="16" viewBox="0 0 16 16"
                                fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4">
                                <path
                                    d="M12.1067 3.33398V2.66732C12.1067 2.03865 12.1067 1.72465 11.9067 1.52932C11.7061 1.33398 11.3834 1.33398 10.7381 1.33398H5.26207C4.61673 1.33398 4.29407 1.33398 4.0934 1.52932C3.89273 1.72465 3.8934 2.03865 3.8934 2.66732V3.33398M12.1067 3.33398L13.8767 13.102C14.0081 13.8287 14.0741 14.1907 13.8687 14.4287C13.6641 14.6673 13.2854 14.6673 12.5287 14.6673H11.7487C11.2621 14.6673 11.0181 14.6673 10.8367 14.5367C10.6554 14.4067 10.5834 14.18 10.4407 13.726L9.30873 10.1427C8.7734 8.44732 8.5054 7.60065 8.00007 7.60065C7.49473 7.60065 7.22673 8.44798 6.6914 10.1427L5.56007 13.726C5.41673 14.1793 5.3454 14.406 5.16407 14.5367C4.98273 14.6673 4.73807 14.6673 4.25073 14.6673H3.4714C2.71473 14.6673 2.33607 14.6673 2.1314 14.4293C1.92607 14.1907 1.9914 13.828 2.1234 13.1027L3.8934 3.33398M12.1067 3.33398H3.8934"
                                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                                    stroke-linejoin="round">
                                </path>
                                <path d="M6.6665 5.18598L7.99984 3.33398L9.99984 6.66732" stroke="currentColor"
                                    stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg> ქვედა</button>
                        <button @click="updateDetails('category', 'one-pieces')" class="btn"
                            :class="{ active: category === 'one-pieces' }"><svg width="13" height="16"
                                viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M8.11126 2.66927L6.11126 4.0026L4.11126 2.66927M8.11126 2.66927C8.5026 3.0086 9.39793 3.53127 9.44193 4.09994C9.46193 4.34594 9.35926 4.4806 9.1526 4.74994C8.70326 5.33727 8.19126 5.6826 8.19126 6.66927H4.03126C4.03126 5.68327 3.51926 5.33727 3.06993 4.74994C2.86393 4.4806 2.7606 4.3466 2.77993 4.09994C2.8246 3.53127 3.7206 3.00927 4.11126 2.66927M8.11126 2.66927V1.33594M4.11126 2.66927V1.33594M11.3533 11.8746C10.8839 10.0813 9.6886 8.43594 8.8986 7.49394C8.33193 6.81794 7.91393 6.66927 7.02526 6.66927H5.19793C4.3086 6.66927 3.8906 6.81794 3.32393 7.49394C2.53393 8.43594 1.3386 10.0806 0.869262 11.8746C0.582596 12.9693 0.971929 13.5686 2.03593 13.9559C2.99126 14.3039 4.40193 14.6693 6.11126 14.6693C7.8206 14.6693 9.2306 14.3039 10.1866 13.9559C11.2506 13.5693 11.6399 12.9693 11.3533 11.8746Z"
                                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                                    stroke-linejoin="round">
                                </path>
                                <path
                                    d="M7.44458 10.002C7.44458 10.002 8.77791 12.002 8.77791 14.3353M4.77791 10.002C4.77791 10.002 3.44458 12.002 3.44458 14.3353"
                                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                                    stroke-linejoin="round">
                                </path>
                            </svg> სრული</button>
                    </div>
                </div>
            </div>

        </div>
        <div class="modal-prompt-c" v-if="openPrompt">
            <div class="modal-prompt">
                <input type="text" v-model="prompt" placeholder="Enter prompt..." />
                <button class="generate-btn" @click="generateAiModel"> <svg xmlns="http://www.w3.org/2000/svg"
                        width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles h-4 w-4"
                        aria-hidden="true">
                        <path
                            d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z">
                        </path>
                        <path d="M20 3v4"></path>
                        <path d="M22 5h-4"></path>
                        <path d="M4 17v2"></path>
                        <path d="M5 18H3"></path>
                    </svg> გენერაცია</button>
            </div>
        </div>
        <!-- Action buttons -->
        <div class="actions">
            <button @click="tryOn" class="action-btn gen"><svg xmlns="http://www.w3.org/2000/svg" height="24px"
                    viewBox="0 -960 960 960" width="24px" fill="currentcolor">
                    <path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z" />
                </svg> გენერაციის დაწყება</button>
            <button @click="openParamModal" class="action-btn param"><svg xmlns="http://www.w3.org/2000/svg"
                    height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor">
                    <path
                        d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
                </svg> პარამეტრები</button>
        </div>
    </div>
</template>

<script setup>
import api from '@/api';
import { onMounted, reactive, ref } from 'vue';

const fileInput = ref(null)

const openParams = ref(false);
const openPrompt = ref(false);
const generatingModel = ref(false);
const UploadGarment = ref(false);
const prompt = ref('');
const modelImages = ref([]);
const garmentImage = ref(null);
const previewUrl = ref(null);
const category = ref('auto')
const openmodelImages = ref(false);
const ModelResponse = reactive({
    prediction_id: null,
    error: null,
    image_url: null,
    status: null
});
const details = reactive({
    moderation_level: 'permissive',
    garment_photo_type: 'auto',
    mode: 'quality'
});
function selectImage(id, path) {
    ModelResponse.prediction_id = id
    ModelResponse.error = null
    ModelResponse.image_url = path
    ModelResponse.status = 'completed'
}

function deleteModelImage() {
    ModelResponse.prediction_id = null
    ModelResponse.error = null
    ModelResponse.image_url = null
    ModelResponse.status = null

}
function removeGarment() {
    previewUrl.value = null
    garmentImage.value = null
}

function updateDetails(type, value) {
    if (type === 'category') {
        category.value = value;
        return;
    }
    details[type] = value;

    localStorage.setItem('aisettings', JSON.stringify(details));
}
onMounted(() => {
    const saved = localStorage.getItem('aisettings');
    if (saved) {
        Object.assign(details, JSON.parse(saved));
    }
});

function triggerInputFile() {
    fileInput.value.click();
}

function websocket() {
    console.log('channel open');
    window.Echo.channel('model.generated')
        .listen('.ModelGenerated', (e) => {
            console.log('AI WS event:', e.id);
            if (e.model_name === 'model-create') {
                ModelResponse.image_url = e.image_url;
                ModelResponse.status = e.status;
                ModelResponse.prediction_id = e.id;
                ModelResponse.error = e.error;
            } else {
                previewUrl.value = e.image_url
            }

            generatingModel.value = false;
        });
}
async function saveFromUrl() {
    try {
        console.log(ModelResponse.path);
        const res = await api.post('/ai/saveFromUrl', {
            prediction_id: ModelResponse.prediction_id,
            cndUrl: ModelResponse.image_url
        })
        console.log(res);

    } catch (error) {
        console.log(error);
    }
}

async function retriverModelImages() {
    openmodelImages.value = !openmodelImages.value;
    if (openmodelImages.value == true) {
        try {
            const res = await api.get('/ai/retriverModelImages')
            modelImages.value = res.data;
            openmodelImages.value = true;

        } catch (error) {
            console.log(error);
        }
    }


}
async function generateAiModel() {
    try {
        generatingModel.value = true;
        openPrompt.value = false;
        websocket();

        // const res = await api.post('/ai/generateModel', { prompt: prompt.value });
        // console.log(res);

    } catch (error) {
        console.log(error);
    }
}


const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    garmentImage.value = file;

    const reader = new FileReader();
    reader.onload = (e) => {
        previewUrl.value = e.target.result;
    };

    reader.readAsDataURL(file);
};

function openParamModal() {
    openParams.value = !openParams.value
}
function openPromptModal() {
    openPrompt.value = !openPrompt.value

}

async function tryOn() {
    try {

        const res = await api.post('/ai/tryOn', {
            ...details, category: category.value, modelImage: ModelResponse.image_url, modelGarment: previewUrl.value
        });
        console.log(res);
    } catch (error) {
        console.log(error);
    }
}
</script>

<style scoped>
.image-row {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    padding: 8px 4px;
}

.image-row::-webkit-scrollbar {
    display: none;
}

.image-row img {
    height: 220px;
    width: auto;
    border-radius: 12px;
    object-fit: cover;
    flex-shrink: 0;
    transition: 0.2s;
    cursor: pointer;
    border: 3px solid transparent;
}

.image-row img:hover {
    transform: scale(1.04);
}

.image-row img.selected {
    border-color: black;
    /* შეგიძლია სხვა ფერიც */
    transform: scale(1.06);
}

.close-btn {
    right: 20px;
    opacity: 0.5;
    position: absolute;
    background: none;
    border: none;
    z-index: 50;
    top: 20px;
    font-size: 20px;
    cursor: pointer;
    transition: opacity 0.2s;

}

.modal-prompt-c {
    position: fixed;
    left: 35%;
    bottom: 130px;
    transform: translate(-50%, -50%);
    width: 360px;
    background: #fff;
    border-radius: 16px;
    border: 1.5px solid rgba(0, 0, 0, 0.15);
    padding: 20px;
    z-index: 1000;
}

/* Prompt + buttons container */
.modal-prompt {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
}

/* Input field */
.modal-prompt input {
    width: 100%;
    height: 44px;
    border: 2px solid rgba(0, 0, 0, 0.12);
    border-radius: 12px;
    font-size: 15px;
    text-indent: 10px;
    outline: none;
    transition: 0.2s;
}

.modal-prompt input:focus {
    border-color: #222;
}

/* Generate button */
.generate-btn {
    width: 100%;
    height: 44px;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgb(211, 214, 73);
    border-radius: 12px;
    gap: 10px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: 0.2s;
}

.generate-btn:hover {
    background: rgb(186, 188, 70);
}

.modal {
    position: fixed;
    right: 100px;
    bottom: 110px;
    width: 200px;
    height: 50vh;
    background: #f7f7f7;
    border-radius: 16px;
    border: 1.5px solid rgba(0, 0, 0, 0.15);
    padding: 14px;
    z-index: 9999;

    overflow-y: auto;
}

.modal::-webkit-scrollbar {
    display: none;
}

.modal::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.25);
    border-radius: 6px;
}


.wrapper-fn {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 200px;
    margin: 0 auto;
    padding: 16px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.section-title {
    font-size: 16px;
    font-weight: 700;
    margin: 20px 0 8px;
    color: #222;
    border-bottom: 1px solid rgba(0, 0, 0, 0.07);
    padding-bottom: 6px;
    text-align: center;
}

.btn-groups {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    margin-bottom: 12px;
}

.btn {
    border: 1.5px solid rgba(0, 0, 0, 0.1);
    background: #f5f5f5;
    padding: 10px 14px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s;
    color: #333;
    min-width: 110px;
}

.btn.active {
    background: #222;
    color: #fff;
}

.wrapper {
    margin: 0 auto;
    border-radius: 18px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}



.upload-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-bottom: 18px;
}

.upload-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
}


.image-placeholder {
    width: 400px;
    height: 500px;
    border: 1.5px dashed rgba(0, 0, 0, 0.15);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.45);
    background: #fafafa;
    overflow: hidden;
    position: relative;
    z-index: 1;
}

.image-placeholder img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    inset: 0;
    z-index: 2;
}

/* spinner block იგივე ცენტრში რომ იჯდეს */
.spinner-box {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 700;
    color: #222;
    z-index: 3;
}

.loader-ai {
    width: 38px;
    height: 38px;
    border: 2px solid rgba(0, 0, 0, 0.07);
    border-top: 2px solid #222;
    border-bottom: 2px solid #222;
    border-radius: 50%;
    animation: spin 1.5s ease infinite;
    margin: 0 auto;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}



.upload-row {
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: center;
    font-size: 14px;
    font-weight: 600;
}



.specs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 18px;
}

.spec {
    display: flex;
    justify-content: center;
    gap: 10px;
}

.spec-block {
    display: flex;
    gap: 4px;
    padding: 10px;
    border-radius: 12px;
}

.btn-group {
    display: flex;
    gap: 8px;
    justify-content: center;
}



.btn.active {
    background: #b4a069 !important;
    color: white !important;
}

.spec-block .btn:hover {
    background: #eee;
}

.spec-block .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    border: none;
    background: #f5f5f5;
    color: #57534e;
    padding: 12px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
}

/* .value {
    font-size: 14px;
    font-weight: 500;
    color: #222;
} */

.actions {
    display: flex;
    justify-content: space-between;
    padding: 0 60px;
}

.action-btn {
    padding: 12px;
    border-radius: 14px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #111;
    transition: 0.2s;
}

.action-btn.gen {
    background: #b4a069;
    color: #f7f7f7;
}

.action-btn.gen:hover {
    background: #bbaa7a;

}

.action-btn.param {
    background: #f7f7f7;
    gap: 5px;
}

.action-btn:hover {
    background: #eee;
}
</style>
