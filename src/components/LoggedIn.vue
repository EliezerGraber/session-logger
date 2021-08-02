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

<style>
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #333;
}

li, a {
  float: left;
  text-decoration: none;
}

li p, a p{
  display: block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  margin: 0;
  text-decoration: none;
}

li p:hover:not(.dropdown_content p), a p:hover {
  background-color: #111;
}

#profile {
  float: right;
}

#profile p {
  padding: 14px 30px;
}

.dropdown {
  display: inline-block;
}

.dropdown_content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

.dropdown_content p {
  color: black;
}

.dropdown_content div {
  text-decoration: none;
  display: block;
  text-align: center;
  width: 100%;
}

.dropdown:hover .dropdown_content {
  display: block;
}
</style>