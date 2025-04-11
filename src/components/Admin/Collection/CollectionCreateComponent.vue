<template>
    <div>
        <form @submit.prevent="submitForm">
            <div>
                <label for="title">Title:</label>
                <input type="text" id="title" v-model="form.title" required />
            </div>

            <div class="color-picker-wrapper">
                <label for="headerColor">Header Color:</label>
                <input type="color" id="headerColor" v-model="form.headerColor" />
            </div>

            <div>
                <label for="description">Description:</label>
                <textarea id="description" v-model="form.description" rows="4"></textarea>
            </div>

            <div>
                <label for="discount">Discount (%):</label>
                <input type="number" id="discount" v-model="form.discount" min="0" max="100" />
            </div>

            <div>
                <label for="image">Upload Image:</label>
                <input type="file" id="image" @change="handleImageUpload" accept="image/*" />
            </div>

            <button type="submit">Submit</button>
        </form>
    </div>
</template>

<script>
import api from '@/api';
export default {
    name: "CollectionComponent",
    data() {
        return {
            form: {
                title: '',
                headerColor: '',
                description: '',
                discount: null,
            },
            imageFile: null,
        };
    },
    methods: {
        handleImageUpload(event) {
            this.imageFile = event.target.files[0];
        },

        async submitForm() {
            const formData = new FormData();
            formData.append('title', this.form.title);
            formData.append('headerColor', this.form.headerColor);
            formData.append('description', this.form.description);
            formData.append('discount', this.form.discount);

            if (this.imageFile) {
                formData.append('imageurl', this.imageFile);
            }

            try {
                const response = await api.post(
                    'admin/collection/create',
                    formData,
                    {
                        tokenRequired: true
                    }
                );

                console.log(response.data);
            } catch (error) {
                console.log(error);
            }
        }
    }
}
</script>

<style scoped>
form {
    display: flex;
    flex-direction: column;
    max-width: 400px;
    margin: auto;
}

div {
    margin-bottom: 15px;
}

label {
    font-weight: bold;
    margin-bottom: 5px;
    display: block;
}

input[type="text"],
input[type="number"],
textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

button {
    padding: 10px;
    background-color: #43a047;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
}

button:hover {
    background-color: #388e3c;
}

.color-picker-wrapper {
    position: relative;
    display: inline-block;
}

input[type="color"] {
    width: 100%;
    height: 40px;
    padding: 0;
    cursor: pointer;
}

.placeholder {
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    color: #888;
    pointer-events: none;
    font-size: 14px;
    opacity: 0.7;
}
</style>
