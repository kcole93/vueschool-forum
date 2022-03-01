<template>
        <h1>{{ category.name }}</h1>
        <forum-list
            :forums="getCategoryForums(category)"
            :title="category.name"
        />
</template>

<script>
import sourceData from '@/data.json'
import ForumList from '@/components/ForumList.vue'
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
  data () {
      return {
          categories: sourceData.categories,
          forums: sourceData.forums,
      }
  },
  computed: {
      category() {
          return this.categories.find(category => category.id === this.id)
      }
  },
  methods: {
      getCategoryForums(category) {
          return this.forums.filter(forum => forum.categoryId === category.id)
      }
  }
};
</script>

<style scoped>
</style>