<template>
    <div v-if="open" class="overlay" role="dialog" aria-modal="true" aria-label="სურათის მოდალი"
        @click.self="closeModal">
        <div class="modal" ref="modalRoot">
            <!-- Close -->
            <button class="close-btn" @click="closeModal" aria-label="დახურვა" ref="closeBtn">
                <img src="../assets//svg/close.svg" alt="" />
            </button>

            <div class="viewer">
                <!-- Prev -->
                <button class="nav-btn nav-btn--prev" @click="prev" aria-label="წინა სურათი">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>

                <!-- Zoom/Pan stage -->
                <div class="stage" ref="stage" @pointerdown="onPointerDown" @pointermove="onPointerMove"
                    @pointerup="onPointerUp" @pointercancel="onPointerUp" @wheel.prevent="onWheel"
                    @dblclick.prevent="onDblclick">
                    <img :src="localSelectedImage" :alt="name || 'Product image'" ref="img" class="img"
                        draggable="false" :style="{
                            '--tx': tx + 'px',
                            '--ty': ty + 'px',
                            '--s': scale
                        }" @load="onImgLoad" @click="onSingleClick" />
                </div>

                <!-- Next -->
                <button class="nav-btn nav-btn--next" @click="next" aria-label="შემდეგი სურათი">
                    <i class="fa-solid fa-chevron-right"></i>
                </button>
            </div>

            <!-- Controls -->
            <div class="controls">
                <button class="ctl-btn" @click="fit" :disabled="fitDisabled" title="Fit">
                    <i class="fa-solid fa-minimize"></i>
                </button>
                <button class="ctl-btn" @click="zoomOut" title="Zoom out">
                    <i class="fa-solid fa-magnifying-glass-minus"></i>
                </button>
                <button class="ctl-btn" @click="zoomIn" title="Zoom in">
                    <i class="fa-solid fa-magnifying-glass-plus"></i>
                </button>
                <button class="ctl-btn" @click="reset" title="Reset">
                    <i class="fa-solid fa-rotate-left"></i>
                </button>
            </div>

            <!-- Sidebar -->
            <div class="info">
                <h3 class="title" :title="name">{{ name }}</h3>

                <div class="thumbnail-container" role="listbox" aria-label="სურათების წინასწარ ჩვენება"
                    :class="{ 'thumbs-horizontal': isMobile }" ref="thumbs">
                    <button v-for="(image, index) in images" :key="index" class="thumbnail-item"
                        :class="{ active: image === localSelectedImage }" @click="setSelectedImage(image)"
                        @keydown.enter.prevent="setSelectedImage(image)" :aria-label="`სურათი ${index + 1}`"
                        :aria-selected="image === localSelectedImage">
                        <img :src="image" alt="Thumbnail" class="thumbnail-image" draggable="false" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
const MIN_SCALE = 0.5;
const MAX_SCALE = 4;
const WHEEL_ZOOM_STEP = 0.12;
const DBLCLICK_ZOOM_STEP = 0.8;
const BTN_ZOOM_STEP = 0.25;

export default {
    name: 'ImageComponent',
    props: {
        open: { type: Boolean, default: false },
        name: { type: String, default: '' },
        selectedImage: { type: String, required: true },
        images: { type: Array, required: true }
    },
    data() {
        return {
            localSelectedImage: this.selectedImage,
            isMobile: false,
            // transform state
            scale: 1,
            tx: 0,
            ty: 0,
            naturalW: 0,
            naturalH: 0,
            stageW: 0,
            stageH: 0,
            // pointer state
            isDragging: false,
            lastPX: 0,
            lastPY: 0,
            // single vs double click timer
            clickTimer: null,
            imgLoadedOnce: false
        };
    },
    computed: {
        fitDisabled() {
            const s = this.fitScale();
            return Math.abs(this.scale - s) < 0.02 && Math.abs(this.tx) < 1 && Math.abs(this.ty) < 1;
        }
    },
    watch: {
        selectedImage(v) {
            this.localSelectedImage = v;
            this.$nextTick(() => this.reset(true));
        },
        open(v) {
            if (v) this.onOpen();
            else this.onClose();
        }
    },
    mounted() {
        this.isMobile = window.innerWidth <= 768;
        window.addEventListener('resize', this.onResize, { passive: true });
        window.addEventListener('keydown', this.onKey, { passive: false });
        if (this.open) this.onOpen();
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.onResize);
        window.removeEventListener('keydown', this.onKey);
        document.body.style.overflow = '';
    },
    methods: {
        onOpen() {
            document.body.style.overflow = 'hidden';
            this.$nextTick(() => {
                this.measureStage();
                this.$refs.closeBtn?.focus?.();
                this.reset(true);
            });
        },
        onClose() { document.body.style.overflow = ''; },
        closeModal() { this.$emit('update:open', false); },

        /* ---------- keyboard ---------- */
        onKey(e) {
            if (!this.open) return;
            if (e.key === 'Escape') { e.preventDefault(); this.closeModal(); }
            else if (e.key === 'ArrowRight') { e.preventDefault(); this.next(); }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); this.prev(); }
            else if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '+')) { e.preventDefault(); this.zoomIn(); }
            else if ((e.ctrlKey || e.metaKey) && (e.key === '-')) { e.preventDefault(); this.zoomOut(); }
            else if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === '0')) { e.preventDefault(); this.reset(); }
        },

        /* ---------- measure ---------- */
        onResize() {
            this.isMobile = window.innerWidth <= 768;
            this.measureStage();
            this.fit();
        },
        onImgLoad(e) {
            const img = e.target;
            this.naturalW = img.naturalWidth || img.width;
            this.naturalH = img.naturalHeight || img.height;
            if (!this.imgLoadedOnce) {
                this.imgLoadedOnce = true;
            }
            this.reset(true);
        },
        measureStage() {
            const stage = this.$refs.stage;
            if (!stage) return;
            const r = stage.getBoundingClientRect();
            this.stageW = r.width;
            this.stageH = r.height;
        },

        /* ---------- transforms ---------- */
        fitScale() {
            if (!this.naturalW || !this.naturalH || !this.stageW || !this.stageH) return 1;
            const scaleX = this.stageW / this.naturalW;
            const scaleY = this.stageH / this.naturalH;
            return Math.min(scaleX, scaleY);
        },
        clampScale(s) { return Math.min(MAX_SCALE, Math.max(MIN_SCALE, s)); },
        clampTranslate(tx, ty, s = this.scale) {
            // ელემენტი ცენტრზეა გაჩერებული (left/top 50% + translate(-50%,-50%)), ამიტომ ბალანსირებას ვაკეთებთ ნახევრებით
            const halfW = (this.naturalW * s) / 2;
            const halfH = (this.naturalH * s) / 2;
            const maxX = Math.max(0, halfW - this.stageW / 2);
            const maxY = Math.max(0, halfH - this.stageH / 2);
            return {
                tx: Math.min(maxX, Math.max(-maxX, tx)),
                ty: Math.min(maxY, Math.max(-maxY, ty))
            };
        },
        applyTransform({ s = this.scale, tx = this.tx, ty = this.ty }) {
            const clampedS = this.clampScale(s);
            const { tx: CTX, ty: CTY } = this.clampTranslate(tx, ty, clampedS);
            this.scale = clampedS;
            this.tx = CTX; this.ty = CTY;
        },
        screenToImage(x, y) {
            // stage coords -> image local coords (გათვლილია იმაზე, რომ სურათი ცენტრშია)
            const stageRect = this.$refs.stage.getBoundingClientRect();
            const cx = stageRect.left + this.stageW / 2 + this.tx;
            const cy = stageRect.top + this.stageH / 2 + this.ty;
            const dx = x - cx;
            const dy = y - cy;
            return { ix: dx / this.scale, iy: dy / this.scale };
        },
        zoomAt(clientX, clientY, deltaScale) {
            const { ix, iy } = this.screenToImage(clientX, clientY);
            const newScale = this.clampScale(this.scale * deltaScale);

            const stageRect = this.$refs.stage.getBoundingClientRect();
            const centerX = stageRect.left + this.stageW / 2;
            const centerY = stageRect.top + this.stageH / 2;

            const targetX = clientX - ix * newScale;
            const targetY = clientY - iy * newScale;

            const newTx = targetX - centerX;
            const newTy = targetY - centerY;

            this.applyTransform({ s: newScale, tx: newTx, ty: newTy });
        },

        onSingleClick(e) {
            if (this.clickTimer) return;
            this.clickTimer = setTimeout(() => {
                this.clickTimer = null;
                const fitS = this.fitScale();
                if (Math.abs(this.scale - fitS) < 0.05) {
                    this.zoomAt(e.clientX, e.clientY, Math.max(1 / fitS, 1.0));
                } else {
                    this.fit();
                }
            }, 180);
        },
        onDblclick(e) {
            if (this.clickTimer) { clearTimeout(this.clickTimer); this.clickTimer = null; }
            this.zoomAt(e.clientX, e.clientY, 1 + DBLCLICK_ZOOM_STEP);
        },
        onWheel(e) {
            const delta = e.deltaY > 0 ? (1 - WHEEL_ZOOM_STEP) : (1 + WHEEL_ZOOM_STEP);
            this.zoomAt(e.clientX, e.clientY, delta);
        },
        onPointerDown(e) {
            e.currentTarget.setPointerCapture?.(e.pointerId);
            this.isDragging = true;
            this.lastPX = e.clientX;
            this.lastPY = e.clientY;
        },
        onPointerMove(e) {
            if (!this.isDragging) return;
            const dx = e.clientX - this.lastPX;
            const dy = e.clientY - this.lastPY;
            this.lastPX = e.clientX; this.lastPY = e.clientY;
            this.applyTransform({ tx: this.tx + dx, ty: this.ty + dy });
        },
        onPointerUp(e) {
            this.isDragging = false;
            e.currentTarget.releasePointerCapture?.(e.pointerId);
        },

        /* ---------- controls ---------- */
        zoomIn() { this.applyTransform({ s: this.scale * (1 + BTN_ZOOM_STEP) }); },
        zoomOut() { this.applyTransform({ s: this.scale * (1 - BTN_ZOOM_STEP) }); },
        fit() {
            const s = this.fitScale();
            this.applyTransform({ s, tx: 0, ty: 0 });
        },
        reset() {
            const s = this.fitScale();
            this.scale = s; this.tx = 0; this.ty = 0;
        },

        /* ---------- thumbs ---------- */
        setSelectedImage(image) {
            this.localSelectedImage = image;
            this.$emit('update:selectedImage', image);
            this.$nextTick(() => this.reset());
            const idx = this.images.indexOf(image);
            this.scrollThumbIntoView(idx);
        },
        next() {
            const i = this.images.indexOf(this.localSelectedImage);
            const ni = (i + 1) % this.images.length;
            this.setSelectedImage(this.images[ni]);
        },
        prev() {
            const i = this.images.indexOf(this.localSelectedImage);
            const ni = (i - 1 + this.images.length) % this.images.length;
            this.setSelectedImage(this.images[ni]);
        },
        scrollThumbIntoView(index) {
            const thumbs = this.$refs.thumbs;
            if (!thumbs) return;
            const el = thumbs.children?.[index];
            el?.scrollIntoView?.({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
        }
    }
};
</script>

<style scoped>
.overlay {
    --overlay: rgba(0, 0, 0, .6);
    --modal-bg: #ffffff;
    --border: #e6e6e6;
    --brand: #7a1dff;
}

.overlay {
    position: fixed;
    inset: 0;
    background: var(--overlay);
    display: grid;
    place-items: center;
    z-index: 1000;
    padding: 16px;
}

.modal {
    background: var(--modal-bg);
    width: min(1100px, 100%);
    border-radius: 14px;
    padding: 20px 16px 16px;
    display: grid;
    grid-template-columns: 1fr 280px;
    gap: 16px;
    position: relative;
    box-shadow: 0 12px 32px rgba(0, 0, 0, .25);
}

.close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 20px;
    background: none;
    z-index: 1001;
    border: none;
    cursor: pointer;
}

.close-btn img {
    width: 28px;
    height: 28px;
    padding: 6px;
    border-radius: 50%;
}

/* Viewer */
.viewer {
    position: relative;
    display: grid;
    align-items: center;
    grid-template-columns: 48px 1fr 48px;
    gap: 8px;
}

.nav-btn {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    border: 1px solid var(--border);
    background: #fff;
    color: #111;
    display: grid;
    place-items: center;
    cursor: pointer;
    transition: box-shadow .15s, transform .08s;
}

.nav-btn:hover {
    box-shadow: 0 0 0 6px rgba(122, 29, 255, .12);
}

.nav-btn:active {
    transform: translateY(1px);
}

.nav-btn--prev {
    justify-self: start;
}

.nav-btn--next {
    justify-self: end;
}

/* Stage */
.stage {
    position: relative;
    overflow: hidden;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: #fff;
    height: min(80vh, 720px);
    touch-action: none;
    cursor: grab;
}

.stage:active {
    cursor: grabbing;
}

/* Image centered + transformed by CSS variables */
.img {
    position: absolute;
    left: 50%;
    top: 50%;
    transform:
        translate(-50%, -50%) translate3d(var(--tx), var(--ty), 0) scale(var(--s));
    transform-origin: center center;
    user-select: none;
    pointer-events: auto;
    display: block;
    max-width: none;
}

/* Controls */
.controls {
    position: absolute;
    left: 38%;
    bottom: 20px;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
    background: rgba(255, 255, 255, .9);
    border: 1px solid var(--border);
    backdrop-filter: blur(6px);
    border-radius: 999px;
    padding: 6px;
}

.ctl-btn {
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 999px;
    cursor: pointer;
    transition: box-shadow .15s, transform .08s;
}

.ctl-btn:hover {
    box-shadow: 0 0 0 6px rgba(122, 29, 255, .12);
}

.ctl-btn:active {
    transform: translateY(1px);
}

.ctl-btn[disabled] {
    opacity: .5;
    cursor: not-allowed;
}

/* Sidebar */
.info {
    padding-top: 4px;
    display: grid;
    grid-template-rows: auto 1fr;
    gap: 12px;
}

.title {
    font-size: 16px;
    font-weight: 800;
    color: #111;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* Thumbnails */
.thumbnail-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
    height: min(72vh, 560px);
    overflow: auto;
    padding-right: 4px;
}

.thumbnail-container.thumbs-horizontal {
    flex-direction: row;
    height: auto;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 8px 2px;
}

.thumbnail-item {
    width: 64px;
    height: 64px;
    border: 2px solid transparent;
    border-radius: 10px;
    background: #fff;
    cursor: pointer;
    flex: 0 0 auto;
    transition: transform .15s, border-color .15s;
}

.thumbnail-item:hover {
    transform: translateY(-1px);
}

.thumbnail-item.active {
    border-color: var(--brand);
}

.thumbnail-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
    display: block;
}

/* Responsive */
@media (max-width: 900px) {

    .modal {
        grid-template-columns: 1fr;
        gap: 12px;
        height: 100%;
        border-radius: 0px;
    }

    .viewer {
        grid-template-columns: 36px 1fr 36px;
    }

    .nav-btn {
        width: 38px;
        height: 38px;
        border-radius: 10px;
    }


}

@media (max-width: 520px) {


    .stage {
        height: min(70vh, 520px);
    }

    .thumbnail-item {
        width: 56px;
        height: 56px;
    }


}
</style>
