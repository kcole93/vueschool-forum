<template>
  <div class="col-full not-found">
    <h1 class="not-found">🤔 Oops...</h1>
    <h2>The page you're looking for wasn't found.</h2>
    <router-link :to="{ name: 'Home' }">Check out some of the threads on our forum.</router-link>
  </div>
</template>

<script>
export default {
  created () {
    this.$emit('ready')
  }
};
</script>

<style scoped>
.not-found {
  margin-top: 10vh;
  width: 100%;
  text-align: center;
}

h1.not-found {
  font-size: 72px;
}

</style>
