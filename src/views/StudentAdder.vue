<template>
    <Nav/>
    <div v-if="mode==0">
        <h3>Students</h3>
        <ul>
            <li v-for="student in user_students" :key="student.name">{{student.name}} <button @click="edit(student.name)">Edit</button></li>
        </ul>
        <label for='student_name'>New Student Name</label>
        <input type='text' id='student_name' v-model="new_student_name">
        <button @click="addStudent">Add student</button>
    </div>
    <div v-else-if="mode==1">
        <button @click="back">Back</button>
        <h3 for="student_name">{{current_student.name}}</h3>
        <h4>Goal</h4>
        <ul>
            <li type="text" v-for="goal in current_student_goals" :key="goal.name">{{goal.name}} <button @click="editGoal(goal.name)">Edit</button></li>
        </ul>            
        <label for="goal">Add Long Term Goal</label>
        <select id="goal" v-model="long_term_goal">
            <option v-for="goal in goal_col" :key="goal.name">{{goal.name}}</option>
            <option>Custom</option>
        </select>
        <input v-if="long_term_goal=='Custom'" type="text" v-model="custom_goal">
        <button @click="addGoal">Add Goal</button>
        <button @click="deleteStudent">Delete Student</button>
    </div>
    <div v-else>
        <button @click="back">Back</button>
        <OptionEditor :selected_goal="selected_goal" :goal_name="goal_name" :current_student_id="current_student_id"/>
    </div>
</template>

<script>
import {db, auth} from '../firebase.js'
import firebase from 'firebase/app'
import Nav from '../components/Nav.vue'
import OptionEditor from '../components/OptionEditor.vue'

export default {
  name: 'Adder',
  components: {
    Nav,
    OptionEditor,
  },
  data() {
    return {
        new_student_name: null,
        user_students: null,
        current_student: null,
        mode: 0,
        goal_col: null,
        long_term_goal: null,
        current_student_goals: null,
        current_student_id: null,
        goal_name: null,
        selected_goal: null,
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
  },
  firestore: {
      goal_col: db.collection(`goals`),
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
        this.new_student_name = null
    },
    deleteStudent() {
        const user = firebase.auth().currentUser
        if(user !== null) {
            if(confirm(`Delete ${this.current_student.name}?`)) {
                db.doc(`users/${user.uid}`).collection('students').where('name', '==', this.current_student.name).get().then(docs => {
                    docs.forEach(doc => {
                        db.doc(`users/${user.uid}/students/${doc.id}`).delete()
                    });
                })
            }
        }
        else {
            alert('You are not logged in. Please log in and try again.')
        }
        this.new_student_name = null
        this.back()
    },
    back() {
        this.mode -= 1
    },
    edit(name) {
        const user = firebase.auth().currentUser
        db.doc(`users/${user.uid}`).collection('students').where('name', '==', name).get().then(docs => {
            docs.forEach(doc => {
                this.current_student = doc.data()
                this.current_student_id = doc.id
            });
            this.$bind('current_student_goals', db.collection(`users/${user.uid}/students/${this.current_student_id}/goals`))
        })
        this.mode = 1
    },
    addGoal() {
        const user = firebase.auth().currentUser
        const chosen_goal = this.long_term_goal != 'Custom' ? this.long_term_goal : this.custom_goal
        db.collection(`users/${user.uid}/students/${this.current_student_id}/goals`).add({
            name: chosen_goal
        })
    },
    editGoal(goal) {
        const user = firebase.auth().currentUser
        db.collection(`users/${user.uid}/students/${this.current_student_id}/goals`).where('name', '==', goal).get().then(snap =>{
            if(snap.size == 1) {
                this.selected_goal = snap.docs[0]
                this.goal_name = goal
                this.mode = 2
            }
            else {
                console.log("Too many or too few documents with same long term goal name")
            }
        })
    },
  },
}
</script>