<template lang="">
  <div class="eligible-product-component">
    <!-- Status Details -->
    <div class="status-card">
      <div class="status-header">
        <h2>{{ data.name }} Status</h2>
        <span class="badge">ID: {{ data.id }}</span>
      </div>
      <div class="status-body">
        <p><strong>To Achieve:</strong> ${{ data.toachieve }}</p>
        <p><strong>Discount:</strong> {{ data.discount }}%</p>
        <p><strong>Created At:</strong> {{ data.created_at || "N/A" }}</p>
        <p><strong>Updated At:</strong> {{ data.updated_at || "N/A" }}</p>
      </div>
    </div>

    <!-- Eligible Products -->
    <div class="eligible-products">
      <div class="eligible-header">
        <h3>Eligible Products</h3>
        <div class="action-buttons">
          <button class="add-button" @click="addEligible">Add Eligible</button>
          <button class="delete-button" @click="deleteSelected">Delete Selected</button>
        </div>
      </div>
      <div v-if="data.eligible_products && data.eligible_products.length" class="products-grid">
        <div v-for="product in data.eligible_products" :key="product.id" class="product-card">
          <div class="product-header">
            <input
              type="checkbox"
              :value="product.id"
              v-model="selectedProducts"
              class="custom-checkbox"
            />
            <h4>{{ product.name }}</h4>
          </div>
          <p class="product-description">{{ product.description }}</p>
          <div class="product-pricing">
            <p><strong>Price:</strong> ${{ product.price }}</p>
            <p><strong>Discount:</strong> {{ product.discount }}%</p>
            <p><strong>Discounted Price:</strong> ${{ product.discountprice }}</p>
          </div>
        </div>
      </div>
      <div v-else class="no-products">
        <p>No eligible products found for this status.</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "EligibleproductComponent",
  props: ["id"],
  data() {
    return {
      data: {}, // Status and products data
      selectedProducts: [], // Holds selected product IDs
    };
  },
  methods: {
    async display() {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`admin/eligible/display/${this.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.data = response.data.status;
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    },
    addEligible() {
      this.$router.push({ name: "productseligible", params: { id: this.id } });
    },
    async deleteSelected() {
         const token = localStorage.getItem("token");
      try {
        const response = await axios.post(`admin/eligible/delete/${this.id}`,{id:this.selectedProducts}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
.eligible-product-component {
  font-family: 'Roboto', sans-serif;
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.status-card {
  padding: 20px;
  background: linear-gradient(135deg, #e0f7fa, #80deea);
  border-radius: 12px;
  color: #004d40;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.status-header h2 {
  font-size: 24px;
  font-weight: bold;
}

.badge {
  background: #004d40;
  color: #fff;
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 14px;
}

/* Eligible Products Section */
.eligible-products {
  margin-top: 20px;
}

.eligible-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.eligible-header h3 {
  font-size: 22px;
  color: #00796b;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.add-button,
.delete-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.delete-button {
  background-color: #f44336;
}

.add-button:hover {
  background-color: #388e3c;
  transform: scale(1.05);
}

.delete-button:hover {
  background-color: #d32f2f;
  transform: scale(1.05);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.product-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.product-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.product-card h4 {
  font-size: 18px;
  font-weight: bold;
  color: #00796b;
  margin-bottom: 10px;
}

.product-description {
  font-size: 14px;
  color: #616161;
  margin-bottom: 15px;
}

.product-pricing p {
  font-size: 14px;
  margin: 5px 0;
}

.no-products {
  text-align: center;
  padding: 20px;
  font-size: 16px;
  color: #616161;
  font-style: italic;
}

.custom-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #00796b;
}
</style>
