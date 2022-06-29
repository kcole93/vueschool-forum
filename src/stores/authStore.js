import {
    defineStore
} from 'pinia';
import firebase from 'firebase';


export const useAuthStore = defineStore("authStore", {
    state: () => {
        return {
            authId: null,
            authUserUnsubscribe: null,
            authObserverUnsubscribe: null,
        }
    },
    getters: {
        authUser: (state) => {
            return state.user(state.authId);
        },
    },
    actions: {
        initAuthentication() {
            // Use the On Auth State Changed Observer
            if (this.authObserverUnsubscribe) this.authObserverUnsubscribe();
            return new Promise((resolve) => {
                const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
                    console.log('👣 The user has changed.')
                    this.unsubscribeAuthUserSnapshot();

                    if (user) {
                        await this.fetchAuthUser();
                        resolve(user)
                    } else {
                        resolve(null)
                    }
                })

                this.setAuthObserverUnsubscribe(unsubscribe);
            })

        },
        async registerUserWithEmailAndPassword({
            avatar = null,
            email,
            name,
            username,
            password
        }) {
            const result = await firebase.auth().createUserWithEmailAndPassword(email, password)
            await this.createUser({
                id: result.user.uid,
                email,
                name,
                username,
                avatar
            })
        },
        async signInWithEmailAndPassword({
            email,
            password
        }) {
            return firebase.auth().signInWithEmailAndPassword(email, password);
        },
        async signInWithGoogle() {
            const provider = new firebase.auth.GoogleAuthProvider()
            const response = await firebase.auth().signInWithPopup(provider)

            const user = response.user
            const userRef = firebase.firestore().collection('users').doc(user.uid)
            const userDoc = await userRef.get()

            if (!userDoc.exists) {
                return this.createUser({
                    id: user.uid,
                    name: user.displayName,
                    email: user.email,
                    username: user.email,
                    avatar: user.photoURL
                })
            }

        },
        async signOut() {
            await firebase.auth().signOut();
            this.setAuthId(null);
        },
        async fetchAuthUser() {
            const userId = firebase.auth().currentUser?.uid
            if (!userId) return
            await this.fetchItem({
                resource: 'users',
                id: userId,
                emoji: '🔑👱 AuthUser ',
                handleUnsubscribe: (unsubscribe) => {
                    this.setAuthUserUnsubscribe(unsubscribe);
                }
            })
            this.setAuthId(userId);
        },
        async fetchAuthUsersPosts({
            startAfter
        }) {

            let query = firebase.firestore().collection('posts')
                .where('userId', '==', this.authId)
                .orderBy('publishedAt', 'desc')
                .limit(10)

            if (startAfter) {
                const doc = await firebase.firestore().collection('posts').doc(startAfter.id).get();
                query = query.startAfter(doc)
            }

            const posts = await query.get();
            posts.forEach(item => {
                this.setItem({
                    resource: 'posts',
                    item
                });
            })
        },
        appendUnsubscribe(unsubscribe) {
            this.unsubscribes.push(unsubscribe)
        },
        clearAllUnsubscribes() {
            this.unsubscribes = [];
        },
        async unsubscribeAllSnapshots() {
            this.unsubscribes.forEach(unsubscribe => unsubscribe())
            this.clearAllUnsubscribes();
        },
        async unsubscribeAuthUserSnapshot() {
            if (this.$state.authUserUnsubscribe) {
                this.$state.authUserUnsubscribe()
                this.setAuthUserUnsubscribe(null)
            }
        },
        setAuthId(id) {
            this.$state.authId = id;
        },
        setAuthUserUnsubscribe(unsubscribe) {
            this.$state.authUserUnsubscribe = unsubscribe;
        },
        setAuthObserverUnsubscribe(unsubscribe) {
            this.authObserverUnsubscribe = unsubscribe
        },
    }
})