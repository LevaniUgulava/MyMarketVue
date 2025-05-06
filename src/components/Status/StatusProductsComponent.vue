<template lang="">
  <div>
    <div class="header">
      <h3>Products for Status: {{ id }}</h3>
      
      <button class="add-button" @click="addSelected">Add to Selected</button>
          <div class="discount-input">
            <label for="discount">Discount:</label>
            <input
              type="number"
              min="0"
              max="100"
              v-model.number="discount"
              class="discount-field"
              placeholder="Enter discount"
            />
          </div>
    </div>
    <div v-if="filteredProducts.length > 0">
      <ul class="product-list">
        <li v-for="product in filteredProducts" :key="product.id" class="product-item">
          <input
            type="checkbox"
            :value="product.id"
            v-model="selectedProducts"
            class="custom-checkbox"
          />
          <h4>{{ product.name }}</h4>
          <p>{{ product.description }}</p>
          <p><strong>Price:</strong> ${{ product.price }}</p>
          <p><strong>Discount:</strong> {{ product.discount }}%</p>
        </li>
      </ul>

    </div>
    <div v-else>
      <p>No products found for this status.</p>
    </div>
  </div>
</template>

<script>
import api from "@/api";

export default {
  name: "StatusProductComponent",
  props: ["id"],

  data() {
    return {
      products: [],
      eligibleProductIds: [],
      filteredProducts: [],
      selectedProducts: [],
      pagination: {},
      discount: null
    };
  },
  methods: {
    async fetchEligibleProducts() {
      try {
        const response = await api.get(`admin/eligible/display/${this.id}`, {
          tokenRequired: true

        });
        this.eligibleProductIds = response.data.status.eligible_products.map((product) => product.id);
      } catch (error) {
        console.error("Error fetching eligible products:", error);
      }
    },
    async fetchAllProducts(page = 1) {
      try {
        const response = await api.get(`/admindisplay?page=${page}`, {
          tokenRequired: true

        });
        this.products = response.data.data;
        this.pagination = response.data.meta;
      } catch (error) {
        console.error("Error fetching all products:", error);
      }
    },
    async display(page = 1) {
      await this.fetchEligibleProducts();
      await this.fetchAllProducts(page);
      this.filterProducts();
    },
    filterProducts() {
      this.filteredProducts = this.products.filter(
        (product) => !this.eligibleProductIds.includes(product.id)
      );
    },
    changePage(page) {
      this.display(page);
    },
    async addSelected() {
      try {
        const response = await api.post(`admin/eligible/create/${this.id}`, { ids: this.selectedProducts, discount: this.discount }, {
          tokenRequired: true

        });
        this.display();
        console.log(response)
      } catch (error) {
        console.error("Error fetching eligible products:", error);
      }

    },
  },
  mounted() {
    this.display();
  },
};
</script>

<style scoped>
.discount-input {
  display: flex;
  align-items: center;
}

.discount-field {
  width: 150px;
  margin-left: 10px;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

h3 {
  font-size: 24px;
  margin-bottom: 15px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.product-item {
  padding: 15px;
  margin-bottom: 10px;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.product-item h4 {
  margin: 0 0 10px;
  font-size: 18px;
  color: #007bff;
}

.product-item p {
  margin: 5px 0;
  font-size: 14px;
  color: #555;
}

.product-item strong {
  font-weight: bold;
}

.custom-checkbox {
  margin-right: 10px;
  cursor: pointer;
}

.add-button {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  color: white;
  background-color: #28a745;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-button:hover {
  background-color: #218838;
}
</style>
