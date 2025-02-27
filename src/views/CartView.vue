<template>
    <Message v-if="verifymessageerror" :message="verifymessageerror" :backgroundColor="'#f8d7da'" :textColor="'#721c24'"
        @close="remove" />
    <div class="cart-container">
        <CartComponent @verfifyerrormessage="handleVerifyErrorMessage" />
    </div>

</template>

<script>
import CartComponent from '@/components/CartComponent.vue'
import Message from '@/components/Message/MessageComponent.vue'
export default {
    name: 'CartView',

    components: {
        CartComponent,
        Message
    },
    data() {
        return {
            verifymessageerror: '',
        }
    },
    methods: {
        handleVerifyErrorMessage(message) {
            this.verifymessageerror = message;
        },
        remove() {
            this.verifymessageerror = '';
        }
    }

}
</script>
<style scoped>
.cart-container {
    border-radius: 10px;
    padding: 10px;
    transition: transform 0.3s, box-shadow 0.3s;
}
</style>