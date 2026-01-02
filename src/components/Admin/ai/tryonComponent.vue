<template>
    <section class="studio">
        <div class="row">
            <!-- MODEL -->
            <article class="panel">
                <div class="panel-top">
                    <div class="panel-title"><span class="badge">1</span><span>Model</span></div>
                    <span class="hint">upload</span>
                </div>

                <div class="upload-row">
                    <input ref="modelInput" class="file-hidden" type="file" accept="image/*" @change="onUpload" />
                    <button class="upload-btn" type="button" @click="modelInput?.click()">
                        Upload model photo
                    </button>
                    <button class="btn ghost small" type="button" :disabled="!selectedModel" @click="clear('model')">
                        Clear
                    </button>
                </div>

                <div class="preview">
                    <div class="preview-box tall">
                        <div v-if="!selectedModel" class="placeholder">აირჩიე მოდელის ფოტო</div>
                        <img v-else :src="selectedModel" alt="selected model" />
                    </div>
                </div>
            </article>

            <!-- GARMENT -->
            <article class="panel garment">
                <div class="panel-top">
                    <div class="panel-title"><span class="badge">2</span><span>Garment</span></div>
                    <span class="hint">upload</span>
                </div>

                <div class="link-row">
                    <input v-model="garmentLinkInput" class="link-input" type="url" placeholder="Product link" />
                    <button @click="FromLinkGetImage" v-if="garmentLink" class="link-open" target="_blank"
                        rel="noreferrer"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                            width="24px" fill="#e3e3e3">
                            <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
                        </svg>
                    </button>
                </div>

                <div class="preview">
                    <div class="preview-box tall">
                        <div v-if="!selectedGarment" class="placeholder">აირჩიე სამოსის ფოტო</div>
                        <img v-else :src="selectedGarment" alt="selected garment" />
                    </div>
                </div>
            </article>

            <!-- RESULT -->
            <article class="panel">
                <div class="panel-top">
                    <div class="panel-title"><span class="badge badge-gold">3</span><span>Result</span></div>

                    <div class="mini-actions">
                        <button class="btn ghost" type="button" :disabled="!selectedResult" @click="downloadResult">
                            Download
                        </button>
                        <button class="btn primary" :disabled="!canGenerate || generating" type="button" @click="tryon">
                            {{ generating ? "Generating..." : "Generate" }}
                        </button>
                    </div>
                </div>
                <div class="upload-row">

                    <button class="btn ghost small" type="button" :disabled="!selectedModel" @click="clear('model')">
                        Clear
                    </button>
                </div>

                <div class="preview">

                    <div class="preview-box tall">
                        <div v-if="!selectedResult" class="placeholder">
                            შედეგი აქ გამოჩნდება — Generate-ის შემდეგ.
                        </div>
                        <img v-else :src="selectedResult" alt="ai result" />
                    </div>
                </div>
            </article>
        </div>
    </section>
</template>

<script setup>
import api from "@/api";
import { ref, computed, onBeforeUnmount } from "vue";

const selectedModel = ref(null);
const selectedGarment = ref(null);
const selectedResult = ref(null);

const garmentLinkInput = ref("");
const generating = ref(false);

const modelInput = ref(null);

const canGenerate = computed(() => !!selectedModel.value && !!selectedGarment.value);
const garmentLink = computed(() => garmentLinkInput.value || "");

// რომ არ დაგიგროვდეს memory (objectURL)
const urls = {
    model: null,
    garment: null,
    result: null,
};

async function FromLinkGetImage() {
    try {
        const res = await api.post('/FromLinkGetImage', { link: garmentLinkInput.value });
        selectedGarment.value = res.data;
    } catch (error) {
        console.log(error);
    }
}



function onUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    selectedModel.value = file;

    const reader = new FileReader();
    reader.onload = (e) => {
        selectedModel.value = e.target.result;
    };

    reader.readAsDataURL(file);

}




async function tryon() {

    // const base64Model = await toBase64(modelInput.value);
    console.log(selectedGarment.value);

    // if (!canGenerate.value) return;
    // generating.value = true;
    // try {
    //     const res = await api.post("/tryon", {
    //         model_image: modelBase64,
    //         garment_image: garmentBase64,
    //     });

    // } finally {
    //     generating.value = false;
    // }
}
function downloadResult() {
    if (!selectedResult.value) return;
    const a = document.createElement("a");
    a.href = selectedResult.value;
    a.download = "tryon-result.jpg";
    document.body.appendChild(a);
    a.click();
    a.remove();
}

onBeforeUnmount(() => {
    Object.values(urls).forEach((u) => u && URL.revokeObjectURL(u));
});
</script>

<style scoped>
/* Base */
.studio {
    padding: 22px 16px 26px;
    color: #1a1a1a;
    background: #faf7f2;
}

.row {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    align-items: start;
}

@media (max-width: 1100px) {
    .row {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 760px) {
    .row {
        grid-template-columns: 1fr;
    }
}

/* Panels */
.panel {
    background: #fff;
    border: 1px solid rgba(120, 95, 60, 0.14);
    border-radius: 22px;
    padding: 14px;
    box-shadow: 0 18px 44px rgba(40, 30, 18, 0.07);
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.panel-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}

.panel-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 950;
    color: #151515;
}

.badge {
    width: 28px;
    height: 28px;
    display: grid;
    place-items: center;
    border-radius: 999px;
    background: #162e63;
    color: #fff;
    font-size: 12px;
    box-shadow: 0 10px 18px rgba(26, 26, 26, 0.10);
}


.hint {
    color: rgba(26, 26, 26, 0.50);
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.4px;
    text-transform: uppercase;
}

/* Upload row */
.upload-row {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    align-items: center;
}

.file-hidden {
    display: none;
}

.upload-btn {
    flex: 1;
    height: 42px;
    border-radius: 14px;
    border: 1px dashed rgba(167, 122, 47, 0.55);
    background: rgba(250, 247, 240, 0.95);
    color: rgba(26, 26, 26, 0.88);
    font-weight: 950;
    font-size: 13px;
    cursor: pointer;
    transition: 0.18s ease;
    box-shadow: 0 10px 20px rgba(40, 30, 18, 0.05);
}

.upload-btn:hover {
    transform: translateY(-1px);
    border-color: rgba(167, 122, 47, 0.85);
}

/* Link row */
.link-row {
    display: flex;
    gap: 10px;
    align-items: center;
}

.link-input {
    flex: 1;
    height: 40px;
    border-radius: 14px;
    border: 1px solid rgba(120, 95, 60, 0.16);
    background: rgba(250, 247, 240, 0.85);
    padding: 0 12px;
    font-weight: 800;
    font-size: 12px;
    color: rgba(26, 26, 26, 0.78);
    outline: none;
    box-shadow: 0 12px 22px rgba(40, 30, 18, 0.05);
}

.link-input:focus {
    border-color: rgba(167, 122, 47, 0.45);
}

.link-open {
    height: 40px;
    padding: 0 14px;
    border-radius: 14px;
    text-decoration: none;
    font-weight: 950;
    font-size: 12px;
    color: #fff;
    background: #162e63;
    border: 1px solid rgba(120, 95, 60, 0.26);
    box-shadow: 0 12px 22px rgba(167, 122, 47, 0.12);
    display: grid;
    place-items: center;
    white-space: nowrap;
}

@media (max-width: 480px) {
    .link-row {
        flex-direction: column;
        align-items: stretch;
    }

    .link-open {
        width: 100%;
    }

    .upload-row {
        flex-direction: column;
        align-items: stretch;
    }
}

/* Preview */
.preview {
    display: flex;
    flex-direction: column;
}

.preview-box {
    width: 100%;
    border-radius: 22px;
    overflow: hidden;
    border: 1px solid rgba(120, 95, 60, 0.16);
    background: rgba(250, 247, 240, 0.7);
    display: grid;
    place-items: center;
    box-shadow: 0 18px 34px rgba(40, 30, 18, 0.07);
}

.preview-box.tall {
    height: 600px;
}


.preview-box img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    animation: pop 0.22s ease;
}

@keyframes pop {
    from {
        opacity: 0;
        transform: scale(0.985);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

.placeholder {
    color: rgba(26, 26, 26, 0.62);
    font-weight: 950;
    font-size: 14px;
    /* უფრო დიდი რომ კარგად ჩანდეს */
    text-align: center;
    padding: 18px;
}

/* Buttons */
.btn {
    border: 1px solid rgba(120, 95, 60, 0.22);
    background: rgba(255, 255, 255, 0.92);
    color: #1a1a1a;
    border-radius: 14px;
    padding: 10px 14px;
    font-weight: 900;
    font-size: 14px;
    cursor: pointer;
    transition: 0.18s ease;
    box-shadow: 0 10px 24px rgba(40, 30, 18, 0.06);
    white-space: nowrap;
}

.btn.small {
    padding: 9px 12px;
    font-size: 13px;
}

.btn:hover {
    transform: translateY(-1px);
    border-color: rgba(120, 95, 60, 0.36);
}

.btn:active {
    transform: translateY(0);
}

.btn.primary {
    border: 1px solid rgba(120, 95, 60, 0.34);
    background: linear-gradient(180deg, #c8a25c 0%, #a77a2f 100%);
    color: #fff;
    box-shadow: 0 14px 28px rgba(167, 122, 47, 0.18);
}

.btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
}

.mini-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: flex-end;
}
</style>
