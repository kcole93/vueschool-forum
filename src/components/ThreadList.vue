<template>
  <div class="col-full">
    <div v-if="threads" class="thread-list">
      <h2 class="list-title">Threads</h2>

      <div v-for="thread in threads" :key="thread.id" class="thread">
        <div>
          <p>
            <router-link
              v-if="thread.id"
              :to="{ name: 'ThreadShow', params: { id: thread.id } }"
              >{{ thread.title }}</router-link
            >
          </p>
          <p class="text-faded text-xsmall">
            By <a href="#">{{ userById(thread.userId).name }}</a
            >, <app-date :timestamp="thread.publishedAt"/>.
          </p>
        </div>

        <div class="activity">
          <p class="replies-count">
            {{ thread.repliesCount }}
            {{
              thread.repliesCount > 1 || thread.repliesCount === 0
                ? "replies"
                : "reply"
            }}
          </p>

          <img
            :src="userById(thread.userId).avatar"
            alt=""
            class="avatar-medium"
          />

          <div>
            <p class="text-xsmall">
              <a href="#">{{ userById(thread.userId).name }}</a>
            </p>
            <p class="text-xsmall text-faded">
              <app-date :timestamp="thread.publishedAt"/>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { findById } from '@/helpers';
export default {
  props: {
    threads: {
      required: true,
      type: Array,
    },
  },
  computed: {
    posts (){
      return this.forumStore.forumData.posts;
    },
    users () {
      return this.forumStore.forumData.users;
    },
  },
  methods: {
    postById(postId) {
      return findById(this.posts, postId);
    },
    userById(userId) {
      return findById(this.users, userId) || {};
    },
  },
};
</script>

<style scoped>
</style>