<template>
    <div class="slider-container" ref="container" @pointerdown="start" @pointermove="onMove" @pointerup="end"
        @pointercancel="end" @pointerleave="end">

        <div class="slider" ref="slider" :class="{ dragging }" :style="{ transform: `translate3d(${pos}px,0,0)` }">
            <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="24px" fill="black">
                <path
                    d="m242-200 200-280-200-280h98l200 280-200 280h-98Zm238 0 200-280-200-280h98l200 280-200 280h-98Z" />
            </svg>
        </div>

        <span class="slider-text">შეკვეთის დასადასტურებლად</span>
    </div>
</template>

<script>
export default {
    name: 'SliderButton',
    emits: ['confirm'],
    data() {
        return {
            pos: 5,
            maxPos: 0,
            grabOffset: 0,
            dragging: false,
            pointerId: null,
            paddingLeft: 5,
            paddingRight: 5,
            knobW: 50,
            successMargin: 10,
            containerLeft: 0,
            containerWidth: 0,
            ro: null,
        }
    },
    computed: {
        progress() {
            return this.maxPos > 0 ? this.pos / this.maxPos : 0
        },

    },
    mounted() {
        this.measure()
        if ('ResizeObserver' in window) {
            this.ro = new ResizeObserver(() => this.measure())
            this.ro.observe(this.$refs.container)
        }
    },
    beforeUnmount() {
        if (this.ro) this.ro.disconnect()
    },
    methods: {
        measure() {
            const r = this.$refs.container.getBoundingClientRect()
            this.containerLeft = r.left
            this.containerWidth = r.width
            this.maxPos = r.width - this.knobW - this.paddingRight;
            if (this.pos > this.maxPos) this.pos = this.maxPos
        },
        start(e) {
            if (this.dragging) return
            this.dragging = true
            this.pointerId = e.pointerId ?? null

            this.$refs.container.setPointerCapture?.(e.pointerId)

            const r = this.$refs.container.getBoundingClientRect()
            this.containerLeft = r.left
            this.containerWidth = r.width
            this.maxPos = Math.max(2, r.width - this.knobW - 2)

            const knobLeftNow = this.containerLeft + this.pos;
            const x = e.clientX
            this.grabOffset = x - knobLeftNow

            e.preventDefault()
        },
        onMove(e) {
            if (!this.dragging) return
            if (this.pointerId !== null && e.pointerId !== this.pointerId) return

            const x = e.clientX
            let next = x - this.containerLeft - this.grabOffset
            if (next < 2) next = 2
            if (next > this.maxPos) next = this.maxPos

            this.pos = next
            e.preventDefault()
        },
        end() {
            if (!this.dragging) return

            if (this.pointerId !== null) {
                this.$refs.container.releasePointerCapture?.(this.pointerId)
            }

            this.dragging = false
            this.pointerId = null

            if (this.pos >= this.maxPos - this.successMargin) {
                this.pos = this.maxPos;
                this.$emit('confirm');
                setTimeout(() => { this.pos = this.paddingLeft }, 150);
            } else {
                this.pos = this.paddingLeft;
            }
        }
    }
}
</script>

<style scoped>
.slider-container {
    position: relative;
    width: 100%;
    height: 60px;
    background: black;
    border-radius: 20px;
    overflow: hidden;
    user-select: none;
    -webkit-user-select: none;
    touch-action: none;
    -webkit-tap-highlight-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
}

.slider-text {
    pointer-events: none;
    z-index: 1;
    font-size: 14px;
    opacity: .95;
}

.slider {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    left: 0;
    width: 45px;
    height: 45px;
    background: #fff;
    border-radius: 100%;
    box-shadow: 0 6px 16px rgba(0, 0, 0, .15);
    z-index: 2;
    will-change: transform;
    transform: translate3d(2px, 0, 0);
    transition: transform 0.3s ease-in-out;
}

.slider.dragging {
    transition: none;
}
</style>
