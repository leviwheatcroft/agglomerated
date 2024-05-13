/* global agglomeratedConfig */

import { createApp } from 'vue'

const app = createApp({
  // sources: [],
  data () {
    const { sources } = this
    return {
      options: {},
      items: [],
      sources,
      renderer: false
    }
  },
  watch: {
    sources (val) {
      console.log('w', val)
    }
  },
  methods: {
    more () {
      this.sources.forEach((source) => source.more())
    }
  },
  mounted () {
    console.log(this.sources)
  },
  updated () {
    console.log(this)
  },
  template: '<div :is="renderer"></div>'
})

app.mount(document.querySelector('body'))

Promise.all(agglomeratedConfig.plugins.map(([plugin]) => plugin))
  .then((loaded) => {
    loaded.forEach(({ default: plugin }, idx) => {
      const [_, config] = agglomeratedConfig.plugins[idx]
      app.use(plugin, config)
    })
  })
