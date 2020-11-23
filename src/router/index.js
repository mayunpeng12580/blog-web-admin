import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/view/Home'
import Login from '@/view/Login/index'
import LoginView from '@/view/Login/login'
import RegisterView from '@/view/Login/register'
import TitleNav from '@/view/TitleNav/index'
import ContentView from '@/view/Content/index'
import ContentFrom from '@/view/Content/from'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'index',
      component: Login,
      redirect:'/login',
      children: [
        {
          path: 'login',
          name: 'login',
          components: {
            bottom: LoginView
          }
        }, {
          path: 'register',
          name: 'register',
          components: {
            bottom: RegisterView
          }
        }
      ]
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      redirect: "/home/nav",
      children: [
        {
          path: 'nav',
          name: 'TitleNav',
          components: {
            mainView: TitleNav
          }
        },
        {
          path: 'content',
          name: 'content',
          components: {
            mainView: ContentView
          }
        },
        {
          path: 'cafrom',
          name: 'cafrom',
          components: {
            mainView: ContentFrom
          }
        }
      ]
    }
  ]
})
