/* global agglomeratedConfig */

import { createApp } from 'vue'
import Agglomerator from './Agglomerator.vue'

const app = createApp({
  // sources: [],
  components: [
    Agglomerator
  ],
  data () {
    return {
      options: {},
      blocks: [],
      fetchers: [],
      renderers: []
    }
  },
  created () {
    // Promise.all(agglomeratedConfig.plugins.map(([plugin]) => {
    //   return import(/* webpackIgnore: true */ plugin)
    // }))
    Promise.all(agglomeratedConfig.plugins.map(([plugin]) => plugin))
      .then((loaded) => {
        console.log(loaded)
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
      this.$data.fetchers.forEach((f) => f().then((items) => this.addBlocks(items)))
    },
    addBlocks (items) {
      this.$data.blocks.push(items)
    },
    getRenderer (item) {
      let renderer
      // eslint-disable-next-line no-return-assign
      this.$data.renderers.some((_renderer) => renderer = _renderer(item))
      return renderer
    }
  },
  template: '<agglomerator :items :getRenderer></agglomerator>'
})

app.mount(document.querySelector('body'))
