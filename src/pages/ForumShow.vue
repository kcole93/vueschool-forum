<template>
  <div 
  v-if="asyncDataStatus_ready"
  class="container">
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
      <v-pagination
        class="pagination"
        v-model="page"
        :pages="totalPages"
        active-color="#57AD8D"
      />
    </div>
  </div>
</template>

<script>
import ThreadList from '@/components/ThreadList.vue';
import { findById } from '@/helpers';
import asyncDataStatus from '@/mixins/asyncDataStatus';

export default {
  components: {
    ThreadList,
  },
  mixins: [asyncDataStatus],
  props: {
    id: {
      required: true,
      type: String,
    },
  },
  data () {
    return {
      threadLoaded: false,
      page: parseInt(this.$route.query.page) || 1,
      perPage: 10
    }
  },
  computed: {
    forum() {
      return findById(this.forumsStore.items, this.id);
    },
    threads() {
      if (!this.forum) return []
      return this.threadsStore.items
      .filter(thread => thread.forumId === this.forum.id)
      .map(thread => this.threadsStore.items(thread.id));
    },
    threadCount(){
      return this.forum.threads.length;
    },
    totalPages(){
      // Calculate total number of pages for pagination component
      if(!this.threadCount) return 0;
      return Math.ceil(this.threadCount / this.perPage);
    },
  },
  async created (){
    const forum = await this.forumsStore.fetchForum(this.id)
    const threads = await this.forumsStore.fetchThreadsByPage({ ids: forum.threads, page: this.page, perPage: this.perPage })
    await this.usersStore.fetchUsers({ ids: threads.map(thread => thread.userId) })
    this.asyncDataStatus_fetched();
  },
  watch: {
    async page (page) {
      this.$router.push({ query: { page: this.page }})

    }
  } 
};
</script>

<style scoped>
</style>