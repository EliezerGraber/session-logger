<template>
    <Nav/>
    <h2>New Session</h2>
    <form>
        <label for="student">Student</label>
        <select id="student" v-model="student">
            <option v-for="student in user_students" :key="student.name">{{student.name}}</option>
        </select>
        <label for="date">Date</label>
        <input id="date" type="date" v-model="date">
        <label for="time">Start Time</label>
        <input id="time" type="time" v-model="start_time">
        <label for="end_time">End Time</label>
        <input id="end_time" type="time" v-model="end_time">
        <label for="goal">Long Term Goal</label>
        <select id="goal" v-model="long_term_goal" @change="updateOptions">
            <option v-for="goal in goal_col" :key="goal.name">{{goal.name}}</option>
        </select>
        <label for="option">Short Term Options</label>
        <select id="option" v-model="short_term_options" multiple>
            <option v-for="option in option_col" :key="option.name">{{option.name}}</option>
        </select>
        <label for="notes">Notes</label>
        <textarea id="notes" type="text" v-model="notes"></textarea>
        <label for="makeup">Makeup</label>
        <input id="makeup" type="checkbox" v-model="makeup">
        <label for="makeup_date" v-if="makeup">Makeup Date</label>
        <input id="makeup_date" v-if="makeup" type="date" v-model="makeup_date">
    </form>
    <button @click="exit">Exit</button>
    <button @click="save">Save</button>
</template>

<script>
import {db, auth, provider} from '../firebase.js'
import firebase from 'firebase/app'
import Nav from '../components/Nav.vue'

export default {
  name: 'SessionLogger',
  components: {
    Nav,
  },
  data() {
    return {
        student: null,
        date: null,
        start_time: null,
        end_time: null,
        long_term_goal: null,
        short_term_options: null,
        notes: null,
        makeup: null,
        makeup_date: null,
        option_col: null,
        goal_col: null,
        user_students: null,
        user_uid: null,
    }
  },
  firestore: {
      goal_col: db.collection(`goals`),
  },
  created() {
      auth.onAuthStateChanged(user => {
        if (user) {
          this.$bind('user_students', db.doc(`users/${user.uid}`).collection('students'))
        }
        else {
          this.$unbind('user_students')
        }
    })
  },
  methods: {
      updateOptions()   {
            db.collection(`goals`).where('name', '==', this.long_term_goal).get().then(snap =>{
                if(snap.size == 1) {
                    this.$bind('option_col', db.doc(`goals/${snap.docs[0].id}`).collection('options'))
                }
                else {
                    console.log("Too many or too few documents with same long term goal name")
                }
            })
      },
      reset() {
            this.student = null
            this.date = null
            this.start_time = null
            this.end_time = null
            this.long_term_goal = null
            this.short_term_options = null
            this.notes = null
            this.makeup = null
            this.makeup_date = null
            this.option_col = null
      },
      save() {
            db.collection('logs').add({
                student: this.student,
                date: this.date,
                start_time: this.start_time,
                end_time: this.end_time,
                long_term_goal: this.long_term_goal,
                short_term_options: this.short_term_options,
                notes: this.notes,
                makeup: this.makeup,
                makeup_date: this.makeup_date,
                uid: firebase.auth().currentUser.uid,
            })
            this.reset()
            this.$router.push("/dashboard")
      },
      exit() {
          if(confirm("Are you sure you want to exit? Everything entered will be lost.")) {
            this.reset()
            this.$router.push("/dashboard")
          }
      },
      changeStartTime() {
          this.end_time = this.start_time
      },
  },
}
</script>

<style scoped>
form {
    margin: 0 4em;
}
label, input, select, textarea, h2 {
    display: block;
    margin: 1em auto;
    text-align: center;
}
textarea {
    resize: vertical;
    width: 30%;
}
</style>