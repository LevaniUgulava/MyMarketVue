<template lang="html">
  <div class="about-us">
    <h1>{{$t('footer.about.title')}}</h1>
    <p>
     {{$t('footer.about.txt1')}}   
    </p>
    <p>
     {{$t('footer.about.txt2')}}   
    </p>
    <p>
     {{$t('footer.about.txt3')}}   
    </p>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.about-us {
  font-family: 'Arial', sans-serif;
  color: #333;
  line-height: 1.6;
  padding: 20px;
  margin: 0;
  background-color: #ffffff;
  box-sizing: border-box;
  min-height: 100vh;
  width: 100%;
}

h1 {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #222;
  text-align: left;
}

p {
  font-size: 1rem;
  margin: 10px 0;
  text-align: justify;
  color: #555;
}
</style>

