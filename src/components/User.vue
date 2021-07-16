<template>
    <button @click="this.$parent.$emit('log')">Log new session</button>
    <button @click="viewToggle">{{button_text}}</button>
    <table v-if="viewing">
        <tr>
          <th>Student</th>
          <th>Date</th>
          <th>Start Time</th>
          <th>End Time</th>
          <th>Long Term Goal</th>
          <th>Short Term Options</th>
          <th>Notes</th>
          <th>Makeup</th>
          <th>Makeup Date</th>
        </tr>
        <tr v-for="log in ownedLogs" :key="log.id">
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
  },
  methods: {
    viewToggle() {
      this.viewing = !this.viewing
      this.button_text = this.viewing?"Hide sessions":"Show sessions"
    },
  },
}
</script>