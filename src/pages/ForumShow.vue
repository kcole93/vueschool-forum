<template>
  <div class="col-full push-top">
    <div class="forum-header">
      <div class="forum-details">
        <h1>{{ forum.name }}</h1>
        <p class="text-lead">{{ forum.description }}</p>
      </div>
      <router-link :to="{name: 'ThreadCreate', params: {forumId: forum.id }}" class="btn-green btn-small">Start a new thread</router-link>
    </div>
  </div>

  <div class="col-full push-top">
    <thread-list :threads="threads" />
  </div>
</template>

<script>
import ThreadList from '@/components/ThreadList.vue';
import { findById } from '@/helpers';
export default {
  components: {
    ThreadList,
  },
  props: {
    id: {
      required: true,
      type: String,
    },
  },
  computed: {
    forum() {
      return findById(this.forumStore.forumData.forums, this.id);
    },
    threads() {
      return this.forumStore.forumData.threads.filter((thread) => thread.forumId === this.id);
    },
  },
};
</script>

<style scoped>
</style>