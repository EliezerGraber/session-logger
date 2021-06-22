<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <LoggedOut v-if="!user"/>
  <User v-else/>
</template>

<script>
import LoggedOut from './components/LoggedOut.vue'
import User from './components/User.vue'
import {db, auth, provider} from './firebase.js'

export default {
  name: 'App',
  components: {
    LoggedOut,
    User
  },
  data() {
    return {
      firebaseData: null,
      user: null,
    }
  },
  methods: {
    
  },
  firestore: {
    firebaseData: db.doc('test/a'),
  },
  created() {
    auth.onAuthStateChanged(user => {
        if (user) {
            this.user = user
        }
        else {
          this.user = null
        }
    })
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
