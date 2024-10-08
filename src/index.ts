import '@csstools/normalize.css';
import Toast from 'muse-ui-toast'
import Message from 'muse-ui-message'
import Loading from 'muse-ui-loading'
import Vue from 'vue'
import MuseUI from 'muse-ui'
import i18n from './i18n'
import store from './store'
import router from './router'
import App from './App.vue'
import * as moment from 'moment'
import { I18nTags, I18nLocales } from '@/constant'
import ThemeManager from '@/themes'
import './directives'
import { Sm, Md, Lg } from 'packages/breakpoints/components'
import DefaultLayout from '@/layouts/default/index.vue'
import PlainLayout from '@/layouts/plain.vue'

Vue.use({
  install (Vue) {
    Vue.prototype.$i18nTags = I18nTags;
  }
})

Vue.use(MuseUI)
Vue.use(Toast, {
  position: 'bottom-start'
})
Vue.use(Message)
Vue.use(Loading, {
  overlayColor: 'hsla(0,0%,100%,.9)',
  size: 48,
  color: 'primary',
})

Vue.component('Sm', Sm)
Vue.component('Md', Md)
Vue.component('Lg', Lg)
Vue.component('DefaultLayout', DefaultLayout)
Vue.component('PlainLayout', PlainLayout)

const currentLocale = store.state.appStatus.settings.locale

moment.locale(currentLocale)

// @ts-ignore
if (window.Notification) {
  Notification.requestPermission()
}

ThemeManager.setTheme(store.state.appStatus.settings.theme)

new Vue({
  el: '#app',
  store,
  router,
  i18n,
  render (h) {
    return h(App)
  }
});
