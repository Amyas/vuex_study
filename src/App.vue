<template>
  <div id="app">
    <h3>rootModule state count:{{$store.state.count}}</h3>
  </div>
</template>

<script>
export default {
  mounted () {
    console.log(this.$store)
  }
}
</script>
