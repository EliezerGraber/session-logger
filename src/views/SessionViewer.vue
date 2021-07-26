<template>
    <table>
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
import firebase from 'firebase/app'

export default {
  name: 'Viewer',
  data() {
    return {
        button_text: "Show sessions",
        sort_mode: 'student',
        sort_order: 1,
        log_col: null,
    }
  },
  firestore: {
    log_col: db.collection(`logs`),
  },
  computed: {
    ownedLogs: function() {
      const user = firebase.auth().currentUser
      var sorted_docs = {}
      if (user !== null) {
        sorted_docs = this.log_col.filter(log => {
          return log.uid === user.uid
        })
      }
    return sorted_docs
    },
    sortedLogs: function() {
      return this.ownedLogs.sort((a,b) => {
        return this.sort_order * ('' + a[this.sort_mode]).localeCompare(b[this.sort_mode])
      })
    },
  },
  methods: {
    sort(mode) {
      if(this.sort_mode === mode) {
        this.sort_order *= -1
      }
      else {
        this.sort_order = 1
        this.sort_mode = mode
      }
    },
  },
}
</script>