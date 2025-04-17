<template>
    <div class="form-container">
        <h3 class="form-title">დოკუმენტის დამატება</h3>
        <form method="post">
            <label for="title" class="label">სათაური</label>
            <input type="text" id="title" class="input" placeholder="მოიყვანეთ სათაური" />

            <div class="quantity-control">
                <button class="quantitybtn" @click.prevent="quantity('-')">-</button>
                <span class="quantity">{{ Docquantity }}</span>
                <button class="quantitybtn" @click.prevent="quantity('+')">+</button>
            </div>

            <div class="doc-items">
                <div v-for="(item, index) in getDocQuantities" :key="index" class="doc-item">
                    <label for="subtitle" class="label">ქვესათაური</label>
                    <input type="text" id="subtitle" class="input" placeholder="მოიყვანეთ ქვესათაური" />
                    <label for="document" class="label">დოკუმენტი</label>
                    <input type="text" id="document" class="input" placeholder="მოიყვანეთ დოკუმენტის სახელი" />
                </div>
            </div>

            <div class="submit-btn-container">
                <button type="submit" class="submit-btn">დამატება</button>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            Docquantity: 1
        };
    },
    methods: {
        quantity(action) {
            switch (action) {
                case "+":
                    this.Docquantity++;
                    break;
                case "-":
                    if (this.Docquantity <= 1) {
                        return;
                    }
                    this.Docquantity--;
                    break;
            }
        }
    },
    computed: {
        getDocQuantities() {
            return new Array(this.Docquantity).fill(0);
        }
    }
};
</script>

<style scoped>
.form-container {
    margin: 0 auto;
    padding: 20px;
    border-radius: 8px;
}

.form-title {
    text-align: center;
    font-size: 24px;
    margin-bottom: 20px;
    color: #333;
}

.label {
    font-size: 16px;
    color: #444;
    margin-bottom: 8px;
    display: block;
}

.input {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
}

.quantity-control {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
}

.quantitybtn {
    background-color: transparent;
    border: 1px solid #ccc;
    font-size: 20px;
    cursor: pointer;
    color: #888;
    padding: 10px;
    margin: 0 10px;
    border-radius: 5px;
}

.quantity {
    font-size: 18px;
    color: #333;
}

.doc-items {
    margin-bottom: 30px;
}

.doc-item {
    margin-bottom: 20px;
}

.submit-btn-container {
    display: flex;
    justify-content: center;
}

.submit-btn {
    background-color: #4CAF50;
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.submit-btn:hover {
    background-color: #45a049;
}
</style>