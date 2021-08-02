<template>
  <div><button @click="logOut">Log Out</button></div>
</template>

<script>
import {auth} from '../firebase.js'

export default {
  name: 'LogOutButton',
  methods: {
    logOut() {
      auth.signOut()
      this.$router.push('/')
    },
  },
}
</script>