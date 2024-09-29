<template>
<div class="cart-container">
      <CartComponent />
      </div>

</template>

<script>
import CartComponent from '@/components/CartComponent.vue'
export default {
    name:'CartView',
    components:{
        CartComponent,
    }
}
</script>
<style scoped>
.cart-container{
    background-color: #f2f4f6;
    margin-top: 6%;
    border-radius: 10px;     
    padding: 10px;            
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); 
    transition: transform 0.3s, box-shadow 0.3s;
    }
</style>