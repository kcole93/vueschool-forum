<template>
  <h1>Welcome to the Forum!</h1>
  <CategoryList :categories="categories" />
</template>

<script>
import CategoryList from "@/components/CategoryList.vue";


export default {
  components: {
    CategoryList,
  },
  computed: {
    categories () {
      return this.forumStore.forumData.categories
    },
  },
};
</script>

<style scoped>
@import "../assets/style.css";
</style>
