<template lang="">
        <div class="section">
          <div v-if="isVerified" class="side-section verified">
            <h3>ვერიფიკაცია</h3>
            <i class="fa-solid fa-circle-check"></i>
            <p>თქვენი ელფოსტა წარმატებით დადასტურდა. ახლა შეგიძლიათ პლატფორმის ყველა მახასიათებლის წვდომა.</p>
          </div>

          <div v-else class="side-section unverified">
            <h3>ვერიფიკაცია</h3>
            <i class="fa-solid fa-square-xmark"></i>
            <p>თქვენი ელფოსტა ჯერ არ დადასტურდა. გთხოვთ გაიაროთ ვერიფიკაცია თქვენი ელფოსტით.</p>
            <p>ვერიფიკაციისთვის დააჭირეთ<button class="sendbtn" @click.prevent="send">გაგზავნა</button></p>
            <div class="messageverify">
              {{ messageverify }}
            </div>
          </div>
        </div>
</template>
<script>
export default {

}
</script>
<style lang="">

</style>