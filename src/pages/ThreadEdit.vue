<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">
    <h1>
      Editing: <i>{{ thread.title }}</i>
    </h1>

    <ThreadEditor :title="thread.title" :text="text" @save="save" @cancel="cancel" @dirty="formIsDirty = true" @clean="formIsDirty = false" />
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
        id: {type: String, required: true},
    },
    data(){
      return {
        formIsDirty: false,
      }
    },
    computed: {
        thread() {
            return findById(this.forumStore.forumData.threads, this.id)
        },
        text() {
            const post = findById(this.forumStore.forumData.posts, this.thread.posts[0])
            return post? post.text : ''
        },
    },
    methods: {
        async save ({ title, text}) {
           const thread = await this.forumStore.updateThread({
                id: this.id,
                title,
                text
        })
        this.$router.push({name: 'ThreadShow', params: { id: thread.id }});
    },
    cancel () {
        this.$router.push({name: 'ThreadShow', params: { id: this.id }});
    }
},
async created () {
  const thread = await this.forumStore.fetchThread(this.id);
  this.forumStore.fetchPost(thread.posts[0])
  this.asyncDataStatus_fetched();
},
beforeRouteLeave(){
  
  if(this.formIsDirty){
    const confirmed = window.confirm('Are you sure you want to leave this page? Unsaved changes will be lost!')

    if(!confirmed) return false
  }   

},
}
</script>

<style scoped>

</style>