<template>
    <p>Logged Out</p>
    <button @click="logIn">Log In</button>
</template>

<script>
import {auth, provider} from '../firebase.js'

export default {
  name: 'LoggedOut',
  methods: {
    logIn() {
        auth.signInWithPopup(provider)
    }
  },
}
</script>