<template>
  <Nav/>
    <table>
        <tr>
          <th @click='sort("student")'>Student</th>
          <th @click='sort("date")'>Date</th>
          <th @click='sort("start_time")'>Start Time</th>
          <th @click='sort("end_time")'>End Time</th>
          <th @click='sort("sections")'>Sections</th>
          <th @click='sort("location")'>Location</th>
          <th @click='sort("makeup")'>Makeup</th>
          <th @click='sort("makeup_date")'>Makeup Date</th>
          <th @click='sort("submitted")'>Submitted</th>
        </tr>
        <tr v-for="log in sortedLogs" :key="log.id">
          <td>{{log.student}}</td>
          <td>{{log.date}}</td>
          <td>{{log.start_time}}</td>
          <td>{{log.end_time}}</td>
          <td>
            <ul>
              <li v-for="section in log.sections" :key="section.id">{{section.goal}} - {{section.option}}</li>
            </ul>
          </td>
          <td>{{log.location}}</td>
          <td>{{log.makeup}}</td>
          <td>{{log.makeup_date}}</td>
          <td>{{log.submitted}}</td>
          <td><button @click="deleteLog(log.id)">Delete</button></td>
          <td><button @click="editLog(log.id)">Edit</button></td>
        </tr>
    </table>
</template>

<script>
import {db} from '../firebase.js'
import firebase from 'firebase/app'
import Nav from '../components/Nav.vue'

export default {
  name: 'Viewer',
  components: {
    Nav,
  },
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
      var owned_docs = {}
      if (user !== null) {
        owned_docs = this.log_col.filter(log => {
          return log.uid === user.uid
        })
      }
      return owned_docs
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
    deleteLog(id) {
      if(confirm(`Are you sure you would like to delete this log?`)) {
        db.doc(`logs/${id}`).delete()
      }
    },
    editLog(id) {
      this.$router.push(`/log/${id}`)
    },
  },
}
</script>