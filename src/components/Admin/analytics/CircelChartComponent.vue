<template>
    <div class="chart-container">
        <div class="donut-wrapper">
            <canvas ref="canvas" width="260" height="260"></canvas>

            <div class="center">
                <div class="center-value">{{ active.value }} ₾</div>
                <div class="center-label">{{ active.label }}</div>
                <div class="center-percent">{{ active.percent }}%</div>
            </div>

            <div v-if="tooltip.show" class="tooltip" :style="{ top: tooltip.y + 'px', left: tooltip.x + 'px' }">
                <b>{{ tooltip.label }}</b><br>
                {{ tooltip.value }} ₾ — {{ tooltip.percent }}%
            </div>
        </div>

        <div class="legend">
            <div v-for="seg in segments" :key="seg.label" class="legend-item">
                <span class="color" :style="{ background: seg.color }"></span>
                <span class="label">{{ seg.label }}</span>
                <span class="percent">{{ percent(seg) }}%</span>
                <span class="amount">{{ value(seg) }} ₾</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

const props = defineProps({
    profit: Number,
    courier: Number,
    productCost: Number
});

const canvas = ref(null);

const segments = [
    { key: "profit", label: "მოგება", color: "#22c55e" },
    { key: "productCost", label: "თვითღირებულება", color: "#eab308" },
    { key: "courier", label: "საკურიერო", color: "#ef4444" }
];

const tooltip = ref({ show: false, x: 0, y: 0, label: "", value: 0, percent: 0 });

const active = ref({
    label: "სულ ბრუნვა",
    value: 0,
    percent: 100
});

function total() {
    return props.profit + props.courier + props.productCost;
}

function value(seg) {
    return props[seg.key];
}

function percent(seg) {
    return Math.round((value(seg) / total()) * 100);
}

function updateCenter(seg) {
    active.value = {
        label: seg.label,
        value: value(seg),
        percent: percent(seg)
    };
}

function draw(highlight = null) {
    const c = canvas.value;
    const ctx = c.getContext("2d");

    ctx.clearRect(0, 0, 260, 260);

    const cx = 130;
    const cy = 130;
    const radius = 90;
    const lineW = 18;

    let start = -Math.PI / 2;

    segments.forEach(seg => {
        const angle = (value(seg) / total()) * Math.PI * 2;

        ctx.strokeStyle = seg.color;
        ctx.lineWidth = seg === highlight ? lineW + 3 : lineW;

        ctx.beginPath();
        ctx.arc(cx, cy, radius, start, start + angle);
        ctx.stroke();

        seg._start = start;
        seg._end = start + angle;

        start += angle;
    });
}

function checkSegment(x, y) {
    const rect = canvas.value.getBoundingClientRect();
    const cx = x - rect.left - 130;
    const cy = y - rect.top - 130;

    const dist = Math.sqrt(cx * cx + cy * cy);
    if (dist < 60 || dist > 115) return null;

    let angle = Math.atan2(cy, cx);
    if (angle < -Math.PI / 2) angle += Math.PI * 2;

    return segments.find(s => angle >= s._start && angle <= s._end);
}

function interactions() {
    const c = canvas.value;

    c.onmousemove = e => {
        const seg = checkSegment(e.clientX, e.clientY);
        if (!seg) {
            tooltip.value.show = false;
            draw();
            return;
        }

        tooltip.value = {
            show: true,
            x: e.clientX + 12,
            y: e.clientY - 20,
            label: seg.label,
            value: value(seg),
            percent: percent(seg)
        };

        draw(seg);
    };

    c.onclick = () => {
        if (tooltip.value.show) updateCenter(segments.find(s => s.label === tooltip.value.label));
    };
}

onMounted(() => {
    active.value.value = total();
    draw();
    interactions();
});

watch(() => [props.profit, props.courier, props.productCost], () => draw());
</script>

<style scoped>
.chart-container {
    display: flex;
    gap: 25px;
    border: 1px solid #ddd;
    width: 600px;
    border-radius: 10px;
    align-items: center;
}

.donut-wrapper {
    position: relative;
    width: 260px;
    height: 260px;
}

.title {
    display: flex;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
}

.center {
    position: absolute;
    top: 0;
    left: 0;
    width: 260px;
    height: 260px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.center-value {
    font-size: 26px;
    font-weight: 700;
    color: #0f172a;
}

.center-label {
    font-size: 14px;
    color: #475569;
}

.center-percent {
    font-size: 13px;
    margin-top: 4px;
    color: #64748b;
}

.tooltip {
    position: fixed;
    background: #0f172acc;
    color: white;
    padding: 6px 10px;
    border-radius: 6px;
    font-size: 12px;
    pointer-events: none;
    backdrop-filter: blur(4px);
}

.legend {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #334155;
}

.color {
    width: 14px;
    height: 14px;
    border-radius: 4px;
}

.percent {
    margin-left: auto;
    font-weight: 600;
    color: #475569;
}

.amount {
    margin-left: 10px;
    font-weight: 600;
    color: #0f172a;
}
</style>
