<template>
  <div>
    <h1>Pusher Example</h1>
    <p><a target="_blank" href="https://laravel-echo.nuxtjs.org">Laravel Echo for Nuxt.js</a></p>
    <p><a target="_blank" href="https://pusher.com/docs/channels/getting_started/javascript">Pusher Docs</a></p>
    <div style="display:flex;">
      <div style="margin: 10px;">
        <h2>Subscribe to events on the client</h2>
        Channel:<br><input v-model="subscribe.channel"><br><br>
        Event:<br><input v-model="subscribe.event"><br><br>
        <textarea v-model="subscribe.data" disabled rows="8" cols="60" /><br><br>
        <button v-if="!channel" type="button" @click="startListen">
          Start Listen
        </button>
        <button v-else type="button" @click="stopListen">
          Stop Listen
        </button>
      </div>
      <div style="margin: 10px;">
        <h2>Publish events from the server</h2>
        Channel:<br><input v-model="publish.channel"><br><br>
        Event:<br><input v-model="publish.event"><br><br>
        <textarea v-model="publish.message" rows="8" cols="60" /><br><br>
        <button type="button" @click="publishMessage">
          Publish Message
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      channel: null,
      subscribe: {
        channel: 'channel',
        event: '.event',
        data: ''
      },
      publish: {
        channel: 'channel',
        event: 'event',
        message: 'Hello world'
      }
    }
  },

  mounted () {
    this.startListen()
  },

  methods: {
    startListen () {
      this.channel = this.$echo.listen(this.subscribe.channel, this.subscribe.event, (data) => {
        this.subscribe.data += JSON.stringify(data) + '\r\n'
      })
    },

    stopListen () {
      this.channel.stopListening(this.subscribe.event)
      this.channel = null
    },

    publishMessage () {
      fetch('/pusher', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          channel: this.publish.channel,
          event: this.publish.event,
          message: this.publish.message
        })
      })
    }
  }
}
</script>
