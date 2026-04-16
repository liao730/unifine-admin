import { createRouter, createWebHistory } from 'vue-router'
import ProductControl from '../control/product.vue'
import CaseControl from '../control/case.vue'
import NewsControl from '../control/news.vue' // 引入新组件

const routes = [
  { path: '/', redirect: '/products' },
  { path: '/products', name: 'Products', component: ProductControl },
  { path: '/cases', name: 'Cases', component: CaseControl },
  { path: '/news', name: 'News', component: NewsControl } // 添加新闻路由
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router