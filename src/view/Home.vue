<template>
  <a-layout id="home_view">
    <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
      <div class="logo" />
      <a-menu theme="dark" mode="inline" :default-selected-keys="['1']">
        <a-menu-item key="1" @click="goPageHandle('/home/nav')">
          <a-icon type="menu" />
          <span>栏目管理</span>
        </a-menu-item>
        <a-menu-item key="2"  @click="goPageHandle('/home/content')">
          <a-icon type="box-plot" />
          <span>文章管理</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="() => (collapsed = !collapsed)"
        />
        <div style="float:right; margin-right: 20px;">
          <a-dropdown>
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">
              Hover me
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item align="center">
                <a @click="logOut">退 出</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content
        :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }"
      >
      <router-view name="mainView"></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
export default {
  data() {
    return {
      collapsed: false
    };
  },
  methods: {
    // silder
    goPageHandle(key){
      this.$router.push({path: key})
    },
    //退出功能
    logOut() {
      var _this = this;
      this.$confirm({
        title: "即将退出本系统，是否继续?",
        // content: h => <div style="color:red;">是否要退出本系统</div>,
        onOk() {
          _this.$router.push({ path: "/login" });
          _this.$message.info("您已成功退出本系统");
        },
        onCancel() {
          console.log("Cancel");
        },
        class: "test"
      });
    }
  }
};
</script>
<style>
#home_view {
  width: 100%;
  height: 100%;
}

#home_view .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#home_view .trigger:hover {
  color: #1890ff;
}

#home_view .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
</style>
