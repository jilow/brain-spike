<template>
  <div id="app">
    <div class="set-a">
      <h3>Data set: A</h3>
      <p>Draw something, like a ❌</p>
      <Canvas ref="a-1" />
      <Canvas ref="a-2" />
      <Canvas ref="a-3" />
    </div>
    <div class="set-b">
      <h3>Data set: B</h3>
      <p>Draw something, like a ⭕️</p>
      <Canvas ref="b-1" />
      <Canvas ref="b-2" />
      <Canvas ref="b-3" />
    </div>
    <button class="material purple" ref="train" @click="train">Train me!</button>
    <code ref="error"></code>
    <div class="test">
      <h3>Test item</h3>
      <p>Now draw something to test, like either a ❌ or ⭕️</p>
      <Canvas ref="test" />
    </div>
    <div>
      <code ref="answer"></code>
    </div>
    <button class="material" @click="test">Test me!</button>
  </div>
</template>

<script>
import brain from 'brain.js'
import Canvas from './components/Canvas.vue'

const net = new brain.NeuralNetwork()

export default {
  name: 'app',
  components: {
    Canvas,
  },
  methods: {
    train: function() {
      const btn = this.$refs['train']
      const btnText = btn.innerHTML
      btn.innerHTML = 'training...'
      btn.disabled = true
      setTimeout(() => {
        let data = []
        for (let key in this.$refs) {
          if (key != 'test' && key.startsWith('a-') || key.startsWith('b-')) {
            let canvas = this.$refs[key]
            data.push({
              input: canvas.data(),
              output: { [key.startsWith('a') ? 'a' : 'b']: 1 }
            })
          }
        }
        const result = net.train(data, { log: false, iterations: 20000 })
        if (result.error) this.$refs['error'] = result.error
        btn.innerHTML = btnText
        btn.disabled = false
      }, 1)
    },
    test: function() {
      const answer = this.$refs['answer']
      answer.innerHTML = ''
      const test = this.$refs['test']
      const result = brain.likely(test.data(), net)
      test.reset()
      answer.innerHTML = `I think that's a "${result.toUpperCase()}"!`
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
Canvas {
  margin: 0 1rem;
  background-color: '#51bb8d';
}
h3 {
  margin-bottom: 0.6rem;
}
p {
  margin-top: 0;
  margin-bottom: 1rem;
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
.set-a > Canvas {
  background-color: #96eac6;
}
.set-b > Canvas {
  background-color: #ccb0da;
}
.test > canvas {
  background-color: #ffe2bc;
}
.purple {
  background-color: #9b5aff;
}
</style>
