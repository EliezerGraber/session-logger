<template>
  <router-view/>
</template>

<script>
import LoggedOut from './views/LoggedOut.vue'
import LoggedIn from './components/LoggedIn.vue'
import {db, auth, provider} from './firebase.js'
import firebase from 'firebase/app'

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
    }
  },
  created() {
    auth.onAuthStateChanged(user => {
        if (user) {
          this.user = user
          this.$bind('user_doc', db.doc(`users/${user.uid}`))
          this.$bind('user_students', db.doc(`users/${user.uid}`).collection('students'))
          this.$bind('log_col', db.collection(`logs`))
          this.$bind('goal_col', db.collection(`goals`))
          /*psuedocode to check is user has an account
          if(user.uid is in userlist) {
            this.logged_in = true
          }
          else {
            alert(No account associated with this email address. Please reach out to an admin.)
          }
          */
        }
        else {
          this.user = null
          this.$unbind('user_doc')
          this.$unbind('user_students')
          this.logged_in = false
        }
    })
  }
}
</script>