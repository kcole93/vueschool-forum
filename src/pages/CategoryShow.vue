<template>
        <h1>{{ category.name }}</h1>
        <forum-list
            :forums="getCategoryForums(category)"
            :title="category.name"
        />
</template>

<script>
import ForumList from '@/components/ForumList.vue';
import { findById } from '@/helpers';
export default {
  components: {
    ForumList,
  },
  props: {
    id: {
        required: true,
        type: String
    }
  },
  
  computed: {
      category() {
          return findById(this.forumStore.forumData.categories, this.id)
      }
  },
  methods: {
      getCategoryForums(category) {
          return this.forumStore.forumData.forums.filter(forum => forum.categoryId === category.id)
      }
  }
};
</script>

<style scoped>
</style>