<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">
    <h1>
      Create new thread in <i>{{ forum.name }}</i>
    </h1>

    <ThreadEditor @save="save" @cancel="cancel" />
  </div>
  
</template>

<script>
import ThreadEditor from '@/components/ThreadEditor.vue';
import { findById } from '@/helpers';
import asyncDataStatus from '@/mixins/asyncDataStatus';

export default {
    components: {
      ThreadEditor,
    },
    mixins: [asyncDataStatus],
    props: {
        forumId: {type: String, required: true},
    },
    computed: {
        forum() {
            return findById(this.forumStore.forumData.forums, this.forumId) || {}
        }
    },
    methods: {
        async save ({ title, text}) {
           const thread = await this.forumStore.createThread({
                forumId: this.forumId,
                title,
                text
        });
        this.$router.push({name: 'ThreadShow', params: { id: thread.id }});
    },
    cancel () {
        this.$router.push({name: 'ForumShow', params: { id: this.forumId }});
    }
},
async beforeCreate () {
 await this.forumStore.fetchForum(this.forumId);
 this.asyncDataStatus_fetched();
},
}
</script>

<style scoped>

</style>