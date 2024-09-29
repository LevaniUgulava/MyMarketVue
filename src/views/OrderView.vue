<template>
    <div>
        <div class="container"> 

            <div v-for="order in OrderProducts" :key="order.order_id">
                <h3>Order ID: {{ order.order_id }}</h3>
                <div class="card">
                <OrderComponentVue
                    v-for="product in order.products" 
                    :key="product.id"
                    :product="product"
                />
                </div>
               </div>

       </div>
    </div>
</template>

<script>
import OrderComponentVue from '@/components/OrderComponent.vue'
import axios from 'axios';

export default {
    components: {
        OrderComponentVue
    },
    data() {
        return {
            OrderProducts: []
        }
    },

    methods: {
        async getorder() {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/orders', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                this.OrderProducts = response.data; 
            } catch (error) {
                console.log(error);
            }
        }
    },

    mounted() {
        this.getorder();
    }
}
</script>

<style>
.container {
    margin-top: 8%;
}
.card {
    background-color: #f0f8ff;
    border-radius: 10px;     
    padding: 15px;            
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); 
    margin-bottom: 20px;     
    transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
    transform: translateY(-5px); 
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.3); 
}
h3{
    font-size: 0.6rem;
    color: rgb(196, 184, 184);
}

</style>
