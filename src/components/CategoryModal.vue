<template lang="html">
  <div v-if="isModalVisible" class="modal-overlay" @touchstart="startTouch" @touchmove="onTouchMove"
    @touchend="endTouch">
    <div class="modal-content" :style="{ transform: `translateY(${modalTranslateY}px)` }">
      <!-- Lever for dragging the modal -->
      <div class="modal-lever"></div>
      <div class="modal-body" @touchstart.stop @touchmove.stop>
        <ProductViewCategory />
      </div>
    </div>
  </div>
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
        this.modalTranslateY = 0;  // Reset position when modal opens
        document.body.style.overflow = 'hidden';  // Disable body scroll when modal is open
      } else {
        document.body.style.overflow = 'auto'; // Re-enable body scroll when modal is closed
      }
    },
  },
  methods: {
    startTouch(event) {
      this.isDragging = true;
      document.body.style.overflow = 'hidden'; // Disable scrolling on body while dragging the modal
      this.touchStart = event.touches[0].clientY;
      this.maxTranslateY = window.innerHeight * 0.8; // Max translate Y value (80% screen height)
    },

    onTouchMove(event) {
      const touchMove = event.touches[0].clientY;
      const deltaY = touchMove - this.touchStart;

      event.preventDefault();  // Prevent scrolling while dragging the modal

      // Allow dragging the modal down within the maximum limit
      if (deltaY > 0 && deltaY <= this.maxTranslateY) {
        this.modalTranslateY = deltaY;
      }
    },

    endTouch() {
      // Close the modal if swiped enough or reset position
      if (this.modalTranslateY > 0) {
        this.closeModal();
      } else {
        this.resetModalPosition();
      }

      this.isDragging = false;
      document.body.style.overflow = 'auto'; // Re-enable scrolling after dragging
    },

    closeModal() {
      this.$emit('close-modal', false); // Emit event to close the modal
    },

    resetModalPosition() {
      this.modalTranslateY = 0; // Reset position if swipe was not enough to close
    },
  },
};
</script>

<style scoped lang="css">
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 9999;
  backdrop-filter: blur(10px);
  overflow-y: auto;
  animation: slideUp 0.5s ease-out;
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
  transition: transform 0.3s ease-in-out;
  animation: fadeIn 0.4s ease-in-out;
}

.modal-lever {
  width: 60px;
  height: 4px;
  background-color: #ccc;
  border-radius: 4px;
  margin: 10px auto;
  cursor: grab;
  user-select: none;
}

.modal-body {
  overflow-y: auto;
  max-height: 60vh;
  padding-right: 10px;
  touch-action: none;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
