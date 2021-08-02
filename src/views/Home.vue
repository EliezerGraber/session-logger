<template>
    <Nav/>
    <h1>Home</h1>
</template>

<script>
import {db} from '../firebase.js'
import Nav from '../components/Nav.vue'

export default {
  name: 'Home',
  components: {
    Nav,
  },
  data() {
    return {

    }
  },
}
</script>