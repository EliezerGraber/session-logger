<template>
  <ul>
    <li id='profile' class='dropdown'>
      <p>Hello {{this.$parent.user.displayName}}</p>
      <div class='dropdown_content'>
          <div><p>{{this.$parent.user.email}}</p></div>
          <div><button @click="logOut">Log Out</button></div>
      </div>
    </li>
    <router-link to="/"><p>Home</p></router-link>
    <router-link to="/log"><p>Log a session</p></router-link>
    <router-link to="/view"><p>View sessions</p></router-link>
    <router-link to="/adder"><p>Add a student</p></router-link>
  </ul>
  reminder to check if is user or admin
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
import User from './User.vue'
import Admin from './Admin.vue'

export default {
  name: 'LoggedIn',
  props: {
    state: String,
    log_col: Object,
  },
  components: {
    User,
    Admin,
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