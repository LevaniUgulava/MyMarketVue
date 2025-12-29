import { ref } from "vue";

export const globalCartUpdateVariable = ref(false);

export function updateCartStatus(){
    globalCartUpdateVariable.value = !globalCartUpdateVariable.value
}
