<template>
    <Nav/>
    <h2>Invite someone by entering their email below. It must be associated with a google account, or they won't be able to log in.</h2>
    <form>
        <label for="email">Email</label>
        <input id="email" type="text" v-model="email"/>
    </form>
    <button @click='invite'>Invite</button>
</template>

<script>
import Nav from '../components/Nav.vue'
import {db} from '../firebase.js'

export default {
  name: 'Invite',
  components: {
    Nav,
  },
  data() {
    return {
        email: null,
    }
  },
  methods: {
      async invite() {
          if(confirm(`Are you sure you want to invite ${this.email}?`)) {
              const docs = await db.collection(`invites`).where('email', '==', this.email).get()
              if(docs.size !== 0) {
                  alert('This email has been previously invited.')
              }
              else {
                db.collection(`invites`).add({
                    email: this.email
                })
                alert(`${this.email} has been invited. They can now log in.`)
              }
              this.email = null
          }
      },
  }
}
</script>