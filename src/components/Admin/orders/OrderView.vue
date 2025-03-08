<template>
    <div>
        <div v-if="OrderProducts.length > 0 && !isLoading">
            <div class="filters">
                <input 
                    type="text" 
                    v-model="searchQuery" 
                    placeholder="Search by Order ID or User Name" 
                />
                <select v-model="selectedStatus" class="status-select">
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
                <select v-model="status" class="status-select">
                    <option value="">Update Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
                <button @click="updateStatus" class="update-status-btn">Update Status</button>
            </div>
            <div class="orders">
                <div 
                    v-for="order in filteredOrders" 
                    :key="order.order_id" 
                    class="card"
                >
                    <div class="checkbox-container">
                          <input 
                            type="checkbox" 
                            :value="order.order_id" 
                            v-model="selectedOrders"
                          />
                         
                    </div>
                    <router-link :to="'orders/' + order.order_id" class="link">
                    <div class="order-header">
                        <h3>Order ID: {{ order.order_id }}</h3>
                        <span 
                            class="status" 
                            :class="order.order_status"
                        >
                            {{ order.order_status }}
                        </span>
                    </div>
                    <p>Paid: ${{ order.order_amount }}</p>
                    <!-- <p>User: {{ order.user.name }}</p> -->
                    <div class="products">
                        <OrderComponentVue
                            v-for="product in order.products" 
                            :key="product.id"
                            :product="product"
                            :order_status="order.order_status"
                        />
                    </div>
                  </router-link>
                </div>

            </div>
        </div>
        <div v-else-if="isLoading">Loading orders...</div>
        <div v-else>No orders found.</div>
    </div>

</template>

<script>
import OrderComponentVue from '@/components/OrderComponent.vue';
import axios from 'axios';

export default {
    components: {
        OrderComponentVue,
    },
    data() {
        return {
            OrderProducts: [],
            isLoading: true,
            searchQuery: '',
            selectedStatus: '',
            selectedOrders: [],
            status:''
        };
    },
    computed: {
        filteredOrders() {
            return this.OrderProducts.filter(order => {
                const matchesQuery = 
                    order.order_id.toString().includes(this.searchQuery) || 
                    (order.user.name && order.user.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
                const matchesStatus = 
                    !this.selectedStatus || 
                    order.order_status === this.selectedStatus;

                return matchesQuery && matchesStatus;
            });
        },
    },
    methods: {
        async getOrders() {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('admin/orders', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                this.OrderProducts = response.data.orders;
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                this.isLoading = false;
            }
        },

        async updateStatus() {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.post(
                    '/admin/update/status', 
                    {
                        id: this.selectedOrders,
                        status:this.status,
                    },
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        },
                    }
                );
                this.getOrders();
                console.log('Status updated:', response.data);
                this.selectedOrders = [];
                this.status = '';
            } catch (error) {
                console.error('Error updating status:', error);
            }
        },
    },
    mounted() {
        this.getOrders();
    },
};
</script>

<style>
.link{
    text-decoration: none;
    color: #000000;
}
body {
    font-family: Arial, sans-serif;
    background-color: #f9f9f9;
    margin: 0;
    padding: 0;
}

.orders {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    padding: 20px;
}

.card {
    background-color: #fff;
    border-radius: 10px;
    padding: 15px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.3);
}

.filters {
    display: flex;
    gap: 10px;
    margin: 20px;
    flex-wrap: wrap;
    align-items: center;
}

.filters input, .filters select, .update-status-btn {
    margin-top: 1%;
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    flex: 1;
    min-width: 120px;
}

.order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.status {
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 0.9rem;
    text-transform: capitalize;
    color: #fff;
}

.status.pending {
    background-color: #ffc107;
}

.status.completed {
    background-color: #28a745;
}

.status.cancelled {
    background-color: #dc3545;
}

.products {
    margin-top: 15px;
    border-top: 1px solid #ddd;
    padding-top: 10px;
}

p {
    margin: 5px 0;
}

h3 {
    margin: 0;
    font-size: 1.2rem;
}

.loading {
    text-align: center;
    font-size: 1.5rem;
    color: #555;
}

.checkbox-container {
    margin-top: 10px;
}

.checkbox-container input {
    margin-right: 5px;
}

button {
    padding: 10px 15px;
    font-size: 1rem;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}

.status-select {
    margin-top: 10px;
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #ddd;
    border-radius: 5px;
}

.update-status-btn {
    margin-top: 1%;
    background-color: #28a745;
    color: white;
    font-size: 1rem;
    cursor: pointer;
    margin-left: 10px;
}

.update-status-btn:hover {
    background-color: #218838;
}
</style>
