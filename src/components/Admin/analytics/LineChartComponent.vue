<template>
    <div>
        <canvas ref="chart" width="600" height="300" style="border:1px solid #ddd;border-radius: 10px;"></canvas>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const chart = ref(null);

const data = ref([
    { month: "იან", sales: 120, order: 1 },
    { month: "თებ", sales: 95, order: 2 },
    { month: "მარ", sales: 150, order: 3 }
]);

let points = [];

// Generate Y scale based on max sales
function generateYLabels() {
    const max = Math.max(...data.value.map(d => d.sales));
    const step = Math.ceil(max / 5 / 10) * 10;
    const labels = [];
    for (let i = 0; i <= 5; i++) labels.push(i * step);
    return labels;
}

function drawTitle(ctx, width) {
    ctx.font = "bold 14px Arial";
    ctx.fillStyle = "#222";
    ctx.textAlign = "center";
    ctx.fillText("გაყიდვების ანალიტიკა", width / 2, 20);
}

function drawGrid(ctx, width, height, padding, Ylabels) {
    const spacing = (height - padding * 2) / (Ylabels.length - 1);
    ctx.strokeStyle = "#f0f0f0";

    for (let i = 0; i < Ylabels.length; i++) {
        const y = height - padding - i * spacing;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
}

function drawGraph(ctx, width, height, padding) {
    ctx.clearRect(0, 0, width, height);
    points = [];

    const Ylabels = generateYLabels();
    drawTitle(ctx, width);
    drawGrid(ctx, width, height, padding, Ylabels);

    // AXES
    ctx.strokeStyle = "#000";
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(padding, padding);
    ctx.stroke();

    // LABELS
    ctx.font = "11px Arial";
    ctx.fillStyle = "#000";

    const Xspacing = (width - padding * 2) / (data.value.length);
    const Yspacing = (height - padding * 2) / (Ylabels.length - 1);

    // X labels
    data.value.forEach((row, i) => {
        const x = padding + i * Xspacing;
        ctx.fillText(row.month, x - 8, height - padding + 18);
    });

    // Y labels
    Ylabels.forEach((label, i) => {
        const y = height - padding - i * Yspacing;
        ctx.fillText(label, padding - 30, y + 4);
    });

    // DATA SCALING
    const maxValue = Math.max(...Ylabels);
    const getX = (i) => padding + i * Xspacing;
    const getY = (v) => height - padding - (v / maxValue) * (height - padding * 2);

    // CURVED LINE
    ctx.beginPath();
    ctx.strokeStyle = "#007aff";
    ctx.lineWidth = 2;

    ctx.moveTo(getX(0), getY(data.value[0].sales));

    for (let i = 1; i < data.value.length; i++) {
        const x = getX(i);
        const y = getY(data.value[i].sales);

        const prevX = getX(i - 1);
        const prevY = getY(data.value[i - 1].sales);

        const cp = prevX + (x - prevX) / 2;

        ctx.bezierCurveTo(cp, prevY, cp, y, x, y);
    }

    ctx.stroke();

    // POINTS
    data.value.forEach((row, i) => {
        const x = getX(i);
        const y = getY(row.sales);

        points.push({ x, y, i });

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#007aff";
        ctx.fill();
    });
}

function drawTooltip(ctx, p) {
    const row = data.value[p.i];

    const sales = row.sales;
    const order = row.order;

    let percent = 0;
    if (p.i > 0) {
        const prev = data.value[p.i - 1].sales;
        percent = ((sales - prev) / prev * 100).toFixed(1);
    }

    const text1 = `${row.month.toUpperCase()}`;
    const text2 = `გაყიდვები: ${sales} ₾`;
    const text3 = `შეკვეთები: ${order}`;
    const text4 =
        p.i === 0
            ? "წინა თვე: —"
            : percent > 0
                ? `+${percent}% ↑`
                : `${percent}% ↓`;

    const texts = [text1, text2, text3, text4];

    ctx.font = "11px Arial";
    const width = Math.max(...texts.map(t => ctx.measureText(t).width)) + 20;

    const x = p.x + 10;
    const y = p.y - 70;

    // tooltip box
    ctx.fillStyle = "rgba(0,0,0,0.85)";
    ctx.beginPath();
    ctx.roundRect(x, y, width, 70, 8);
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.fillText(text1, x + 15, y + 15);
    ctx.fillText(text2, x + 50, y + 30);
    ctx.fillText(text3, x + 40, y + 45);
    ctx.fillStyle = percent >= 0 ? "#4cff4c" : "#ff6b6b";
    ctx.fillText(text4, x + 30, y + 60);
}

function XYGraph() {
    const canvas = chart.value;
    const ctx = canvas.getContext("2d");

    const cssWidth = canvas.width;
    const cssHeight = canvas.height;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;
    canvas.style.width = cssWidth + "px";
    canvas.style.height = cssHeight + "px";

    ctx.scale(dpr, dpr);

    const width = cssWidth;
    const height = cssHeight;
    const padding = 60;

    drawGraph(ctx, width, height, padding);

    canvas.onmousemove = (e) => {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        drawGraph(ctx, width, height, padding);

        points.forEach((p) => {
            if (Math.hypot(mx - p.x, my - p.y) < 8) {
                drawTooltip(ctx, p);
            }
        });
    };
}

onMounted(() => {
    XYGraph();
});
</script>

<style scoped></style>
