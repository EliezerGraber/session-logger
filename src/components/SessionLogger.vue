<template>
    <h2>New Session</h2>
    <form>
        <label for="student">Student</label>
        <select id="student" v-model="student">
            <option v-for="student in user_students" :key="student.name">{{student.name}}</option>
        </select>
        <label for="date">Date</label>
        <input id="date" type="date" v-model="date">
        <label for="time">Time</label>
        <input id="time" type="time" v-model="start_time">
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
    <button>Cancel</button>
    <button>Save</button>
</template>

<script>
import {db, auth, provider} from '../firebase.js'

export default {
  name: 'SessionLogger',
  props: {
      user: Object,
      user_doc: Object,
      user_students: Array,
      goal_col: Object,
      log_col: Object,
      db: Object,
  },
  data() {
    return {
        student: null,
        date: null,
        start_time: null,
        long_term_goal: null,
        short_term_options: null,
        notes: null,
        makeup: null,
        makeup_date: null,
        option_col: null,
    }
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
      }
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