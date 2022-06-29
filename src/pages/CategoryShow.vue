<template>
        <div 
          v-if="asyncDataStatus_ready"
          class="container">
          <h1>{{ category.name }}</h1>
          <forum-list
              :forums="getCategoryForums(category)"
              :title="category.name"
          />
        </div>
</template>

<script>
import ForumList from '@/components/ForumList.vue';
import { findById } from '@/helpers';
import asyncDataStatus from "@/mixins/asyncDataStatus";

export default {
  components: {
    ForumList,
  },
  mixins: [asyncDataStatus],
  props: {
    id: {
        required: true,
        type: String
    }
  },
  
  computed: {
      category() {
          return findById(this.categoriesStore.items, this.id) || {}
      }
  },
  methods: {
      getCategoryForums(category) {
          return this.forumsStore.items.filter(forum => forum.categoryId === category.id)
      }
  },
  async created () {
    const category = await this.categoriesStore.fetchCategory(this.id)
    const forums = await this.forumsStore.fetchForums({ ids: category.forums })
    this.asyncDataStatus_fetched();
  },
};
</script>

<style scoped>
</style>