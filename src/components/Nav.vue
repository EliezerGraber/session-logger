<template>
  <ul>
    <li id='profile' class='dropdown'>
      <p>Hello {{curUser.displayName}}</p>
      <div class='dropdown_content'>
          <div><p>{{curUser.email}}</p></div>
          <div><LogOutButton/></div>
      </div>
    </li>
    <router-link to="/"><p>Home</p></router-link>
    <router-link v-if="hasStudents" to="/log"><p>Log a session</p></router-link>
    <router-link v-if="ownedLogs.length>0" to="/view"><p>View sessions</p></router-link>
    <router-link to="/adder"><p>Add a student</p></router-link>
    <router-link v-if='isAdmin' to="/invite"><p>Invite new user</p></router-link>
  </ul>
</template>

<script>
import {db, auth} from '../firebase.js'
import firebase from 'firebase/app'
import LogOutButton from './LogOutButton.vue'

export default {
  name: 'Nav',
  components: {
      LogOutButton,
  },
  data() {
    return {
        user_students: null,
        log_col: null,
        user_doc: null,
    }
  },
  firestore: {
    log_col: db.collection(`logs`),
  },
  created() {
      auth.onAuthStateChanged(user => {
        if (user) {
          this.$bind('user_students', db.doc(`users/${user.uid}`).collection('students'))
          this.$bind('user_doc', db.doc(`users/${user.uid}`))
        }
        else {
          this.$unbind('user_students')
          this.$unbind('user_doc')
        }
    })
  },
  computed: {
    ownedLogs: function() {
      const user = firebase.auth().currentUser
      var owned_docs = null
      if (user !== null) {
        owned_docs = this.log_col.filter(log => {
          return log.uid === user.uid
        })
      }
      return owned_docs
    },
    curUser: function() {
        return firebase.auth().currentUser
    },
    hasStudents: function() {
        return this.user_students !== null && this.user_students.length > 0
    },
    isAdmin: function() {
        return this.user_doc !== null && this.user_doc.is_admin
    }
  },
  methods: {
    logOut() {
      auth.signOut()
      this.$router.push('/')
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