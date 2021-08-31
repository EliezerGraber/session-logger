<template>
    <Nav/>
    <div v-if="!edit_mode">
        <h3>Goals</h3>
        <ul>
            <li v-for="goal in goal_col" :key="goal.name" @click="editGoal(goal.name)">{{goal.name}} <button>Edit</button></li>
        </ul>
        <input id="new_goal_name" type="text" v-model="new_goal_name">
        <button @click="addGoal">Add goal</button>
    </div>
    <div v-else>
        <button @click="back">Back</button>
        <OptionEditor :selected_goal="selected_goal" :goal_name="goal_name"/>
    </div>
</template>

<script>
import {db} from '../firebase.js'
import Nav from '../components/Nav.vue'
import OptionEditor from '../components/OptionEditor.vue'

export default {
  name: 'EditGoals',
  components: {
    Nav,
    OptionEditor,
  },
  data() {
    return {
        goal_col: null,
        edit_mode: false,
        selected_goal: null,
        selected_option_col: null,
        goal_name: null,
        option_name: null,
        new_goal_name: null,
    }
  },
  firestore: {
      goal_col: db.collection(`goals`),
  },
  methods: {
    editGoal(goal) {
        if(goal !== null) {
            db.collection(`goals`).where('name', '==', goal).get().then(snap =>{
                if(snap.size == 1) {
                    this.selected_goal = snap.docs[0]
                    this.$bind('selected_option_col', db.doc(`goals/${snap.docs[0].id}`).collection('options'))
                    this.goal_name = goal
                    this.edit_mode = true
                }
                else {
                    console.log("Too many or too few documents with same long term goal name")
                }
            })
        }
    },
    addGoal() {
        db.collection(`goals`).add({
            name: this.new_goal_name
        })
        this.editGoal(this.new_goal_name)
    },
    addOption() {
        db.doc(`goals/${this.selected_goal.id}`).collection('options').add({
            name: this.option_name
        })
        this.option_name = null
    },
    deleteOption(name) {
        if(confirm(`Are you sure you would like to delete ${name}?`)) {
            db.doc(`goals/${this.selected_goal.id}`).collection('options').where('name', '==', name).get().then(docs => {
                docs.forEach(doc => {
                    db.doc(`goals/${this.selected_goal.id}/options/${doc.id}`).delete()
                });
            })
        }
    },
    back() {
        this.edit_mode = false
    },
    deleteGoal() {
        if(confirm("Are you sure you would like to delete this goal?")) {
            db.doc(`goals/${this.selected_goal.id}`).delete()
            this.edit_mode = false
        }
    }
  },
}
</script>