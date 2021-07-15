<template>
    <button @click="this.$parent.$emit('log')">Log new session</button>
    <button @click="viewToggle">{{button_text}}</button>
    <ul v-if="viewing">
        <li v-for="student in user_students" :key="student.name">{{student.name}}</li>
    </ul>
</template>

<script>
export default {
  name: 'User',
  props: {
      user: Object,
      user_doc: Object,
      user_students: Array,
  },
  data() {
    return {
        viewing: false,
        button_text: "Show sessions",
    }
  },
  emits: {
      log: null
  },
  methods: {
    viewToggle() {
        this.viewing = !this.viewing
        this.button_text = this.viewing?"Hide sessions":"Show sessions"
    }
  },
}
</script>