<template>
  <div v-if="threadLoaded" class="col-full push-top">
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
  data () {
    return {
      threadLoaded: false,
    }
  },
  computed: {
    forum() {
      return findById(this.forumStore.forumData.forums, this.id);
    },
    threads() {
      if (!this.forum) return []
      return this.forum.threads.map(threadId => this.forumStore.thread(threadId));
    },
  },
  async created (){
    const forum = await this.forumStore.fetchForum(this.id)
    const threads = await this.forumStore.fetchThreads({ ids: forum.threads })
    await this.forumStore.fetchUsers({ ids: threads.map(thread => thread.userId) })
    this.threadLoaded = true;
  }, 
};
</script>

<style scoped>
</style>