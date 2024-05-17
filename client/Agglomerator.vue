<script>
export default {
  props: {
    items: {
      type: Array,
      default () { return [] }
    },
    getRenderer: {
      type: Function
    }
  }
}
</script>
<template lang="pug">
#agglomerator(
  
)
  .item(
    v-for="item in items"
    :key="item.id"
    :is="renderer(item)"
    :item
  )
</template>
<style>

</style>