<template>
    <p>Hello, {{user.displayName}}</p>
    <button @click="logOut">Log Out</button>
</template>

<script>
import {auth} from '../firebase.js'

export default {
  name: 'User',
  data() {
    return {
      user: this.$parent.user
    }
  },
  methods: {
    logOut() {
        auth.signOut()
    }
  },
}
</script>