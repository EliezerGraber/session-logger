<template>
    <h3 for="goal_name">Goal Name<br>{{goal_name}}</h3>
    <h4>Options</h4>
    <ul>
        <li type="text" v-for="option in selected_option_col" :key="option.name">{{option.name}} <button @click="deleteOption(option.name)">Delete</button></li>
    </ul>            
    <input id="option_name" type="text" v-model="option_name">
    <button @click="addOption">Add Option</button>
    <button @click="deleteGoal">Delete Goal</button>
</template>

<script>
import {db} from '../firebase.js'
import firebase from 'firebase/app'

export default {
  name: 'OptionEditor',
  props: {
    selected_goal: null,
    goal_name: null,
    current_student_id: null,
  },
  data() {
    return {
        option_name: null,
        selected_option_col: null,
        goal_path: null,
    }
  },
  created() {
      if(this.current_student_id == null) {
        this.goal_path = `goals`
      }
      else {
        const user = firebase.auth().currentUser
        this.goal_path = `users/${user.uid}/students/${this.current_student_id}/goals`
      }
      db.collection(this.goal_path).where('name', '==', this.goal_name).get().then(snap =>{
        if(snap.size == 1) {
            this.$bind('selected_option_col', db.doc(`${this.goal_path}/${snap.docs[0].id}`).collection('options'))
        }
        else {
            console.log("Too many or too few documents with same long term goal name")
        }
      })
  },
  methods: {
    addOption() {
        db.doc(`${this.goal_path}/${this.selected_goal.id}`).collection('options').add({
            name: this.option_name
        })
        this.option_name = null
    },
    deleteOption(name) {
        if(confirm(`Are you sure you would like to delete ${name}?`)) {
            db.doc(`${this.goal_path}/${this.selected_goal.id}`).collection('options').where('name', '==', name).get().then(docs => {
                docs.forEach(doc => {
                    db.doc(`${this.goal_path}/${this.selected_goal.id}/options/${doc.id}`).delete()
                });
            })
        }
    },
    deleteGoal() {
      if(confirm("Are you sure you would like to delete this goal?")) {
          db.doc(`${this.goal_path}/${this.selected_goal.id}`).delete()
          this.$parent.edit_mode = false
      }
      this.$parent.back()
    }
  },
}
</script>