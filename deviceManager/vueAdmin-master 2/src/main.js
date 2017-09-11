import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import NProgress from 'nprogress' //页面顶部进度条
import 'nprogress/nprogress.css'

import Login from './components/Login.vue'
import home from './components/Home.vue'
import Alldevice from './components/student/allDevice.vue'
import deviceManage from './components/student/deviceManager.vue'
import deviceDetail from './components/student/Table.vue'
import personal from './components/student/personal.vue'
import studentManager from './components/teacher/studentManage.vue'
import teacherManager from './components/teacher/teacherManage.vue'


import laborary from './components/laboratory/laboratoryManage.vue'
import laboraryDetail from './components/laboratory/Laboratory.vue'


Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(Vuex);

const routes = [{
        path: '/login',
        component: Login,
        name: 'login',
        hidden: true //不显示在导航中
    },

    {
        path: '/login',
        component: Login,
        name: 'login',
        hidden: true //不显示在导航中
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: home,
        name: '设备中心',
        iconCls: 'el-icon-message', //图标样式class
        children: [
            //{ path: '/main', component: Main },
            { path: '/Alldevice', component: Alldevice, name: '全部设备' },
            { path: '/Mydevice', component: personal, name: '我的设备' },
            { path: '/deviceManage', component: deviceManage, name: '设备管理' },
            {
                path: '/deviceDetail',
                component: deviceDetail,
                name: '设备详情',
            },
        ]
    },
    {
        path: '/',
        component: home,
        name: '我的信息',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/personal', component: personal, name: '个人中心' },
            { path: '/studentManage', component: studentManager, name: '学生管理' },
            { path: '/teacherManage', component: teacherManager, name: '教师管理' }
        ]
    },

    {
        path: '/',
        component: home,
        name: '实验室中心',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/laborary', component: laborary, name: '所有实验室' },
            { path: '/laboraryDetail', component: laboraryDetail, name: '实验室管理' },
        ]
    },
];

const router = new VueRouter({
    routes
});

router.beforeEach((to, from, next) => {
    console.log(to);
    console.log(from);
    console.log(next);
    console.log(from.name);

    NProgress.start();
    next()
});

router.afterEach(transition => {
    NProgress.done();
});

new Vue({
    el: '#app',
    template: '<App/>',
    router,
    store,
    components: { App }
    //render: h => h(Login)
}).$mount('#app');

//router.replace('/login')