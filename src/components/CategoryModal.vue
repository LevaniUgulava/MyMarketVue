<template lang="html">
  <transition name="modal-fade">
    <div v-if="isModalVisible" class="modal-overlay" @touchstart="startTouch" @touchmove="onTouchMove"
      @touchend="endTouch">
      <div class="modal-content" :style="{ transform: `translateY(${modalTranslateY}px)` }">
        <div class="modal-lever"></div>
        <div class="modal-body" ref="scrollableBody">
          <ProductViewCategory />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import ProductViewCategory from '@/views/Products/ProductViewCategory.vue';

export default {
  components: {
    ProductViewCategory,
  },
  data() {
    return {
      touchStart: 0,
      modalTranslateY: 0,
      maxTranslateY: 0,
      isDragging: false,
      currentScroll: 0,
    };
  },
  props: {
    isModalVisible: {
      type: Boolean,
      required: true,
    },
  },
  watch: {
    isModalVisible(newValue) {
      if (newValue) {
        this.modalTranslateY = 0;
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    },
  },
  methods: {
    startTouch(event) {
      const scrollable = this.$refs.scrollableBody;
      this.currentScroll = scrollable.scrollTop;
      this.isDragging = true;
      this.touchStart = event.touches[0].clientY;
      this.maxTranslateY = window.innerHeight * 0.8;
    },
    onTouchMove(event) {
      const currentY = event.touches[0].clientY;
      const deltaY = currentY - this.touchStart;

      if (this.isDragging && deltaY > 0) {
        event.preventDefault();
        this.modalTranslateY = Math.min(deltaY, this.maxTranslateY);
      }
    },
    endTouch(event) {
      const touchEnd = event.changedTouches[0].clientY;
      const deltaY = touchEnd - this.touchStart;

      if (deltaY > 60 && this.isDragging) {
        this.closeModal();
      } else {
        this.resetModalPosition();
      }
      this.isDragging = false;
    },
    closeModal() {
      this.$emit('close-modal', false);
    },
    resetModalPosition() {
      this.modalTranslateY = 0;
      this.modalHeight = 400;
    },
  },
};
</script>



<style scoped lang="css">
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.4s ease, background-color 0.4s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-to,
.modal-fade-leave-from {
  opacity: 1;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 9999;
  backdrop-filter: blur(10px);
  overflow: hidden;
  touch-action: manipulation;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 12px 12px 0 0;
  width: 100%;
  max-width: 100%;
  max-height: 80vh;
  position: relative;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.15);
  transition: opacity 0.4s ease, background-color 0.4s ease;
  display: flex;
  flex-direction: column;
}

.modal-lever {
  width: 60px;
  height: 10px;
  background-color: #bbb;
  border-radius: 4px;
  margin: 10px auto;
  cursor: grab;
  user-select: none;
  transition: background-color 0.3s ease;
}

.modal-lever:active {
  background-color: #888;
}

.modal-body {
  overflow-y: auto;
  flex: 1;
  padding-right: 10px;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
  scroll-behavior: smooth;
}
</style>