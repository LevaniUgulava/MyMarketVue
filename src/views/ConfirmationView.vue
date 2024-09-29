<template lang="">
  <head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  </head>
  <div class="container">
    <div class="correct">
      <i class="fa-solid fa-check fa-3x"></i>
    </div>

    <h1>You Registered Succesfully!!</h1>
    <h3>Please Check your Email for Confirmation</h3>
  </div>

</template>
<script>
export default {
    
}
</script>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Full viewport height */
  text-align: center; 
}
.correct {
  background-color: rgb(17, 204, 17); 
  color: white; 
  width: 80px; 
  height: 80px; 
  border-radius: 50%; 
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>