<template>
  <Nav/>
  reminder to check if is user or admin. put router-view in app, and nav in necessary components
  <router-view/>
</template>

<script>
/*
<div v-if="state=='dashboard'">
    <User v-if="this.$parent.user_students.length>0" :user="this.$parent.user" :user_doc="this.$parent.user_doc" :user_students="this.$parent.user_students" :log_col="log_col" />
    <Admin v-if="this.$parent.user_doc && this.$parent.user_doc.is_admin"/>
  </div>
*/
import {auth} from '../firebase.js'
//import User from './User.vue'
//import Admin from './Admin.vue'
import Nav from './Nav.vue'
import firebase from 'firebase/app'

export default {
  name: 'LoggedIn',
  components: {
    Nav,
  },
  data() {
    return {
  
    }
  },
  emits: {
      log: null
  },
  computed: {
    ownedLogs: function() {
      const user = firebase.auth().currentUser
      var owned_docs = null
      if (user !== null) {
        owned_docs = this.$parent.log_col.filter(log => {
          return log.uid === user.uid
        })
      }
      return owned_docs
    },
  },
  methods: {
    logOut() {
      auth.signOut()
      this.$router.push("/")
    },
  },
}
</script>

