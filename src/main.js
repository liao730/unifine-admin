import { createApp } from 'vue'
import App from './App.vue' // 恢复使用 App.vue 作为主入口
import router from './router' // 引入路由配置

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus)
app.use(router) // 挂载路由
app.mount('#app')