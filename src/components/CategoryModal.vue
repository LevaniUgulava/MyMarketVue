<template lang="html">
  <div v-if="isModalVisible" class="modal-overlay">
    <div class="modal-content">
      <span class="close-btn" @click="$emit('close-modal')">✕</span>
      <h2>{{$t("search.title")}}</h2>

      <div class="category-group">
        <h4>{{$t("search.maincategory")}}</h4>
        <select v-model="selectedmainCategory" name="maincategory" class="styled-select">
          <option value="">{{$t('search.select')}}...</option>
          <option v-for="item in maincategories" :key="item.id" :value="item.id">
            {{ item.name }}
          </option>
        </select>
      </div>

      <div class="category-group">
        <h4>{{$t("search.category")}}</h4>
        <select v-model="selectedCategory" name="category" class="styled-select">
          <option value="">{{$t('search.select')}}...</option>
          <option v-for="item in selectedmainCategory ? filteredCategories : categories" :key="item.id" :value="item.id">
            {{ item.name }}
          </option>
        </select>
      </div>

      <div class="category-group">
        <h4>{{$t("search.subcategory")}}</h4>
        <select v-model="selectedsubCategory" name="category" class="styled-select">
          <option value="">{{$t('search.select')}}...</option>
          <option v-for="item in (selectedmainCategory || selectedCategory) ? filteredsubCategories : subcategories" :key="item.id" :value="item.id">
            {{ item.name }}
          </option>
        </select>
      </div>
      <h4>{{$t('search.findprice')}}</h4>
      <div class="inputs">
        <input type="number" :placeholder="$t('search.from')" v-model="min">
        <input type="number" :placeholder="$t('search.to')" v-model="max">
        </div>

      <button @click="search" class="save-btn">{{$t("search.save")}}</button>
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
      selectedsubCategory:"",
      min:'',
      max:''

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
          min:this.min,
          max:this.max
    });
        this.closeModal(); 

    },
    async fetchCategories() {
      try {
        const response = await axios.get('maincategory');
        const responsee = await axios.get('category');
        const responseee = await axios.get('subcategory');


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
.inputs {
  display: flex;
  gap: 10px; /* Space between the input fields */
  margin-bottom: 20px; /* Adds space below the input fields */
}

.inputs input {
  flex: 1; /* Make the input fields take equal space */
  padding: 10px;
  font-size: 0.95rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

.inputs input::placeholder {
  color: #aaa;
}

.inputs input:focus {
  border-color: #3498db;
  outline: none;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(3px);
}


.modal-content {
  background-color: #fff;
  padding: 25px;
  border-radius: 12px;
  width: 100%;
  max-width: 450px;
  position: relative;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.4s ease-in-out;
  text-align: left;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 15px;
  font-size: 1.4rem;
  cursor: pointer;
  color: #888;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #333;
}

h2 {
  color: #333;
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
}

.category-group {
  margin-bottom: 15px;
}

h4 {
  font-size: 1rem;
  color: #555;
  font-weight: 600;
  margin-bottom: 8px;
}

.styled-select {
  width: 100%;
  padding: 10px;
  font-size: 0.95rem;
  color: #333;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg fill="%23666" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 10px center;
  transition: border-color 0.3s ease;
}

.styled-select:hover,
.styled-select:focus {
  border-color: #3498db;
  outline: none;
}

.save-btn {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  font-weight: 500;
  color: #fff;
  background-color: #3498db;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin-top: 20px;
}

.save-btn:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}

</style>
