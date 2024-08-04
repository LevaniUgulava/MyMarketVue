<template lang="">
    <div>
        <HeaderComponentVue/>

        <CartComponent/>
        
    </div>
</template>
<script>
import HeaderComponentVue from '@/components/HeaderComponent.vue'
import CartComponent from '@/components/CartComponent.vue'
export default {
    name:'CartView',
    components:{
        HeaderComponentVue,
        CartComponent
    }
}
</script>
<style scoped>
    
</style>