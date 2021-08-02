<template>
    <Nav/>
    <form>
      <label for='new_student_name'>New Student Name</label>
      <input type='text' id='new_student_name' v-model="new_student_name">
    </form>
    <button @click="addStudent">Add student</button>
</template>

<script>
import {db} from '../firebase.js'
import firebase from 'firebase/app'
import Nav from '../components/Nav.vue'

export default {
  name: 'Adder',
  components: {
    Nav,
  },
  data() {
    return {
        new_student_name: null,
    }
  },
  methods: {
    addStudent() {
        const user = firebase.auth().currentUser
        if(user !== null) {
            if(confirm(`Add a new student named ${this.new_student_name}?`)) {
                db.doc(`users/${user.uid}`).collection('students').add({name: this.new_student_name})
            }
        }
        else {
            alert('You are not logged in. Please log in and try again.')
        }
    },
  },
}
</script>