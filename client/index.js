/* global agglomeratedConfig */

import { createApp } from 'vue'

const app = createApp({
  // sources: [],
  data () {
    return {
      options: {},
      blocks: [],
      fetchers: [],
      renderers: []
    }
  },
  created () {
    Promise.all(agglomeratedConfig.plugins.map(([plugin]) => plugin))
      .then((loaded) => {
        loaded.forEach(({ default: plugin }, idx) => {
          const [_, options] = agglomeratedConfig.plugins[idx]
          if (plugin.init) {
            plugin.init(options)
          }
          if (plugin.fetch) {
            this.$data.fetchers.push(plugin.fetch.bind(plugin))
          }
          if (plugin.render) {
            this.$data.renderers.push(plugin.render.bind(plugin))
          }
        })
      })
      .then(() => this.fetch())
  },
  methods: {
    fetch () {
      this.$data.fetchers.forEach((f) => f().then((blocks) => this.addBlocks(blocks)))
    },
    addBlocks (blocks) {
      this.$data.blocks.push(blocks)
    }
  },
  template: '<agglomerator :blocks></agglomerator>'
})

app.mount(document.querySelector('body'))
