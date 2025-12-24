<template>
    <div class="slider-wrap">
        <div class="slider">
            <div class="track"></div>
            <div class="range" :style="{
                left: minPercent + '%',
                right: (100 - maxPercent) + '%'
            }"></div>

            <input type="range" v-model="min" :min="minLimit" :max="maxLimit" @input="limitMin" />

            <input type="range" v-model="max" :min="minLimit" :max="maxLimit" @input="limitMax" />
        </div>


    </div>
</template>

<script setup>
import { computed, ref } from 'vue';



const min = ref(0);
const max = ref(100);
const minLimit = ref(0);
const maxLimit = ref(100);


const emit = defineEmits(['min', 'max']);

const minPercent = computed(() => {
    return (min.value / maxLimit.value) * 100 + 2;
})

const maxPercent = computed(() => {
    return (max.value / maxLimit.value) * 100;
})

function limitMin(e) {
    const value = Number(e.target.value);
    if (value <= max.value) {
        min.value = value;
    } else {
        min.value = max.value;
    }
    emit('min', min.value);

}
function limitMax(e) {
    const value = Number(e.target.value);
    if (value >= min.value) {
        max.value = value;
    } else {
        max.value = min.value;
    }
    emit('max', max.value);

}

</script>

<style>
.slider-wrap {
    width: 200px;
}

.slider {
    position: relative;
    height: 30px;
}

.slider input[type="range"] {
    position: absolute;
    width: 100%;
    top: 25%;
    pointer-events: none;
    background: none;
    appearance: none;
}

.slider input[type="range"]::-webkit-slider-thumb {
    pointer-events: auto;
    width: 13px;
    height: 13px;
    background: #162e63;
    border-radius: 50%;
    cursor: pointer;
    appearance: none;
    z-index: 2;

}

.track {
    position: absolute;
    height: 3px;
    margin: auto;
    background: #d0d0d0;
    top: 50%;
}

.range {
    position: absolute;
    height: 3px;
    background: #162e63;
    top: 50%;
}


.slider input[type="range"]:nth-child(2)::-webkit-slider-thumb {
    margin-left: -6.5px;
    z-index: 3;
}
</style>
