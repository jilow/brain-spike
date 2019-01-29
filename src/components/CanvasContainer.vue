<template>
  <div>
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
    <div class="container" v-for="set in sets" :key="set">
      <Canvas ref="canvas" :id="set" :color="color" />
    </div>
  </div>
</template>

<script>
import Canvas from './Canvas.vue'

export default {
  name: 'CanvasContainer',
  props: {
    title: String,
    description: String,
    count: {
      type: String,
      default: 0
    },
    color: String
  },
  components: {
    Canvas,
  },
  data: function() {
    return {
      sets: []
    }
  },
  methods: {
    getData: function() {
      return this.$refs['canvas'].map(c => c.data())
    },
    reset: function() {
      this.$refs['canvas'].forEach(c => c.reset())
    }
  },
  created: function() {
    for(let i = 0; i < this.count; i++) {
      this.sets.push(i)
    }
  }
}
</script>

<style scoped>
  .container {
    display: inline-block;
    margin: 0 1rem;
  }
</style>
