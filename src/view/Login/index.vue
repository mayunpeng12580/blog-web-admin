<template>
<div id="login-wrap">
  <div id="login-view">
      <a-card
        style="width:100%"
        title="博客后台管理系统"
        :tab-list="tabList"
        :active-tab-key="key"
        @tabChange="key => onTabChange(key, 'key')"
      >
        <span slot="customRender" slot-scope="item">
          <a-icon type="home" />
          {{ item.key }}
        </span>
        <!-- <a slot="extra" href="#">More</a> -->
        {{ contentList[key] }}
        <login v-show="key == 'login'"></login>
        <register  v-show="key == 'register'"></register>
      </a-card>
  </div>
  </div>
</template>


<script>
import login from "./login"
import register from "./register"
import bgImg from "../../assets/下载.png"
export default {
  components: {
    login,register
},
  data() {
    return {
      bgImg,
      tabList: [
        {
          key: "login",
          tab: '登录',
          scopedSlots: { tab: "customRender" }
        },
        {
          key: "register",
          tab: "注册"
        }
      ],
      contentList: {
        login: '',
        register: ''
      },
      key: "login",
    };
  },
  methods: {
    onTabChange(key, type) {
      console.log(key, type);
      this[type] = key;
    }
  },
  created: {
    
  }
};
</script>


<style>



#login-view {
    width: 400px;
    height: 100%;
    margin: 250px auto;
}

#login-view .ant-card-head-title {
  text-align: center;
  font-size: 22px;
  font-weight: 600;
}

#login-view .ant-card-head, #login-view  .ant-card-head .ant-tabs-bar {
    border-bottom: 0px ;
}

#login-view .ant-card-head .ant-tabs-nav-container {
    text-align: center;
}
</style>