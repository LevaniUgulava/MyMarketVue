<template>
  <div class="sidebar">
    <ul>
      <li><a href="/"><i class="fa-solid fa-house"></i>  Home</a></li>
      <li><a href="/cart"><i class="fa-solid fa-cart-shopping"></i>  Cart</a></li>
        <li><a href="/favorites"> <i class="fa-solid fa-heart"></i> Favorite</a></li>
      <li><a href="/orders"><i class="fa-solid fa-bag-shopping"></i> Orders</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
    
    };
  },
  methods: {
  }
};
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: #f8f8f8;
  color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  height: 100vh;
  position: sticky;
  top: 0;
}



.sidebar ul {
  list-style-type: none;
  padding: 0;
}

.sidebar ul li {
  margin: 20px 0;
  border-radius: 5px;
}

.sidebar ul li a,
.sidebar ul li button {
  text-decoration: none;
  color: black;
  display: block;
  padding: 10px;
  border-radius: 5px;
}

.sidebar ul li:hover {
  background-color:#cfc1c1a2;
}



@media (max-width: 390px) {
  .sidebar{
 width: 100%;
}
}

@media (max-width: 575px) {
.sidebar{
  width: 40%;

}

.sidebar ul li a{
    font-size: 0.7rem;

}


}

@media (min-width: 576px) and (max-width: 767px) {
.sidebar{
  width: 50%;

}
}




</style>
