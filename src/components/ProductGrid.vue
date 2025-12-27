<template>
    <div class="grid">
        <div v-for="(item, i) in items" :key="i" class="card" @click="$emit('open', item)">
            <div class="img-box">
                <img v-if="item.images?.length" :src="item.images[0]" loading="lazy" :alt="item.name" />

                <div v-else class="img-placeholder">No image</div>

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
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 14px;
}

/* CARD */
.card {
    background: transparent;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}


/* IMAGE BOX */
.img-box {
    position: relative;
    width: 100%;
    height: 300px;
    overflow: hidden;
    border-radius: 10px;
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
    display: flex;
    flex-direction: column;
}

/* NAME */
.name {
    font-size: 13px;
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
    font-size: 13px;
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
