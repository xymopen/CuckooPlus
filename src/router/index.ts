const Loading = require('muse-ui-loading').default
import Vue from 'vue'
import Router, { Route } from 'vue-router'
import store from '../store'
import { RoutersInfo, TimeLineTypes } from '@/constant'
import * as Api from '@/api'
import { isBaseTimeLine } from '@/util'

import TimeLinesPage from '@/pages/Timelines'
import OAuthPage from '@/pages/OAuth'
import StatusesPage from '@/pages/Statuses'
import Settings from '@/pages/Settings'

Vue.use(Router)

const homePath = '/timelines/home'

const router = new Router({
  routes: [

    {
      path: RoutersInfo.empty.path,
      redirect: homePath
    },

    {
      path: RoutersInfo.timelines.path,
      redirect: homePath
    },

    {
      path: RoutersInfo.statuses.path,
      name: RoutersInfo.statuses.name,
      component: StatusesPage
    },

    {
      path: RoutersInfo.timelines.path,
      name: RoutersInfo.timelines.name,
      component: TimeLinesPage,
      children: [
        {
          path: RoutersInfo.defaulttimelines.path,
          name: RoutersInfo.defaulttimelines.name,
          meta: {
            keepAlive: true
          }
        },
        {
          path: RoutersInfo.tagtimelines.path,
          name: RoutersInfo.tagtimelines.name,
          meta: {
            keepAlive: true
          }
        },
        {
          path: RoutersInfo.listtimelines.path,
          name: RoutersInfo.listtimelines.name,
          meta: {
            keepAlive: true
          }
        }
      ]
    },

    {
      path: RoutersInfo.oauth.path,
      name: RoutersInfo.oauth.name,
      component: OAuthPage,
      beforeEnter (to, from, next) {
        if (!checkShouldReRegisterApplication(to, from)) {
          next(RoutersInfo.empty.path)
        }

        next()
      },
      meta: {
        hideHeader: true
      }
    },

    {
      path: RoutersInfo.settings.path,
      name: RoutersInfo.settings.name,
      component: Settings
    }
  ]
} as any);

function checkShouldReRegisterApplication (to, from): boolean {
  // should have clientId/clientSecret/code
  const { clientId, clientSecret } = store.state.OAuthInfo

  let code = store.state.OAuthInfo.code
  if (from.path === '/' && !code) {
    if (location.href.indexOf("?code=") !== -1) {
      code = location.href.replace(location.origin + location.pathname + "?code=", "")
      code = code.replace('#/', '')
      // todo maybe shouldn't put this here?
      store.commit('updateOAuthCode', code)
    }
  }

  return !(clientId && clientSecret && store.state.mastodonServerUri && code)
}

const beforeEachHooks = {
  // children routes can't use in-router guide...
  beforeDefaultTimeLines (to: Route, from, next) {
    if (to.name === RoutersInfo.defaulttimelines.name) {
      if (!isBaseTimeLine(to.params.timeLineType)) {
        return next(homePath)
      }
    }

    next()
  }
}

let hasInitFetchNotifications = false
let hasInitStreamConnection = false

router.beforeEach(async (to, from, next) => {

  const shouldReRegisterApplication = checkShouldReRegisterApplication(to, from)

  if (to.name !== RoutersInfo.oauth.name) {
    // need register
    if (shouldReRegisterApplication) {
      store.commit('clearAllOAuthInfo')
      return next(RoutersInfo.oauth.path)
    }

    // should get accessToken
    if (!store.state.OAuthInfo.accessToken) {
      try {
        const result = await Api.oauth.fetchOAuthToken()
        store.commit('updateOAuthAccessToken', result.data.access_token)
      } catch (e) {
        store.commit('clearAllOAuthInfo')
        return next(RoutersInfo.oauth.path)
      }
    }

    // todo access token expired

    // should get currentUserAccount
    if (!store.state.currentUserAccount) {
      try {
        const loading = Loading()
        const result = await Api.accounts.fetchCurrentUserAccountInfo()
        store.commit('updateCurrentUserAccount', result.data)
        loading.close()
      } catch (e) {
        if (e.status === 401) {
          store.commit('clearAllOAuthInfo')
          return next(RoutersInfo.oauth.path)
        }
      }
    }

    // should fetch notifications
    if (!store.state.notifications.length && !hasInitFetchNotifications) {
      store.dispatch('updateNotifications')
      hasInitFetchNotifications = true
    }
    
    if (store.state.mastodonServerUri && !hasInitStreamConnection) {
      Api.streaming.openUserConnection()
      hasInitStreamConnection = true
    }
  }

  next()
});

Object.keys(beforeEachHooks).forEach(key => {
  router.beforeEach(beforeEachHooks[key])
})

export default router
