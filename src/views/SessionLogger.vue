<template>
    <Nav/>
    <h2>New Session</h2>
    <label for="student">Student</label>
    <select id="student" v-model="student" @change="getStudentGoals">
        <option v-for="student in user_students" :key="student.name">{{student.name}}</option>
    </select>
    <label for="date">Date</label>
    <input id="date" type="date" v-model="date">
    <label for="time">Start Time</label>
    <input id="time" type="time" v-model="start_time">
    <label for="end_time">End Time</label>
    <input id="end_time" type="time" v-model="end_time">
    <label for="location">Location</label>
    <select id="location" v-model="location">
        <option>School</option>
        <option>Remote</option>
        <option>Home</option>
    </select>
    <label for="makeup">Makeup</label>
    <input id="makeup" type="checkbox" v-model="makeup">
    <label for="makeup_date" v-if="makeup">Makeup Date</label>
    <input id="makeup_date" v-if="makeup" type="date" v-model="makeup_date">
    <div v-for="section in sections" :key="section.id">
        <label for="notes">{{section.goal}} - {{section.option}} notes</label>
        <button @click="deleteSection(section.id, section.goal, section.option)">Delete</button>
        <textarea id="notes" type="text" v-model="section.notes"></textarea>
    </div>
    <button @click="exit">Exit</button>
    <button @click="save">Save</button>
    <h3>Add a new progress section</h3>
    <label for="goal">Long Term Goal</label>
    <select id="goal" v-model="long_term_goal" @change="updateOptions">
        <option v-for="goal in goal_col" :key="goal.name">{{goal.name}}</option>
        <option>Custom</option>
    </select>
    <input v-if="long_term_goal=='Custom'" type="text" v-model="custom_goal">
    <label for="option">Short Term Options</label>
    <select id="option" v-model="short_term_option_selection">
        <option v-for="option in option_col" :key="option.name">{{option.name}}</option>
        <option>Custom</option>
    </select>
    <input v-if="short_term_option_selection=='Custom'" type="text" v-model="custom_option">
    <button @click="addSection">Add Section</button>
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
        sections: {},
        location: null,
        makeup: null,
        makeup_date: null,
        option_col: null,
        goal_col: null,
        user_students: null,
        user_uid: null,
        short_term_option_selection: null,
        new_log: true,
        custom_goal: null,
        custom_option: null,
        current_student: null,
        current_student_id: null,
    }
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
    db.doc(`logs/${this.$route.params.id}`).get().then(doc => {
        if(doc.data() != null) {
            console.log(doc.data())
            this.load(doc.data())
        }
        else {
            this.reset()
        }
    })
  },
  methods: {
      updateOptions() {
            const user = firebase.auth().currentUser
            db.collection(`users/${user.uid}/students/${this.current_student_id}/goals`).where('name', '==', this.long_term_goal).get().then(snap =>{
                if(snap.size == 1) {
                    this.$bind('option_col', db.doc(`users/${user.uid}/students/${this.current_student_id}/goals/${snap.docs[0].id}`).collection('options'))
                }
                else {
                    this.$unbind('option_col')
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
            this.sections = {}
            this.location = null
            this.makeup = null
            this.makeup_date = null
            this.option_col = null
      },
      save() {
            const log = {
                student: this.student,
                date: this.date,
                start_time: this.start_time,
                end_time: this.end_time,
                sections: this.sections,
                location: this.location,
                makeup: this.makeup,
                makeup_date: this.makeup_date,
                uid: firebase.auth().currentUser.uid,
            }
            if(this.new_log) {
                db.collection('logs').add(log)
            }
            else {
                db.doc(`logs/${this.$route.params.id}`).set(log)
            }
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
      addSection() {
        var ran_id = 0
        if(this.sections != null){
            while(ran_id in this.sections){
                ran_id++
            }
        }
        const chosen_goal = this.long_term_goal != 'Custom' ? this.long_term_goal : this.custom_goal
        const chosen_option = this.short_term_option_selection != 'Custom' ? this.short_term_option_selection : this.custom_option
        const new_section = {
            id: ran_id,
            goal: chosen_goal,
            option: chosen_option,
            notes: null,
        }
        this.sections[ran_id] = new_section
      },
      deleteSection(id, goal, option) {
        if(confirm(`Are you sure you would like to delete ${goal}, ${option}?`)) {
            this.sections.delete(id)
        }
      },
      load(log) {
        console.log(log)
        this.student = log.student
        this.date = log.date
        this.start_time = log.start_time
        this.end_time = log.end_time
        this.sections = log.sections
        this.location = log.location
        this.makeup = log.makeup
        this.makeup_date = log.makeup_date
        this.new_log = false
      },
      getStudentGoals() {
          const user = firebase.auth().currentUser
          db.doc(`users/${user.uid}`).collection('students').where('name', '==', this.student).get().then(docs => {
            docs.forEach(doc => {
                this.current_student = doc.data()
                this.current_student_id = doc.id
            });
            this.$bind('goal_col', db.collection(`users/${user.uid}/students/${this.current_student_id}/goals`))
        })
      }
  },
}
</script>

<style scoped>
template {
    margin: 0 4em;
}
label, input, select, textarea, h2, button, h3 {
    display: block;
    margin: 1em auto;
    text-align: center;
}
textarea {
    resize: vertical;
    width: 30%;
}
</style>