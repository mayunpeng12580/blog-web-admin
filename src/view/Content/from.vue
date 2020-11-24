<template>
  <div id="content-from">
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item ref="name" label="文章标题" prop="name">
        <a-input
          v-model="form.name"
          @blur="
          () => {
            $refs.name.onFieldBlur();
          }
        "
        />
      </a-form-model-item>
      <a-form-model-item label="文章分类" prop="region">
        <a-select v-model="form.region" placeholder="请选择文章分类">
          <a-select-option
            v-for="(item, index) in regionList"
            :key="index"
            :value="item.id"
          >{{ item.name }}</a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item ref="sort" label="文章排序" prop="sort">
        <a-input-number
          v-model="form.sort"
          :min="0"
          @blur="
          () => {
            $refs.sort.onFieldBlur();
          }
        "
        />
      </a-form-model-item>

      <a-form-model-item label="是否展示" prop="resource">
        <a-radio-group v-model="form.resource">
          <a-radio value="1">是</a-radio>
          <a-radio value="2">否</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="文章内容" prop="desc" :wrapper-col="{ span: 14, offset: 0 }">
        <mavon-editor
          v-model="form.desc"
          :toolbars="toolbars"
          @imgAdd="handleEditorImgAdd"
          @imgDel="handleEditorImgDel"
        />
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click="onSubmit">提交</a-button>
        
        <a-button type="danger" @click="goBack" style="margin-left: 10px;">返回</a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>


<script>
export default {
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 8 },
      other: "",
      form: {
        name: "",
        sort: "",
        region: undefined,
        resource: "1",
        desc: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入文章标题",
            trigger: "blur"
          },
          {
            min: 3,
            max: 50,
            message: "文章标题为3-50个字符",
            trigger: "blur"
          }
        ],
        region: [
          {
            required: true,
            message: "请选择文章分类",
            trigger: "change"
          }
        ],
        sort: [
          {
            required: true,
            message: "请输入文章序号",
            trigger: "blur"
          }
        ],
        resource: [
          {
            required: true,
            message: "请选择文章状态",
            trigger: "change"
          }
        ],
        desc: [
          {
            required: true,
            message: "Please input activity form",
            trigger: "blur"
          }
        ]
      },
      regionList: [],

      //   markdown编辑器
      context: "", //输入的数据
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        htmlcode: true, // 展示html源码
        help: true, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: false, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: true, // 导航目录
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true // 预览
      },
      imgFile: []
    };
  },
  methods: {
    //返回上一级
    goBack(){
      this.$router.go(-1)
    },
    //   上传图片方法
    handleEditorImgAdd(pos, $file) {
      let formdata = new FormData();
      formdata.append("file", $file);
      this.imgFile[pos - 0] = $file;
      //   let instance = this.$axios.create({
      //     withCredentials: true,
      //     headers: {
      //     //   Authorization: token // 我上传的时候请求头需要带上token 验证，不需要的删除就好
      //     }
      //   });
      this.$axios({
        url: "http://127.0.0.1:9000/api/uploadImage",
        method: "post",
        data: formdata
      }).then(res => {
        console.log(res);
        if (res.data.code === 200) {
          this.$message.success("上传成功");
          let url = res.data.data;
          let name = $file.name;
          if (name.includes("-")) {
            name = name.replace(/-/g, "");
          }
          let content = this.form.desc;
          // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)  这里是必须要有的
          if (content.includes(name)) {
            let oStr = `(${pos})`;
            let nStr = `(${url})`;
            let index = content.indexOf(oStr);
            let str = content.replace(oStr, "");
            let insertStr = (soure, start, newStr) => {
              return soure.slice(0, start) + newStr + soure.slice(start);
            };
            this.form.desc = insertStr(str, index, nStr);
          }
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 删除图片方法
    handleEditorImgDel(pos) {
      console.log(pos);
      delete this.imgFile[pos];
    },
    //提交表单
    onSubmit() {
      if (this.$route.query.id) {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            var region_name = "";
            this.regionList.forEach((item, index) => {
              if (item.id == this.form.region) {
                region_name = item.name;
              }
            });
            let tmp = this.form;
            tmp.region_name = region_name;
            tmp.id = this.$route.query.id;
            console.log(tmp);
            this.$axios({
              url: "http://127.0.0.1:9000/api/article/editArticle",
              method: "post",
              data: tmp
            })
              .then(res => {
                console.log(res);
                let { code, data, msg } = res.data;
                if (code == 200) {
                  this.regionList = data;
                  this.$message.success(msg);
                  this.$router.push({ path: "/home/content" });
                } else {
                  this.$message.error(msg);
                }
              })
              .catch(err => {
                this.$message.error(err);
              });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            var region_name = "";
            this.regionList.forEach((item, index) => {
              if (item.id == this.form.region) {
                region_name = item.name;
              }
            });
            let tmp = this.form;
            tmp.region_name = region_name;
            console.log(tmp);
            this.$axios({
              url: "http://127.0.0.1:9000/api/article/addArticle",
              method: "post",
              data: tmp
            })
              .then(res => {
                console.log(res);
                let { code, data, msg } = res.data;
                if (code == 200) {
                  this.regionList = data;
                  this.$message.success(msg);
                  this.$router.push({ path: "/home/content" });
                } else {
                  this.$message.error(msg);
                }
              })
              .catch(err => {
                this.$message.error(err);
              });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    // 获取分类列表的方法
    getCategorylistHandle() {
      this.$axios({
        url: "http://127.0.0.1:9000/api/category/getCategorylist",
        method: "get"
      })
        .then(res => {
          console.log(res);
          let { code, data } = res.data;
          if (code == 200) {
            this.regionList = data;
          } else {
            this.$message.error(msg);
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    getArticledescHandle(id) {
      this.$axios({
        url: "http://127.0.0.1:9000/api/article/getArticle/" + id,
        method: "get"
      })
        .then(res => {
          let { code, data } = res.data;

          if (code == 200) {
            this.form["name"] = data[0].title;
            this.form["desc"] = data[0].content;
            this.form["sort"] = data[0].o;
            this.form["resource"] = data[0].status;
            this.form["region"] = data[0].cate_id;
            console.log(this.regionList);
          } else {
            this.$message.error(msg);
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    }
  },
  created() {
    this.getCategorylistHandle();
    console.log(this.$route.query.id);
    if (this.$route.query.id) {
      this.getArticledescHandle(this.$route.query.id);
    }
  }
};
</script>

<style lang="">
.v-note-wrapper.shadow {
  border: 1px solid #d9d9d9 !important;
  box-shadow: none !important;
}
</style>