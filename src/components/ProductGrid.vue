<template>
    <div class="grid">
        <div v-for="(item, i) in items" :key="i" class="card" @click="$emit('open', item)">
            <!-- IMAGE WRAPPER -->
            <div class="img-box">
                <img v-if="item.images?.length" :src="item.images[0]" loading="lazy" :alt="item.name" />

                <!-- FALLBACK -->
                <div v-else class="img-placeholder">No image</div>

                <!-- DISCOUNT BADGE -->
                <div v-if="item.discount && item.discount > 0" class="badge">
                    -{{ item.discount }}%
                </div>
            </div>

            <!-- INFO -->
            <div class="info">
                <div class="name">{{ item.name }}</div>

                <div class="price">
                    {{ item.discountprice }} ₾

                    <span v-if="item.price && item.price > item.discountprice" class="old-price">
                        {{ item.price }} ₾
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({ items: Array });
defineEmits(["open"]);
</script>

<style scoped>
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 14px;
}

/* CARD */
.card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    border: 1px solid #eaeaea;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* HOVER */
.card:hover {
    transform: translateY(-4px) scale(1.01);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.13);
}

/* IMAGE BOX */
.img-box {
    position: relative;
    width: 100%;
    height: 210px;
    overflow: hidden;
}

.img-box img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

/* FALLBACK PLACEHOLDER */
.img-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #eee, #ccc);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    font-size: 13px;
}

/* DISCOUNT BADGE */
.badge {
    position: absolute;
    top: 10px;
    left: 10px;
    background: #ff3d3d;
    color: white;
    font-size: 12px;
    padding: 4px 6px;
    border-radius: 6px;
    font-weight: 600;
}

/* INFO */
.info {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

/* NAME */
.name {
    font-size: 14px;
    font-weight: 500;
    line-height: 1.3;

    /* clamp to 2 lines */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* PRICE */
.price {
    font-size: 15px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 6px;
}

/* OLD PRICE */
.old-price {
    font-size: 12px;
    color: #999;
    text-decoration: line-through;
}
</style>
