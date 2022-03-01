<template>
  <div class="col-full">
    <h1 class="not-found">🤔 Oops...</h1>
    <h2>The page you're looking for wasn't found.</h2>
    <router-link :to="{ name: 'Home' }">Check out some of the threads on our forum.</router-link>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.not-found {
  font-size: 72px;
  width: 100%;
}
</style>
