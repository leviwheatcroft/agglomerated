/* global agglomeratedConfig */

import { createApp } from 'vue'

const app = createApp({
  data () {
    return {
      options: {},
      items: [],
      sources: [],
      renderer: false
    }
  },
  methods: {
    more () {
      this.sources.forEach((source) => source.more())
    }
  },
  template: '<div :is="renderer"></div>'
})

app.mount(document.querySelector('body'))

Promise.all(agglomeratedConfig.plugins.map(([url]) => import(url)))
  .then((loaded) => {
    loaded.forEach(({ default: plugin }, idx) => {
      const [_, config] = agglomeratedConfig.plugins[idx]
      app.use(plugin, config)
    })
  })
