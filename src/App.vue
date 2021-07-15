<template>
  <LoggedOut v-if="!user"/>
  <LoggedIn v-else @log="onLogSession" :state="state" :log_col="log_col"/>
</template>

<script>
import LoggedOut from './components/LoggedOut.vue'
import LoggedIn from './components/LoggedIn.vue'
import {db, auth, provider} from './firebase.js'

export default {
  name: 'App',
  components: {
    LoggedOut,
    LoggedIn,
  },
  data() {
    return {
      user: null,
      user_doc: null,
      user_students: null,
      log_col: null,
      goal_col: null,
      state: 'dashboard',
    }
  },
  methods: {
    onLogSession() {
      this.state = 'session-logger'
    }
  },
  firestore: {

  },
  created() {
    auth.onAuthStateChanged(user => {
        if (user) {
          this.user = user
          this.$bind('user_doc', db.doc(`users/${user.uid}`))
          this.$bind('user_students', db.doc(`users/${user.uid}`).collection('students'))
          this.$bind('log_col', db.collection(`logs`))
          this.$bind('goal_col', db.collection(`goals`))
        }
        else {
          this.user = null
          this.$unbind('user_doc')
          this.$unbind('user_students')
        }
    })
  }
}
</script>