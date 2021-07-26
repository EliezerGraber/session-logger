<template>
    <button @click="this.$parent.$emit('log')">Log new session</button>
    <form>
      <label for='new_student_name'>New Student Name</label>
      <input type='text' id='new_student_name' v-model="new_student_name">
    </form>
    <button @click="addStudent">Add student</button>
    <button @click="viewToggle">{{button_text}}</button>
    <table v-if="viewing">
        <tr>
          <th @click='sort("student")'>Student</th>
          <th @click='sort("date")'>Date</th>
          <th @click='sort("start_time")'>Start Time</th>
          <th @click='sort("end_time")'>End Time</th>
          <th @click='sort("long_term_goal")'>Long Term Goal</th>
          <th @click='sort("short_term_options")'>Short Term Options</th>
          <th @click='sort("notes")'>Notes</th>
          <th @click='sort("makeup")'>Makeup</th>
          <th @click='sort("makeup_date")'>Makeup Date</th>
        </tr>
        <tr v-for="log in sortedLogs" :key="log.id">
          <td>{{log.student}}</td>
          <td>{{log.date}}</td>
          <td>{{log.start_time}}</td>
          <td>{{log.end_time}}</td>
          <td>{{log.long_term_goal}}</td>
          <td>
            <ul>
              <li v-for="option in log.short_term_options" :key="option">{{option}}</li>
            </ul>
          </td>
          <td>{{log.notes}}</td>
          <td>{{log.makeup}}</td>
          <td>{{log.makeup_date}}</td>
        </tr>
    </table>
</template>

<script>
import {db} from '../firebase.js'

export default {
  name: 'User',
  props: {
      user: Object,
      user_doc: Object,
      user_students: Array,
      log_col: Object,
  },
  data() {
    return {
        viewing: false,
        button_text: "Show sessions",
        sort_mode: 'student',
        sort_order: 1,
        new_student_name: null,
    }
  },
  emits: {
      log: null
  },
  computed: {
    ownedLogs: function() {
      return this.log_col.filter(log => {
        return log.uid === this.user.uid
      })
    },
    sortedLogs: function() {
      return this.ownedLogs.sort((a,b) => {
        return this.sort_order * ('' + a[this.sort_mode]).localeCompare(b[this.sort_mode])
      })
    },
  },
  methods: {
    viewToggle() {
      this.viewing = !this.viewing
      this.button_text = this.viewing?"Hide sessions":"Show sessions"
    },
    sort(mode) {
      if(this.sort_mode === mode) {
        this.sort_order *= -1
      }
      else {
        this.sort_order = 1
        this.sort_mode = mode
      }
    },
    addStudent() {
      if(confirm(`Add a new student named ${this.new_student_name}?`)) {
        db.doc(`users/${this.user.uid}`).collection('students').add({name: this.new_student_name})
      }
    },
  },
}
</script>