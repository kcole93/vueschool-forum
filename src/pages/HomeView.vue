<template>
  <h1 class="push-top">Welcome to the Forum!</h1>
  <CategoryList :categories="categories" />
</template>

<script>
import CategoryList from "@/components/CategoryList.vue";


export default {
  components: {
    CategoryList,
  },
  data(){
    return {
      ready: false
    }
  },
  computed: {
    categories () {
      return this.forumStore.forumData.categories
    },
  },
  async beforeCreate() {
    const categories = await this.forumStore.fetchAllCategories();
    const forumIds = categories.map(category => category.forums).flat()
    this.forumStore.fetchForums({ids: forumIds});
  }
};
</script>

<style scoped>
@import "../assets/style.css";
</style>
