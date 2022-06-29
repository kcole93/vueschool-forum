<template>
  <div v-if="asyncDataStatus_ready" class="col-large push-top">
    <h1>
      {{ thread.title }}
      <router-link
        :to="{ name: 'ThreadEdit', params: { id: this.id } }"
        v-if="thread.userId === authUser?.id"
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
    <post-editor v-if="authUser" @save="addPost" />
    <div v-else class="sign-in-prompt text-center">
      <router-link :to="{ name: 'SignIn', query: { redirectTo: $route.path } }"
        >Sign In</router-link
      >
      or
      <router-link
        :to="{ name: 'Register', query: { redirectTo: $route.path } }"
        >Register</router-link
      >
      to reply.
    </div>
  </div>
</template>

<script>
import PostList from "@/components/PostList";
import PostEditor from "@/components/PostEditor.vue";
import AppDate from "@/components/AppDate.vue";
import asyncDataStatus from "@/mixins/asyncDataStatus";
import useNotifications from "@/composables/useNotifications";
import difference from "lodash/difference";

export default {
  components: {
    PostList,
    PostEditor,
    AppDate,
  },
  setup() {
    const { addNotification } = useNotifications();
    return { addNotification };
  },
  mixins: [asyncDataStatus],
  props: {
    id: {
      required: true,
      type: String,
    },
  },
  computed: {
    authUser() {
      return this.authStore.authUser;
    },
    threads() {
      return this.threadsStore.items;
    },
    posts() {
      return this.postsStore.items;
    },
    thread() {
      return this.threadsStore.thread(this.id);
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
      this.postsStore.createPost(post);
    },
    async fetchPostsWithUsers(ids){
      const posts = await this.postsStore.fetchPosts({ ids: ids });
      const users = posts.map((post) => post.userId).concat(this.thread.userId);
      await this.usersStore.fetchUsers({ ids: users });
    }
  },
  async created() {
    const thread = await this.threadsStore.fetchThread({
      id: this.id,
      onSnapshot: async ({ isLocal, item, previousItem }) => {
        if (isLocal || !this.asyncDataStatus_ready) return
        const newPosts = difference(item.posts, previousItem.posts)
        await this.fetchPostsWithUsers(newPosts);
        this.addNotification({ message: 'Thread recently updated' });
      },
    });
    await this.fetchPostsWithUsers(thread.posts);
    this.asyncDataStatus_fetched();
  },
};
</script>

<style scoped>
.thread-details {
  float: right;
  margin-top: 2px;
}

.sign-in-prompt {
  margin-bottom: 50px;
}
</style>