<template>
    <div>
        <a href="/admin/banner"><i class="fa-solid fa-arrow-left"></i></a>
    </div>
    <div class="create-container">
        <form class="form" @submit.prevent="create">
            <label>მისამართი:</label>
            <input class="input" type="text" v-model="data.url" placeholder="მისამართი" required>

            <label>სურათი:</label>
            <input type="file" @change="handleFileChange" required>

            <button type="submit">შეინახე</button>
        </form>
    </div>
</template>
<script>
import api from '@/api';

export default {
    data() {
        return {
            data: {
                url: null,
                image: null
            }
        }
    },
    methods: {
        async create() {
            try {
                const formData = new FormData();
                formData.append('url', this.data.url);
                formData.append('image', this.data.image);

                const response = await api.post('/banner/admin/create', formData, {
                    tokenRequired: true
                });

                console.log(response);

            } catch (error) {
                console.log(error);
            }
        },
       
        handleFileChange(event) {
            this.data.image = event.target.files[0];
        }

    },
}
</script>
<style scoped>
.create-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 400px;
}

.input {
    width: 100%;
    height: 40px;
    border: 1px solid #ccc;
    align-items: center;
    padding: 5px;
    border-radius: 5px;
}

button {
    cursor: pointer;
    background-color: black;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    font-size: 13px;
}

label {
    font-size: 13px;
}

button:hover {
    background-color: #5d655e;
}
</style>s