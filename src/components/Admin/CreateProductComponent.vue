<template>
  <Message v-if="message" closable class="message">{{ message }}</Message>

  <div class="form-container">
    <form class="product-form" @submit.prevent="createProduct">
      <div class="form-group">
        <label for="name">სახელი</label>
        <input v-model="form.name" name="name" type="text" placeholder="Enter Product Name" required>
      </div>

      <div class="form-group">
        <label for="description">აღწერა</label>
        <input v-model="form.description" name="description" type="text" placeholder="Enter Product Description"
          required>
      </div>

      <div class="form-group">
        <label for="price">ფასი</label>
        <input v-model="form.price" name="price" type="number" placeholder="Enter Price" required>
      </div>

      <div class="form-group">
        <label>მთავარი კატეგორია</label>
        <select v-if="maincategories.length > 0" v-model="form.mainCategory" required>
          <option value="" selected>Select Main Category</option>
          <option v-for="category in maincategories" :key="category.id" :value="category.id">{{ category.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>კატეგორია</label>
        <select v-if="categories.length > 0" v-model="form.category" required>
          <option value="" selected>Select Category</option>
          <option v-for="category in filteredcategory" :key="category.id" :value="category.id">{{ category.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>ქვეკატეგორია</label>
        <select v-if="subcategories.length > 0" v-model="form.subCategory" required>
          <option value="" selected>Select SubCategory</option>
          <option v-for="category in filteredsubcategory" :key="category.id" :value="category.id">{{ category.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>ზომის ტიპი</label>
        <select v-model="form.size_type" required>
          <option value="" selected>Select Size Type</option>
          <option value="numeric">Numeric</option>
          <option value="letter-based">Letter-based</option>
        </select>
      </div>

      <div v-if="form.size_type === 'numeric'" class="form-group">
        <label>Numeric Sizes</label>
        <select v-if="numericbased.length > 0" v-model="form.Sizes" multiple>
          <option v-for="size in numericbased" :key="size.id" :value="size">{{ size }}</option>
        </select>
      </div>

      <div v-if="form.size_type === 'numeric' && form.Sizes.length > 0" class="size-input-group">
        <div v-for="(size, index) in form.Sizes" :key="index" class="size-detail">
          <label>
            <h4>{{ size }} ზომის დეტალები</h4>
            <label>ფერების რაოდენობა</label>

            <div class="quantity-control">
              <button class="quantity" @click.prevent="decrease(index)">-</button>
              <p>{{ colorquantity[index] }}</p>
              <button class="quantity" @click.prevent="increase(index)">+</button>
            </div>

          </label>
          <div v-for="(item, colorindex) in Array.from({ length: colorquantity[index] || 1 })"
            :key="'size-' + index + '-color-' + colorindex">
            <input type="number" v-model="form.quantity[index][colorindex]" placeholder="შეიყვანეთ რაოდენობა" required>
            <input type="text" v-model="form.color[index][colorindex]" placeholder="შეიყვანეთ ფერი" required>
          </div>
        </div>
      </div>
      <div v-if="form.size_type === 'letter-based'" class="form-group">
        <label>Letter Sizes</label>
        <select v-if="numericbased.length > 0" v-model="form.Sizes" multiple>
          <option v-for="size in letterbased" :key="size.id" :value="size">{{ size }}</option>
        </select>
      </div>

      <div v-if="form.size_type === 'letter-based' && form.Sizes.length > 0" class="size-input-group">
        <div v-for="(size, index) in form.Sizes" :key="index" class="size-detail">
          <label>
            <h4>{{ size }} ზომის დეტალები</h4>
            <label>ფერების რაოდენობა</label>

            <div class="quantity-control">
              <button class="quantity" @click.prevent=" decrease(index)">-</button>
              <p>{{ colorquantity[index] }}</p>
              <button class="quantity" @click.prevent=" increase(index)">+</button>
            </div>
          </label>
          <div v-for="(item, colorindex) in Array.from({ length: colorquantity[index] || 1 })"
            :key="'size-' + index + '-color-' + colorindex">
            <input type="number" v-model="form.quantity[index][colorindex]" placeholder="შეიყვანეთ სახელი" required>
            <input type="text" v-model="form.color[index][colorindex]" placeholder="შეიყვანეთ ინფორმაცია" required>
          </div>
        </div>
      </div>

      <button class="additional-button" @click.prevent="toggleAdditionalInfo">დამატებით
        ინფორმაცია?</button>

      <div class="form-group" v-if="isAdditionalinfo">
        <h4> დამატებითი ინფორმაცია</h4>

        <label>
          <label>რაოდენობა</label>
          <div class="quantity-control">
            <button class="quantity" @click.prevent="infocolumn--">-</button>
            <p>{{ infocolumn }}</p>
            <button class="quantity" @click.prevent="infocolumn++">+</button>
          </div>

        </label>
        <div v-for="(item, index) in infocolumn" :key="index" class="seperate-additional">
          <input :disabled="islockedin" type="text" v-model="additionalname[index]" placeholder="შეიყვანეთ რაოდენობა"
            required>
          <input :disabled="islockedin" type="text" v-model="additionaldescription[index]" placeholder="შეიყვანეთ ფერი"
            required>
        </div>
        <button class="additional-button" @click.prevent="toggleisLockedin">ჩაკეტე</button>

      </div>

      <div class="form-group">
        <label>ფოტოები</label>
        <input type="file" name="image" multiple @change="onFileChange">
      </div>

      <div class="form-group">
        <button type="submit" class="submit-button">პროდუქტის დამატება</button>
      </div>
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
      additionalname: JSON.parse(localStorage.getItem('additionalname')) || [],
      additionaldescription: JSON.parse(localStorage.getItem('additionaldescription')) || [],
      infocolumn: 1,
      islockedin: localStorage.getItem("islockedin") === "true" || false,
      isAdditionalinfo: localStorage.getItem("isAdditionalinfo") === "true" || false,
      Additionalinfo: [],
      maincategories: [],
      categories: [],
      subcategories: [],
      sizes: [],
      message: null,
      colorquantity: {},
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
        quantity: [],
        color: [],
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

  watch: {
    "form.Sizes": {
      handler(newSizes) {
        newSizes.forEach((size, index) => {
          if (!this.colorquantity[index]) {
            this.colorquantity[index] = 1;
          }
          if (!Array.isArray(this.form.color[index])) {
            this.form.color[index] = [];
          }
          if (!Array.isArray(this.form.quantity[index])) {
            this.form.quantity[index] = [];
          }
        });
      },
      deep: true
    }
  },

  methods: {
    toggleAdditionalInfo() {
      this.isAdditionalinfo = !this.isAdditionalinfo;  // Toggle the boolean value
      localStorage.setItem('isAdditionalinfo', this.isAdditionalinfo); // Save the updated boolean to localStorage
    },
    toggleisLockedin() {
      this.islockedin = !this.islockedin;
      localStorage.setItem('islockedin', this.islockedin);
      for (let i = 0; i < this.infocolumn; i++) {
        localStorage.setItem(`additionalname[${i}]`, this.additionalname[i]);
        localStorage.setItem(`additionaldescription[${i}]`, this.additionaldescription[i]);
      }
      localStorage.setItem('additionalname', JSON.stringify(this.additionalname));
      localStorage.setItem('additionaldescription', JSON.stringify(this.additionaldescription));
    },
    convertTojson() {
      const data = this.additionalname.map((name, index) => ({
        [name]: this.additionaldescription[index],
      }));
      return JSON.stringify(data);
    },
    decrease(index) {
      if (this.colorquantity[index] > 1) {
        this.colorquantity[index] -= 1;
      }
    },
    increase(index) {
      if (!(index in this.colorquantity)) {
        this.colorquantity[index] = 1;
      }
      this.colorquantity[index] += 1;
    },

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
      const token = localStorage.getItem('token');
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
        if (this.form.color[index] && this.form.quantity[index]) {
          this.form.color[index].forEach((color, colorIndex) => {
            formData.append(`color[${index}][${colorIndex}]`, color);
            formData.append(`quantity[${index}][${colorIndex}]`, this.form.quantity[index][colorIndex]);
          });
        }
      });
      const addadditionalinfo = this.convertTojson();
      formData.append('additionalinfo', addadditionalinfo);

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
  max-width: 100%;
  margin: 0 auto;
  padding: 40px;
  border-radius: 12px;
}

.seperate-additional {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  margin-top: 20px;
}

.seperate-additional input {
  display: flex;
  margin-top: 10px;
}

.quantity-control {
  display: flex;
  gap: 10px;
  align-items: center;
}

.quantity {
  padding: 10px;
  border: 1.5px solid #ddd;
  border-radius: 5px;
  background-color: transparent;
}



.additional-button {
  display: flex;
  padding: 10px 20px;
  background-color: #407236;
  color: white;
  border: none;
  width: 50%;
  margin: 10px auto;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 15px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.product-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.form-group input,
.form-group select,
.form-group input[type="file"] {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #007bff;
}

.size-input-group {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding: 20px;
}

.size-detail input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 16px;
  margin-bottom: 10px;
}

.submit-button {
  padding: 15px 25px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #0056b3;
}
</style>