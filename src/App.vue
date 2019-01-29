<template>
  <div id="app">

    <CanvasContainer
      ref="data-a"
      title="Data set: A"
      description="Draw something, like a ✔️"
      count=3
      color="#51bb8d" />

    <CanvasContainer
      ref="data-b"
      title="Data set: B"
      description="Draw something, like a ❌"
      count=3
      color="#ccb0da" />

    <button class="material purple" @click="train" :disabled="training">
      {{ training ? 'Training...' : 'Train me!' }}
    </button>

    <code class="error">{{ error }}</code>

    <CanvasContainer
      ref="data-test"
      title="Test item"
      description="Now draw something to test, like either a ✔️ or ❌"
      count=1
      color="#ffe2bc" />

    <button class="material" @click="test" :disabled="!trained">Test me!</button>

    <code>{{ answer }}</code>
  </div>
</template>

<script>
import brain from 'brain.js'
import Canvas from './components/Canvas.vue'
import CanvasContainer from './components/CanvasContainer.vue'

const net = new brain.NeuralNetwork()

export default {
  name: 'app',
  components: {
    Canvas,
    CanvasContainer,
  },
  data: function() {
    return {
      trained: false,
      training: false,
      error: ' ',
      answer: ' ',
    }
  },
  methods: {
    train: function() {
      this.training = true
      const a = this.$refs['data-a'].getData()
      const b = this.$refs['data-b'].getData()
      let data = []
      a.forEach(s => data.push({ input: s, output: { 'a': 1 } }))
      b.forEach(s => data.push({ input: s, output: { 'b': 1 } }))
      net.trainAsync(data, { log: false, iterations: 1000, errorThresh: 0.05 })
      .then(res => {
        this.training = false
        if (res.error > 0.05) {
          this.error = 'I need better training data! :('
        } else {
          this.trained = true
        }
      })
      .catch(err => {
        console.error(err)
        this.error = 'Whoops! Something wen\'t wrong. Check the console'
      })
    },
    test: function() {
      const test = this.$refs['data-test']
      const data = test.getData()[0]
      const result = brain.likely(data, net)
      if (!result) {
        this.error = 'Could not run test, did you train the bot?'
      } else {
        this.answer = `I think that's a "${result.toUpperCase()}"!`
        test.reset()
      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 3rem 1rem;
}
h3 {
  margin-bottom: 0.6rem;
}
p {
  margin-top: 0;
  margin-bottom: 1rem;
}
code {
  display: block;
}
code.error {
  color: red;
}
button {
  font-size: 0.8em;
  background-color: #2196f3;
  color: #fff;
  padding: 0.863em 1.5em;
  border: none;
  border-radius: 2px;
  text-transform: uppercase;
  text-decoration: none;
  text-align: center;
  letter-spacing: .5px;
  transition: background-color .3s ease-out;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  outline: 0;
  margin: 1rem 0.5rem;
}
button:disabled, button[disabled] {
  background-color: #999999;
  cursor: not-allowed;
}
.purple {
  background-color: #9b5aff;
}
</style>
