/* global agglomeratedConfig */

import { createApp } from 'vue'

const app = createApp({
  // sources: [],
  data () {
    return {
      options: {},
      items: [],
      moreHooks: [],
      renderer: false
    }
  },
  created () {
    const app = this
    Promise.all(agglomeratedConfig.plugins.map(([plugin]) => plugin))
      .then((loaded) => {
        loaded.forEach(({ default: plugin }, idx) => {
          const [_, options] = agglomeratedConfig.plugins[idx]
          plugin.$data = app.$data
          plugin.component = app.component.bind(app)
          if (plugin.init) {
            plugin.init(options)
          }
          if (plugin.more) {
            this.$data.moreHooks.push(plugin.more.bind(plugin))
          }
        })
      })
  },
  methods: {
    more () {
      this.moreHooks.forEach((m) => m())
    }
  },
  template: '<div :is="renderer"></div>'
})

app.mount(document.querySelector('body'))
