<template>
    <h2>There is no account associated with this email. Please contact an administrater if this is a mistake, or log in with another account.</h2>
    <LogOutButton/>
</template>

<script>
import LogOutButton from '../components/LogOutButton.vue'

export default {
  name: 'NoAccount',
  components: {
      LogOutButton,
  },
}
</script>