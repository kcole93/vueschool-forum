import { defineStore } from 'pinia';
import { findById, upsert, docToResource} from '@/helpers';
import firebase from 'firebase';

export const useForumStore = defineStore("forumStore", {
    state: () => {
        return {
            forumData: {
                categories: [],
                forums: [],
                threads: [],
                posts: [],
                users: [],
            },
            authId: null,
            unsubscribes: []
        }
    },
    getters: {
        authUser: (state) => {
            return state.user(state.authId);
        },
        user: (state) => {
            return (id) => {
                const user = findById(state.forumData.users, id);
                if (!user) return null
                return {
                    ...user,
                    get posts() {
                        return state.forumData.posts.filter(post => post.userId === user.id);
                    },
                    get postsCount() {
                        return user.postsCount || 0
                    },
                    get postsSorted() {
                        return [...this.posts].sort((a, b) => b.publishedAt - a.publishedAt);
                    },
                    get threads() {
                        return state.forumData.threads.filter(thread => thread.userId === user.id);
                    },
                    get threadsCount() {
                        return user.threads?.length || 0
                    },
                }
            }
        },
        thread: state => {

            return (id) => {
                const thread = findById(state.forumData.threads, id)
                if (!thread) return {}
                return {
                    ...thread,
                    get author() {
                        return thread ? findById(state.forumData.users, thread.userId) : []
                    },
                    get repliesCount() {
                        return thread ? thread.posts.length - 1 : 0
                    },
                    get contributorsCount() {
                        return thread ? thread.contributors.length : 0
                    }
                }
            }
        }
    },
    actions: {
       // Fetch Multiple Resources
       fetchItems({ ids, resource, emoji}) {
        return Promise.all(ids.map(id =>
            this.fetchItem({ resource, id, emoji })
        ))
        },
       fetchCategories({ ids }) {
            return this.fetchItems({ resource: 'categories', ids: ids, emoji: '🐈 Categories '})
        },
        fetchForums({ ids }) {
            return this.fetchItems({ resource: 'forums', ids: ids, emoji: '🗒 Forums ' })
        },
        fetchThreads({ ids }) {
            return this.fetchItems({ resource: 'threads', ids: ids, emoji: '🧵 Threads ' })
        },
        fetchPosts({ ids }) {
            return this.fetchItems({ resource: 'posts', ids: ids, emoji: 'Posts ' })
        },
        fetchUsers({ ids }) {
            return this.fetchItems({ resource: 'users', ids: ids, emoji: '👱 Users ' })
        },
        // Fetch Single Resource
        fetchItem({ resource, id, emoji  }) {
            console.log('🔥', emoji, id);
            // Fetch a Item
            return new Promise((resolve) => {
               const unsubscribe =  firebase
                    .firestore()
                    .collection(resource)
                    .doc(id)
                    .onSnapshot((doc) => {
                        const item = { ...doc.data(), id: doc.id };
                        this.setItem({ resource: resource, item: item });
                        resolve(item)
                    })

                    this.appendUnsubscribe(unsubscribe)
            })
        },
        fetchCategory (id) {
            return this.fetchItem({ resource: 'categories', id, emoji: '🐈 Category ' })
        },
        fetchForum(id) {
            return this.fetchItem({ resource: 'forums', id, emoji: '🗒 Forum ' })
        },
        fetchThread(id) {
            return this.fetchItem({ resource: 'threads', id, emoji: '🧵 Thread ' })
        },
        fetchPost(id) {
            return this.fetchItem({ resource: 'posts', id, emoji: 'Post ' });
        },
        fetchUser(id) {
            return this.fetchItem({ resource: 'users', id, emoji: '👱 User ' })
        },
        fetchAuthUser () {
            const userId = firebase.auth().currentUser?.uid
            if(!userId) return
            this.fetchItem({ resource: 'users', id: userId, emoji: '🔑👱 AuthUser '})
            this.setAuthId(userId);
        },
        appendUnsubscribe(unsubscribe){
            this.unsubscribes.push(unsubscribe)
        },
        clearAllUnsubscribes(){
            this.unsubscribes = [];
        },
        async unsubscribeAllSnapshots() {
            this.unsubscribes.forEach(unsubscribe => unsubscribe())
            this.clearAllUnsubscribes();
        },
        // Create Resources
        async createPost(post) {
            post.publishedAt = firebase.firestore.FieldValue.serverTimestamp()
            post.userId = this.authId
            
            // Create batch and commit to firestore
            const batch = firebase.firestore().batch()
            const postRef = firebase.firestore().collection('posts').doc()
            const threadRef = firebase.firestore().collection('threads').doc(post.threadId)
            const userRef = firebase.firestore().collection('users').doc(this.authId)
            batch.set(postRef, post)
            
            batch.update(threadRef, {
                posts: firebase.firestore.FieldValue.arrayUnion(postRef.id),
                contributors: firebase.firestore.FieldValue.arrayUnion(this.authId)
            })
            batch.update(userRef, {
                postsCount: firebase.firestore.FieldValue.increment(1)
            })

            await batch.commit()

            // Commit to Pinia Store
            const newPost = await postRef.get()
            this.setItem({ resource: 'posts', item: {...newPost.data(), id: newPost.id} }); // set the post
            this.appendPostToThread(this.forumData, { parentId: post.threadId, childId: newPost.id })
            this.appendContributorToThread(this.forumData, { parentId: newPost.threadId, childId: this.authId })
        },
        createId() {
            return "gggg" + Math.random();
        },
        appendPostToThread: makeAppendChildToParent({ parent: 'threads', child: 'posts' }),
        appendThreadToForum: makeAppendChildToParent({ parent: 'forums', child: 'threads' }),
        appendThreadToUser: makeAppendChildToParent({ parent: 'users', child: 'threads' }),
        appendContributorToThread: makeAppendChildToParent({ parent: 'threads', child: 'contributors' }),
        async createThread({ text, title, forumId }) {
            const publishedAt = firebase.firestore.FieldValue.serverTimestamp();
            const userId = this.authId
            const threadRef = firebase.firestore().collection('threads').doc()
            const thread = { forumId, title, publishedAt, userId, id: threadRef.id }

            const userRef = firebase.firestore().collection('users').doc(userId)
            const forumRef = firebase.firestore().collection('forums').doc(forumId)
            const batch = firebase.firestore().batch()
            
            batch.set(threadRef, thread)
            
            batch.update(userRef, {
                threads: firebase.firestore.FieldValue.arrayUnion(threadRef.id)
            })
            batch.update(forumRef, {
                threads: firebase.firestore.FieldValue.arrayUnion(threadRef.id)
            })

            await batch.commit()
            const newThread = await threadRef.get()

            this.setItem({ resource: 'threads', item: {...newThread.data(), id: newThread.id } }) // set thread
            this.appendThreadToForum(this.forumData, { parentId: forumId, childId: threadRef.id })
            this.appendThreadToUser(this.forumData, { parentId: userId, childId: threadRef.id })
            const post = { text: text, threadId: threadRef.id }
            await this.createPost(post)
            return findById(this.forumData.threads, threadRef.id)

        },
        // Update resources
        setItem({resource, item}) {
            upsert(this.forumData[resource], docToResource(item))
        },
        setAuthId(id){
            this.$state.authId = id;
        },
        async updateThread({ text, title, id }) {
            const thread = findById(this.forumData.threads, id);
            const post = findById(this.forumData.posts, thread.posts[0]);
            let newThread = { ...thread, title }
            let newPost = { ...post, text }
            
            const threadRef = firebase.firestore().collection('threads').doc(id)
            const postRef = firebase.firestore().collection('posts').doc(post.id)
            const batch = firebase.firestore().batch()

            batch.update(threadRef, newThread)
            batch.update(postRef, newPost)
            await batch.commit()

            newThread = await threadRef.get()
            newPost = await postRef.get()

            this.setItem({ resource: 'threads', item: newThread})
            this.setItem({ resource: 'posts', item: newPost })
            return docToResource(newThread);
        },
        updateUser(user) {
            this.setItem({ resource: 'user', item: user })
        },
        async updatePost(text, id) {
            const post = {
                text,
                edited: {
                    at: firebase.firestore.FieldValue.serverTimestamp(),
                    by: this.authId,
                    moderated: false
                }
            }

            const postRef = firebase.firestore().collection('posts').doc(id)
            await postRef.update(post)
            const updatedPost = await postRef.get()
            this.setItem({ resource: 'posts', item: updatedPost })
        },
        fetchAllCategories() {
            return new Promise((resolve) => {
               const unsubscribe = firebase.firestore().collection('categories').onSnapshot((querySnapshot) => {
                const categories = querySnapshot.docs.map(doc => {
                    const item = { id: doc.id, ...doc.data() }
                    this.setItem({ resource: 'categories', item: item })
                    return item
                })
                resolve(categories)
            })

            this.appendUnsubscribe(unsubscribe)
        })
        },
        async registerUserWithEmailAndPassword ( { avatar = null, email, name, username, password }) {
            const result = await firebase.auth().createUserWithEmailAndPassword(email, password)
            await this.createUser( { id: result.user.uid, email, name, username, avatar } )
        },
        async signInWithEmailAndPassword( {email, password} ){
            return firebase.auth().signInWithEmailAndPassword(email, password);
        },
        async signOut(){
            await firebase.auth().signOut();
            this.setAuthId(null);
        },
        async createUser( { id, email, name, username, avatar = null } ) {
            const registeredAt = firebase.firestore.FieldValue.serverTimestamp()
            const usernameLower = username.toLowerCase()
            email = email.toLowerCase()
    
            const user = {avatar, email, name, username, usernameLower, registeredAt }
    
            const userRef = await firebase.firestore().collection('users').doc(id)
            userRef.set(user)
    
            const newUser = await userRef.get()
            this.setItem({resource: 'users', item: newUser })
            return docToResource(newUser)
        }
    }
})


// Implementation Functions
function makeAppendChildToParent({ parent, child }) {
    return (state, { childId, parentId }) => {
        const resource = findById(state[parent], parentId)
        if(!resource) {
            console.warn(`Appending ${child} ${childId} to ${parent} ${parentId} failed because the parent didn't exist.`)
            return
        }
        resource[child] = resource[child] || []
        if (!resource[child].includes(childId)) {
            resource[child].push(childId)
        }
    }
}