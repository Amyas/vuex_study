<template>
  <div id="app">
    <h3>rootModule state count:{{$store.state.count}}</h3>
    <button @click="$store.commit('increment')">rootModule state count increment</button>
  </div>
</template>

<script>
export default {
  mounted () {
    console.log(this.$store)
  }
}
</script>
