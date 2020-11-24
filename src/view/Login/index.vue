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
        <router-view name="bottom"></router-view>
        <!-- <login v-show="key == 'login'"></login>
        <register  v-show="key == 'register'"></register>-->
      </a-card>
    </div>
  </div>
</template>


<script>
import login from "./login";
import register from "./register";
// import bgImg from "../../assets/bg.jpg";
export default {
  name: "index",
  components: {
    login,
    register
  },
  data() {
    return {
      // bgImg,
      tabList: [
        {
          key: "login",
          tab: "登录",
          scopedSlots: { tab: "customRender" }
        },
        {
          key: "register",
          tab: "注册"
        }
      ],
      contentList: {
        login: "",
        register: ""
      },
      key: "login"
    };
  },
  methods: {
    onTabChange(key, type) {
      console.log(key, type);
      this[type] = key;
      this.$router.push({ path: "/" + key });
    }
  },
  watch: {
    $route(to, from) {
      if (to.path == "/login") {
        this.key = "login";
      } else {
        this.key = "register";
      }
    }
  },
  created: {}
};
</script>


<style>
#login-view {
  width: 400px;
  height: 100%;
  margin: 300px auto;
  box-shadow:0px 0px 10px 3px #00CCFB,
           0px 0px 10px 6px #999999,
           0px 0px 10px 9px #333333;
}

#login-view .ant-card-head-title {
  text-align: center;
  font-size: 22px;
  font-weight: 600;
}

#login-view .ant-card-head,
#login-view .ant-card-head .ant-tabs-bar {
  border-bottom: 0px;
}

#login-view .ant-card-head .ant-tabs-nav-container {
  text-align: center;
}
</style>