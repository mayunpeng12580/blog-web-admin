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
        desc: "发送到房贷是否松动"
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
            max: 5,
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
    //   上传图片方法
    handleEditorImgAdd(pos, $file) {
      
      let formdata = new FormData();
      formdata.append("file", $file);
      this.imgFile[(pos-0)] = $file;
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
          console.log(res)
        if (res.data.code === 200) {
          this.$Message.success("上传成功");
          let url = res.data.data;
          let name = $file.name;
          if (name.includes("-")) {
            name = name.replace(/-/g, "");
          }
          let content = this.form.content;
          // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)  这里是必须要有的
          if (content.includes(name)) {
            let oStr = `(${pos})`;
            let nStr = `(${url})`;
            let index = content.indexOf(oStr);
            let str = content.replace(oStr, "");
            let insertStr = (soure, start, newStr) => {
              return soure.slice(0, start) + newStr + soure.slice(start);
            };
            this.form.content = insertStr(str, index, nStr);
          }
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    // 删除图片方法
    handleEditorImgDel(pos) {
        console.log(pos)
      delete this.imgFile[pos];
    },
    //提交表单
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          console.log(this.form);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
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
    }
  },
  created() {
    this.getCategorylistHandle();
  }
};
</script>

<style lang="">
.v-note-wrapper.shadow {
  border: 1px solid #d9d9d9 !important;
  box-shadow: none !important;
}
</style>