<template>
    <div v-if="open" class="overlay">
        <div class="modal">
            <button class="close-btn" @click="closeModal">
                <img src="../assets//svg/close.svg">
            </button>
            <div class="image-container" @mousemove="onMouseMove" @mouseleave="onMouseLeave" @touchstart="onTouchStart"
                @touchmove="onTouchMove" @touchend="onTouchEnd">
                <img :src="localSelectedImage" alt="Product Image" class="modal-image" ref="productImage" />
                <div v-if="zoom" class="lens" :style="lensStyle"></div>
            </div>
            <div class="info">
                <h3>{{ name }}</h3>
                <div class="thumbnail-container">
                    <div v-for="(image, index) in images" :key="index" class="thumbnail-item"
                        :class="{ active: image === localSelectedImage }" @click="setSelectedImage(image)">
                        <img :src="image" alt="Thumbnail" class="thumbnail-image" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        open: {
            type: Boolean,
            default: false
        },
        name: {
            type: String,
            default: ''
        },
        selectedImage: {
            type: String,
            required: true
        },
        images: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            localSelectedImage: this.selectedImage,
            zoom: false,
            lensStyle: {},
        };
    },

    watch: {
        selectedImage(newValue) {
            this.localSelectedImage = newValue;
        }
    },
    methods: {
        closeModal() {
            this.$emit('update:open', false);
        },
        setSelectedImage(image) {
            this.localSelectedImage = image;
            this.$emit('update:selectedImage', image);
        },
        onMouseMove(event) {
            this.zoom = true;
            this.updateLensPosition(event);
        },

        onTouchStart(event) {
            this.zoom = true;
            this.updateLensPosition(event);
        },

        onTouchMove(event) {
            this.updateLensPosition(event);
        },

        onTouchEnd() {
            this.zoom = false;
            this.lensStyle = {};
        },

        onMouseLeave() {
            this.zoom = false;
            this.lensStyle = {};
        },

        updateLensPosition(event) {
            const image = this.$refs.productImage;
            const rect = image.getBoundingClientRect();

            let x = event.clientX ? event.clientX - rect.left : event.touches[0].clientX - rect.left;
            let y = event.clientY ? event.clientY - rect.top : event.touches[0].clientY - rect.top;

            const lensSize = 120;

            if (x < 0) x = 0;
            if (y < 0) y = 0;
            if (x > rect.width - lensSize) x = rect.width - lensSize;
            if (y > rect.height - lensSize) y = rect.height - lensSize;

            const zoomFactor = 2;

            window.requestAnimationFrame(() => {
                this.lensStyle = {
                    left: `${x}px`,
                    top: `${y}px`,
                    width: `${lensSize}px`,
                    height: `${lensSize}px`,
                    backgroundImage: `url(${this.localSelectedImage})`,
                    backgroundSize: `${rect.width * zoomFactor}px ${rect.height * zoomFactor}px`,
                    backgroundPosition: `-${x * zoomFactor}px -${y * zoomFactor}px`,
                };
            });
        }


    },


}
</script>

<style scoped>
.lens {
    position: absolute;
    border: 1px solid #000;
    background-color: rgba(0, 0, 0, 0.5);
    pointer-events: none;
    z-index: 10;
    transition: left 0.1s ease, top 0.1s ease;
}

.info {
    padding-top: 10px;
}

.image-container {
    position: relative;
    cursor: zoom-in;
}


.modal-image {
    width: 100%;
    height: 90vh;
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal {
    background-color: white;
    padding: 20px;
    padding-top: 40px;
    border-radius: 10px;
    display: flex;
    position: relative;
}

.close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 20px;
    background: none;
    border: none;
    cursor: pointer;
}

.close-btn img {
    width: 25px;
    height: 25px;
    background-color: aliceblue;
    padding: 5px;
    border-radius: 20px;
}


.thumbnail-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    justify-content: center;
}

.thumbnail-item {
    width: 50px;
    height: 50px;
    border: 1.5px solid transparent;
    cursor: pointer;
}

.thumbnail-item.active {
    border-color: #7a1dff;
    border-radius: 8px;
}

.thumbnail-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
}
</style>