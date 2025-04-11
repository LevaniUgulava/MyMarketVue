<template>
  <div class="single-order" v-if="!isLoading">
    <h2>Order Details</h2>

    <div class="order-info" v-if="order">
      <p><strong>Order ID:</strong> {{ order.id }}</p>
      <p><strong>Status:</strong> {{ order.status }}</p>
      <p><strong>Amount Paid:</strong> ${{ order.amount_paid }}</p>
      <p><strong>Created At:</strong> {{ formatDate(order.created_at) }}</p>
      <p><strong>Last Updated:</strong> {{ formatDate(order.updated_at) }}</p>
    </div>

    <h3>User Information</h3>
    <div class="user-info" v-if="order.user">
      <p><strong>User ID:</strong> {{ order.user.id }}</p>
      <p><strong>Name:</strong> {{ order.user.name }}</p>
      <p><strong>Email:</strong> {{ order.user.email }}</p>
      <p><strong>Total Spent:</strong> ${{ order.user.total_spent }}</p>
    </div>

    <h3>Products</h3>
    <div class="products" v-if="order.products">
      <div v-for="product in order.products" :key="product.id" class="product-card">
        <h4>ID:{{ product.id }}</h4>
        <h4>{{ product.name }}</h4>
        <p><strong>Price:</strong> ${{ product.price }}</p>
        <p><strong>Description:</strong> {{ product.description }}</p>
        <p><strong>Quantity:</strong> {{ product.pivot.quantity }}</p>
        <p><strong>Size:</strong> {{ product.pivot.size }}</p>
        <p><strong>Total Price:</strong> ${{ product.pivot.total_price }}</p>
        <div v-if="product.image_urls.length > 0" class="product-images">
          <img v-for="image in product.image_urls" :key="image" :src="image" alt="Product Image"
            class="product-image" />
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Loading order details...</p>
  </div>
</template>

<script>
import api from "@/api";

export default {
  props: ["id"],

  data() {
    return {
      order: null,
      isLoading: true,
    };
  },

  methods: {
    formatDate(date) {
      return new Date(date).toLocaleString();
    },

    async getsingleorder() {
      try {
        const response = await api.get(`admin/orders/${this.id}`, {
          tokenRequired: true

        });
        this.order = response.data.order;
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },

  mounted() {
    this.getsingleorder();
  },
};
</script>

<style scoped>
.single-order {
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 100%;
  margin: 0 auto;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
}

h2,
h3 {
  margin-bottom: 10px;
}

.order-info,
.user-info {
  margin-bottom: 20px;
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 15px;
  background: #fff;
}

.product-images {
  margin-top: 10px;
}

.product-image {
  width: 100px;
  height: auto;
  margin-right: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style>
