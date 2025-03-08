<template>
    <div class="pagination">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="arrow">
            ❮
        </button>

        <button @click="changePage(1)" class="pages" :class="{ active: currentPage === 1 }">1</button>

        <span v-if="showLeftDots" class="dots">...</span>

        <button v-for="page in visiblePages" :key="page" @click="changePage(page)" class="pages"
            :class="{ active: currentPage === page }">
            {{ page }}
        </button>

        <span v-if="showRightDots" class="dots">...</span>

        <button v-if="totalPages > 1" @click="changePage(totalPages)" class="pages"
            :class="{ active: currentPage === totalPages }">
            {{ totalPages }}
        </button>

        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="arrow">
            ❯
        </button>
    </div>
</template>

<script>
export default {
    name: "CustomPagination",
    props: {
        totalPages: { type: Number, required: true },
        currentPage: { type: Number, required: true }
    },
    computed: {
        visiblePages() {
            if (this.totalPages <= 7) {
                return Array.from({ length: this.totalPages - 2 }, (_, i) => i + 2);
            }

            let start = Math.max(2, this.currentPage - 2);
            let end = Math.min(this.totalPages - 1, this.currentPage + 2);

            if (this.currentPage <= 4) {
                start = 2;
                end = 6;
            } else if (this.currentPage >= this.totalPages - 3) {
                start = this.totalPages - 5;
                end = this.totalPages - 1;
            }

            return Array.from({ length: end - start + 1 }, (_, i) => start + i);
        },
        showLeftDots() {
            return this.currentPage > 4;
        },
        showRightDots() {
            return this.currentPage < this.totalPages - 3;
        }
    },
    methods: {
        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.$router.push({ query: { ...this.$route.query, page } });
            }
        }
    }
};
</script>

<style scoped>
.pagination {
    display: flex;
    gap: 10px;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
}

.arrow,
.pages {
    padding: 8px 12px;
    border: none;
    background: white;
    color: #7a1dff;
    cursor: pointer;
    font-size: 14px;
    transition: 0.3s;
}

.pages {
    border-bottom: 1px solid #7a1dff;
}

.arrow {
    border-radius: 5px;
    border: 1px solid #7a1dff;
}

.arrow:disabled {
    color: rgb(202, 200, 200);
    border: 1px solid rgb(202, 200, 200);
    cursor: not-allowed;
}

.pages.active {
    font-weight: 700;
    border-bottom: 3px solid #7a1dff;
}

.dots {
    padding: 8px;
    font-size: 14px;
    color: #7a1dff;
    user-select: none;
}
</style>
