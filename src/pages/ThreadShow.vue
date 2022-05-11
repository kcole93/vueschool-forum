<template>
  <div 
    v-if="asyncDataStatus_ready"
    class="col-large push-top">
    <h1>
      {{ thread.title }}
      <router-link
        :to="{ name: 'ThreadEdit', params: { id: this.id } }"
        class="btn-green btn-small"
      >
        Edit Thread
      </router-link>
    </h1>
    <p>
      By <a href="#" class="link-unstyled">{{ thread.author?.name }}</a
      >, <app-date :timestamp="thread.publishedAt" />.
      <span class="thread-details hide-mobile text-faded text-small"
        >{{ thread.repliesCount }}
        {{ thread.repliesCount === 1 ? `reply` : `replies` }} by
        {{ thread.contributorsCount }}
        {{
          thread.contributorsCount > 1 ? `contributors` : `contributor`
        }}</span
      >
    </p>
    <post-list :posts="threadPosts" />
    <post-editor @save="addPost" />
  </div>
</template>

<script>
import PostList from "@/components/PostList";
import PostEditor from "@/components/PostEditor.vue";
import AppDate from "@/components/AppDate.vue";
import asyncDataStatus from '@/mixins/asyncDataStatus'; 

export default {
  components: {
    PostList,
    PostEditor,
    AppDate,
  },
  mixins: [asyncDataStatus],
  props: {
    id: {
      required: true,
      type: String,
    },
  },
  computed: {
    threads() {
      return this.forumStore.forumData.threads;
    },
    posts() {
      return this.forumStore.forumData.posts;
    },
    thread() {
      return this.forumStore.thread(this.id);
    },
    threadPosts() {
      return this.posts.filter((post) => post.threadId === this.id);
    },
  },
  methods: {
    addPost(eventData) {
      const post = {
        ...eventData.post,
        threadId: this.id,
      };
      this.forumStore.createPost(post);
    },
  },
  async created() {
    const thread = await this.forumStore.fetchThread(this.id)
    const posts = await this.forumStore.fetchPosts({ ids: thread.posts })
    const users = posts.map(post => post.userId).concat(thread.userId)
    await this.forumStore.fetchUsers({ ids: users })
    this.asyncDataStatus_fetched();
  }
}
</script>

<style scoped>
.thread-details {
  float: right;
  margin-top: 2px;
}
</style>