<template>
    <a href="/admin/brands">უკან დაბრუნება</a>
    <div class="brand-container">
        <div class="form-group">
            <label for="brand-select">ბრენდების მართვა</label>
            <select v-model="selectedBrand" @change="populateForm" id="brand-select">
                <option value="">აირჩიეთ...</option>
                <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                    {{ brand.name }}
                </option>
            </select>
        </div>

        <div class="form-group">
            <input type="text" v-model="form.name" placeholder="Brand name" />

            <div v-if="form.imageUrl" class="image-preview">
                <img :src="form.imageUrl" alt="Brand Image" class="image-thumbnail" />
            </div>

            <input type="file" @change="onImageChange" />

            <button class="create" @click="create" v-if="!selectedBrand">დამატება</button>
            <button class="update" @click="update" v-if="selectedBrand">განახლება</button>
        </div>
    </div>
</template>

<script>
import api from '@/api';

export default {
    data() {
        return {
            form: {
                name: '',
                image: null,
                imageUrl: '',
            },
            brands: [],
            selectedBrand: "",
            singlebrands: null
        };
    },
    methods: {
        async all() {
            try {
                const response = await api.get('admin/brand/display', {
                    tokenRequired: true
                });
                this.brands = response.data;
            } catch (error) {
                return error.response;
            }
        },
        async single(id) {
            try {
                const response = await api.get(`admin/brand/display/${id}`, {
                    tokenRequired: true
                });
                this.singlebrands = response.data;
            } catch (error) {
                return error.response;
            }
        },
        populateForm() {
            const selected = this.brands.find(brand => brand.id === this.selectedBrand);
            if (selected) {
                this.form.name = selected.name;
                this.form.imageUrl = selected.media_url ? selected.media_url[0] : '';
            } else {
                this.form.name = '';
                this.form.imageUrl = '';
            }
        },
        onImageChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.form.image = file;
                this.form.imageUrl = URL.createObjectURL(file);
            }
        },
        async create() {
            try {
                const formData = new FormData();
                formData.append('name', this.form.name);
                if (this.form.image) {
                    formData.append('image', this.form.image);
                }

                const response = await api.post('admin/brand/create/', formData, {
                    tokenRequired: true
                });
                this.singlebrands = response.data;
                this.all();
                this.selectedBrand = null;
                this.form.name = '';
                this.form.image = null;
                this.form.imageUrl = '';
            } catch (error) {
                return error.response;
            }
        },
        async update() {
            try {
                const formData = new FormData();
                formData.append('name', this.form.name);
                if (this.form.image) {
                    formData.append('image', this.form.image);
                }

                const response = await api.post(`admin/brand/update/${this.selectedBrand}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        tokenRequired: true
                    }
                });
                this.singlebrands = response.data;
                this.all();
                this.selectedBrand = null;
                this.form.name = '';
                this.form.image = null;
                this.form.imageUrl = '';
            } catch (error) {
                return error.response;
            }
        }
    },
    mounted() {
        this.all();
    }
};
</script>

<style scoped>
.brand-container {
    margin: 20px auto;
    padding: 20px;
    border-radius: 8px;
}

.form-group {
    margin-bottom: 15px;
}

input[type="text"],
input[type="file"],
select {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

button {
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.create {
    background-color: #0f68c8;
}

.update {
    background-color: rgb(193, 135, 28);
}

.create:hover {
    background-color: #0056b3;
}

.update:hover {
    background-color: rgb(176, 135, 57);
}

.image-preview {
    margin-top: 10px;
    text-align: center;
}

.image-thumbnail {
    max-width: 100%;
    max-height: 100px;
    object-fit: cover;
    border-radius: 4px;
}
</style>
