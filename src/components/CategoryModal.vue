<template lang="html">
  <div v-if="isModalVisible" class="modal-overlay">
    <div class="modal-content">
      <span class="close-btn" @click="$emit('close-modal')">&times;</span>
      <h2>Search by Categories</h2>

        <h4>General category</h4>
      <select v-model="selectedmainCategory" name="maincategory" class="styled-select">
       <option value="" >Select...</option> <!-- Default option with "Select >>" -->
        <option v-for="item in maincategories" :key="item.id" :value="item.id">
          {{ item.name }}
        </option>
      </select>   
              <h4>Sub category</h4>

      <div v-if="selectedmainCategory">
        <select v-model="selectedCategory" name="category" class="styled-select">
       <option value="" >Select...</option> <!-- Default option with "Select >>" -->
        <option v-for="item in filteredCategories" :key="item.id" :value="item.id">
          {{ item.name }}
        </option>
      </select>
      </div>
<div v-else>
         <select v-model="selectedCategory" name="category" class="styled-select">
       <option value="" >Select...</option> <!-- Default option with "Select >>" -->
        <option v-for="item in categories" :key="item.id" :value="item.id">
          {{ item.name }}
        </option>
      </select>
</div>
        <h4>Concrete category</h4>

<div v-if="selectedmainCategory || selectedCategory">
   <select v-model="selectedsubCategory" name="category" class="styled-select">
       <option value="" >Select...</option> <!-- Default option with "Select >>" -->
        <option v-for="item in filteredsubCategories" :key="item.id" :value="item.id">
          {{ item.name }}
        </option>
      </select>
</div>
<div v-else>
   <select v-model="selectedsubCategory" name="category" class="styled-select">
       <option value="" >Select...</option> <!-- Default option with "Select >>" -->
        <option v-for="item in subcategories" :key="item.id" :value="item.id">
          {{ item.name }}
        </option>
      </select>
</div>
      

      <button @click="search">Save</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      maincategories: [], 
      categories: [], 
      subcategories:[],
      filteredCategories:[],
      filteredsubCategories:[],
      selectedmainCategory: "", 
      selectedCategory: "",
      selectedsubCategory:""

    };
  },
  props: {
    isModalVisible: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    closeModal() {
      this.$emit('close-modal'); 
    },
    search() {
        this.$emit('search-category', {
          maincategory:this.selectedmainCategory,
          category:this.selectedCategory,
         subcategory: this.selectedsubCategory,
    });
        this.closeModal(); 

    },
    async fetchCategories() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/maincategory');
        const responsee = await axios.get('http://127.0.0.1:8000/api/category');
        const responseee = await axios.get('http://127.0.0.1:8000/api/subcategory');


        this.maincategories = response.data;
        this.categories = responsee.data;
        this.subcategories = responseee.data;


      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }

    },


  },
  watch: {
    selectedmainCategory() {
 if (this.selectedmainCategory) {
        this.filteredCategories = this.categories.filter(
          (category) => category.maincategory_id === this.selectedmainCategory
        );
        this.filteredsubCategories=this.subcategories.filter(
          (sub)=>sub.maincategory_id===this.selectedmainCategory
        )
      } else {
        this.filteredCategories = [];
      }   
       },

       selectedCategory(){
        if(this.selectedCategory){
        this.filteredsubCategories=this.subcategories.filter(
          (sub)=>sub.category_id===this.selectedCategory
        )
    }else {
        this.filteredCategories = [];
      }  
       }
  },
  mounted() {
    this.fetchCategories(); 
  },
};
</script>

<style scoped lang="css">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  width: 400px; /* Increased width */
  position: relative;
  text-align: center;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1); /* Subtle shadow for better appearance */
  animation: fadeIn 0.3s ease-in-out; /* Fade-in effect */
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.styled-select {
  width: 100%; /* Full width for the select dropdown */
  padding: 10px;
  font-size: 16px;
  border: 2px solid #3498db;
  border-radius: 8px;
  background-color: #fff;
  color: #333;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg fill="%234498db" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 10px center;
}

.styled-select:hover, .styled-select:focus {
  border-color: #2980b9; /* Darker blue border on focus */
  outline: none;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  cursor: pointer;
}

button {
  padding: 12px 25px;
  margin-top: 25px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #2980b9;
}
</style>
