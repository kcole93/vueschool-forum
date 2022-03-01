<template>
    <forum-list
      v-for="category in categories"
      :key="category.id"
      :forums="getCategoryForums(category)"
      :title="category.name"
      :category-id="category.id"/>
</template>

<script>
import sourceData from "@/data.json";
import ForumList from '@/components/ForumList.vue';
export default {
  components: {
     ForumList
  },
  props: {
    categories: {
      required: true,
      type: Array,
    },
  },
  data() {
    return {
      forums: sourceData.forums,
    };
  },
  methods: {
    getCategoryForums(category){
      return this.forums.filter((forum) => forum.categoryId === category.id);
    }
  }
};
</script>

<style>
</style>