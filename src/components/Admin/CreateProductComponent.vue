<template>
  <Message v-if="message" closable class="message">{{ message }}</Message>

  <div class="form-container">
    <form class="product-form" @submit.prevent="createProduct">
      <label for="name">Name</label>
      <input v-model="form.name" name="name" type="text" placeholder="Name"><br>

      <label for="description">Description</label>
      <input v-model="form.description" name="description" type="text" placeholder="Description"><br>

      <label for="price">Price</label>
      <input v-model="form.price" name="price" type="number" placeholder="Price"><br>

      <label>MainCategory</label>
      <select v-if="maincategories.length > 0" v-model="form.mainCategory">
        <option value="" selected>select...</option>
        <option v-for="category in maincategories" :key="category.id" :value="category.id">{{ category.name }}</option>
      </select><br>

      <label>Category</label>
      <select v-if="categories.length > 0" v-model="form.category">
        <option value=""  selected>select...</option>
        <option v-for="category in filteredcategory" :key="category.id" :value="category.id">{{ category.name }}</option>
      </select><br>

      <label>SubCategory</label>
      <select v-if="subcategories.length > 0" v-model="form.subCategory">
        <option value=""  selected>select...</option>
        <option v-for="category in filteredsubcategory" :key="category.id" :value="category.id">{{ category.name }}</option>
      </select><br>

      <label>Size Type</label>
      <select v-model="form.size_type">
        <option value="" selected>select...</option>
        <option value="numeric">Numeric</option>
        <option value="letter-based">Letter-based</option>
      </select><br>

      <!-- Size Inputs -->
      <div v-if="form.size_type === 'numeric'">
        <label for="size">Numeric Size</label>
        <select v-if="numericbased.length > 0" v-model="form.Sizes" multiple>
          <option v-for="size in numericbased" :key="size.id" :value="size">{{ size }}</option>
        </select>
       </div>
      
  <div v-if="(form.size_type === 'numeric') && form.Sizes && form.Sizes.length > 0">
    <div v-for="(size, index) in form.Sizes" :key="index">
      <label>{{ size }} Quantity</label>
      <input type="number" v-model="form.quantity[index]" placeholder="Enter value">
    </div>
  </div>

      <div v-if="form.size_type === 'letter-based'">
        <label>Letter Sizes</label>
        <select v-if="letterbased.length > 0" v-model="form.Sizes" multiple>
          <option v-for="size in letterbased" :key="size.id" :value="size">{{ size }}</option>
        </select>
      </div>

  <div v-if="(form.size_type === 'letter-based') && form.Sizes && form.Sizes.length > 0">
    <div v-for="(size, index) in form.Sizes" :key="index">
      <label>{{ size }} Quantity</label>
      <input type="text" v-model="form.quantity[index]" placeholder="Enter value">
    </div>
  </div>

      <label>Image</label>
      <input type="file" name="image" multiple @change="onFileChange"><br>

      <button type="submit" class="submit-button">Create Product</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import Message from 'primevue/message';

export default {
  name: 'CreateProductComponent',
  components: {
    Message,
  },
  data() {
    return {
      maincategories: [],
      categories: [],
      subcategories: [],
      sizes: [],
      message: null,
      form: {
        name: '',
        description: '',
        price: null,
        mainCategory: '',
        category: '',
        subCategory: '',
        image: null,
        size_type: '',
        Sizes: [],
        quantity:[],
      },
    };
  },
  computed: {
    filteredcategory() {
      return this.categories.filter(category => category.maincategory_id === this.form.mainCategory);
    },
    filteredsubcategory() {
      return this.subcategories.filter(subcategory => subcategory.category_id === this.form.category);
    },
  },
  methods: {
    async maincategory() {
      try {
        const response = await axios.get('maincategory');
        this.maincategories = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async category() {
      try {
        const response = await axios.get('category');
        this.categories = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async subcategory() {
      try {
        const response = await axios.get('subcategory');
        this.subcategories = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async Getsize() {
      try {
        const response = await axios.get('getSizes');
        this.letterbased = response.data.letterbased;
        this.numericbased = response.data.numericbased;

      } catch (error) {
        console.log(error);
      }
    },
    onFileChange(event) {
      this.form.image = event.target.files;
    },
    async createProduct() {
      const token=localStorage.getItem('token');
      console.log('Form data before submission:', this.form);
      const formData = new FormData();
      formData.append('name', this.form.name);
      formData.append('description', this.form.description);
      formData.append('price', this.form.price);
      formData.append('maincategory_id', this.form.mainCategory);
      formData.append('category_id', this.form.category);
      formData.append('subcategory_id', this.form.subCategory);
      formData.append('size_type', this.form.size_type);
       this.form.Sizes.forEach((size, index) => {
    formData.append(`size[${index}]`, size);
    formData.append(`quantity[${index}]`, this.form.quantity[index]);
  });

      if (this.form.image) {
        for (let i = 0; i < this.form.image.length; i++) {
          formData.append('images[]', this.form.image[i]);
        }
      }

      try {
        const response = await axios.post('addproduct', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            "Authorization": `Bearer ${token}`
          },
        });
        this.message = 'Product created successfully';
        console.log('Product created successfully:', response.data);
      } catch (error) {
        console.error('There was an error creating the product:', error);
        this.message = 'Error creating product';
      }
    },
 
  },
  mounted() {
    this.maincategory();
    this.category();
    this.subcategory();
    this.Getsize();
  },
};
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
