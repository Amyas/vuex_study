<template>
  <div id="app">
    <h3>rootModule state count:{{$store.state.count}}</h3>
    <button @click="$store.commit('increment')">rootModule state count increment</button>
    <button @click="handlerStateAsyncChange('changeValue', 10)">rootModule state count async increment</button>
    <h3>aModule state count:{{$store.state.a.count}}</h3>
    <button @click="$store.commit('a/increment')">aModule state count increment</button>
    <button @click="handlerStateAsyncChange('a/changeValue', 10)">aModule state count async increment</button>
  </div>
</template>

<script>
export default {
  mounted () {
    console.log(this.$store)
  },
  methods: {
    handlerStateAsyncChange (action, val) {
      this.$store
        .dispatch(action, val)
        .then(res => {
          console.log('current action:', action, 'val:', val, 'res:', res)
        })
    }
  }
}
</script>
