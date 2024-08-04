<template>
  <div class="form-container">
    <form class="product-form" @submit.prevent="createProduct">
      <label for="name">Name </label>
      <input v-model="form.name" name="name" type="text"><br>

      <label for="description">Description</label>
      <input v-model="form.description" name="description" type="text"><br>

      <label for="price">Price </label>
      <input v-model="form.price" name="price" type="number"><br>

      <label>MainCategory</label>
      <select v-if="maincategories.length > 0" v-model="form.mainCategory">
        <option selected disabled>select...</option>
        <option v-for="category in maincategories" :key="category.id" :value="category.id">{{ category.name }}</option>
      </select><br>

      <label>Category</label>
      <select v-if="categories.length > 0" v-model="form.category">
        <option selected disabled>select...</option>
        <option v-for="category in filteredcategory" :key="category.id" :value="category.id">{{ category.name }}</option>
      </select><br>

      <label>SubCategory</label>
      <select v-if="subcategories.length > 0" v-model="form.subCategory">
        <option selected disabled>select...</option>
        <option v-for="category in filteredsubcategory" :key="category.id" :value="category.id">{{ category.name }}</option>
      </select><br>

      <label>Phone number:</label>
      <input v-model="form.phoneNumber" type="number" name="number"><br>

      <label>Image:</label>
      <input type="file" name="image" @change="onFileChange"><br>

      <button type="submit" class="submit-button">Create Product</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'CreateProductComponent',
  data() {
    return {
      maincategories: [],
      categories: [],
      subcategories: [],
      form: {
        name: '',
        description: '',
        price: null,
        mainCategory: '',
        category: '',
        subCategory: '',
        phoneNumber: '',
        image: null,
      },
    }
  },
  computed: {
    filteredcategory() {
      return this.categories.filter(category => category.maincategory_id === this.form.mainCategory)
    },
    filteredsubcategory() {
      return this.subcategories.filter(subcategory => subcategory.category_id === this.form.category)
    }
  },
  methods: {
    async maincategory() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/maincategory')
        this.maincategories = response.data
      } catch (error) {
        console.log(error)
      }
    },
    async category() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/category')
        this.categories = response.data
      } catch (error) {
        console.log(error)
      }
    },
    async subcategory() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/subcategory')
        this.subcategories = response.data
      } catch (error) {
        console.log(error)
      }
    },
    onFileChange(event) {
      this.form.image = event.target.files[0]
    },
    async createProduct() {
      console.log('Form data before submission:', this.form) // Debugging: Log form data
      const formData = new FormData()
      formData.append('name', this.form.name)
      formData.append('description', this.form.description)
      formData.append('price', this.form.price)
      formData.append('maincategory_id', this.form.mainCategory)
      formData.append('category_id', this.form.category)
      formData.append('subcategory_id', this.form.subCategory)
      formData.append('number', this.form.phoneNumber)
      formData.append('images', this.form.image)

      try {
        const response = await axios.post('http://127.0.0.1:8000/api/addproduct', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        console.log('Product created successfully:', response.data)
      } catch (error) {
        console.error('There was an error creating the product:', error)
      }
    },
  },
  mounted() {
    this.maincategory()
    this.category()
    this.subcategory()
  },
}
</script>

<style scoped>
.form-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.product-form {
  display: flex;
  flex-direction: column;
}

.product-form label {
  font-weight: bold;
  margin-top: 10px;
}

.product-form input[type="text"],
.product-form input[type="number"],
.product-form select,
.product-form input[type="file"] {
  width: 100%;
  padding: 8px;
  margin-top: 3px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submit-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.submit-button:hover {
  background-color: #0056b3;
}
</style>
