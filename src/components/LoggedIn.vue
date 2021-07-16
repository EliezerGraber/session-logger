<template>
  <div v-if="state=='dashboard'">
    <p>Hello, {{this.$parent.user.displayName}}</p>
    <p>{{this.$parent.user.email}}</p>
    <button @click="logOut">Log Out</button>
    <User v-if="this.$parent.user_students.length>0" :user="this.$parent.user" :user_doc="this.$parent.user_doc" :user_students="this.$parent.user_students" :log_col="log_col" />
    <Admin v-if="this.$parent.user_doc && this.$parent.user_doc.is_admin"/>
  </div>
  <SessionLogger v-else-if="state=='session-logger'" :user="this.$parent.user" :user_doc="this.$parent.user_doc" :user_students="this.$parent.user_students" :log_col="log_col" :goal_col="this.$parent.goal_col" :db="this.$parent.db"/>
</template>

<script>
import {auth} from '../firebase.js'
import User from './User.vue'
import Admin from './Admin.vue'
import SessionLogger from './SessionLogger.vue'

export default {
  name: 'LoggedIn',
  props: {
    state: String,
    log_col: Object,
  },
  components: {
    User,
    Admin,
    SessionLogger,
  },
  data() {
    return {
  
    }
  },
  emits: {
      log: null
  },
  methods: {
    logOut() {
        auth.signOut()
    },
  },
}
</script>