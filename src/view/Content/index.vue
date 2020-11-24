<template>
  <div id="content-wrap">
    <a-button class="editable-add-btn" @click="handleAdd">Add</a-button>
    <a-table bordered :data-source="dataSource" :columns="columns" :loading="isloading">
        <span
          slot="status"
          slot-scope="status"
        >{{ status == 1 ? "显示" : "隐藏"}}
        </span>
        <span
          slot="updatetime"
          slot-scope="updatetime"
        >{{ updatetime|date('YYYY-MM-DD HH:mm:ss') }}
        </span>
      <template slot="operation" slot-scope="text, record">
        <a-button type="primary" @click="handleEdit(record)" size="small">
          <a-icon type="edit" />
        </a-button>
        <a-popconfirm
          v-if="dataSource.length"
          title="Sure to delete?"
          @confirm="() => onDelete(record.id)"
        >
          <a-button type="danger" size="small">
            <a-icon type="delete" />
          </a-button>
        </a-popconfirm>
      </template>
    </a-table>

    <!-- 增加分类弹出框 -->
    <a-modal
      :title="modalTitle"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules" v-bind="layout">
        <a-form-model-item has-feedback label="分类名称" prop="name">
          <a-input v-model="ruleForm.name" type="text" autocomplete="off" />
        </a-form-model-item>

        <!-- <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="submitForm('ruleForm')">Submit</a-button>
          <a-button style="margin-left: 10px" @click="resetForm('ruleForm')">Reset</a-button>
        </a-form-model-item>-->
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
export default {
  data() {
    //表单验证
    let validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入分类名称"));
      } else {
        callback();
      }
    };

    return {
      currId: "",
      isloading: true,
      modalTitle: "添加分类",
      visible: false,
      confirmLoading: false,
      dataSource: [],
      count: 2,
      columns: [
        {
          title: "ID",
          dataIndex: "id",
          width: "30%"
          //   scopedSlots: { customRender: 'name' },
        },
        {
          title: "文章标题",
          dataIndex: "title"
        },
        {
          title: "分类名称",
          dataIndex: "cate_name"
        },
        {
          title: "排序",
          dataIndex: "o"
        },
        {
          title: "状态",
          dataIndex: "status",
          scopedSlots: { customRender: "status" }
        },
        {
          title: "修改时间",
          dataIndex: "updatetime",
          scopedSlots: { customRender: "updatetime" }
        },
        {
          title: "操作",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" }
        }
      ],
      ruleForm: {
        name: ""
      },
      rules: {
        name: [{ validator: validateName, trigger: "change" }]
      },
      layout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 }
      }
    };
  },
  methods: {
    //打开开出层发放
    handleOk(e) {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.confirmLoading = true;
          if (this.modalTitle == "添加分类") {
            this.$axios({
              url: "http://127.0.0.1:9000/api/category/addCategory",
              method: "post",
              data: this.ruleForm
            })
              .then(res => {
                console.log(res);
                let { code, msg } = res.data;
                if (code == 200) {
                  this.$message.success(msg);
                  this.visible = false;
                  this.confirmLoading = false;
                  this.getCategorylistHandle();
                } else {
                  this.confirmLoading = false;
                  this.$message.error(msg);
                }
              })
              .catch(err => {
                this.confirmLoading = false;
                this.$message.error(err);
              });
          } else {
            var data = this.ruleForm;
            data["id"] = this.currId;
            this.$axios({
              url: "http://127.0.0.1:9000/api/category/editCategory",
              method: "post",
              data: data
            })
              .then(res => {
                console.log(res);
                let { code, msg } = res.data;
                if (code == 200) {
                  this.$message.success(msg);
                  this.visible = false;
                  this.confirmLoading = false;
                  this.getCategorylistHandle();
                } else {
                  this.confirmLoading = false;
                  this.$message.error(msg);
                }
              })
              .catch(err => {
                this.confirmLoading = false;
                this.$message.error(err);
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 关闭弹出层方法
    handleCancel(e) {
      console.log("Clicked cancel button");
      this.visible = false;
    },
    onCellChange(key, dataIndex, value) {
      const dataSource = [...this.dataSource];
      const target = dataSource.find(item => item.key === key);
      if (target) {
        target[dataIndex] = value;
        this.dataSource = dataSource;
      }
    },
    onDelete(key) {
      console.log(key);
      this.$axios({
        url: "http://127.0.0.1:9000/api/article/deleteArticle/" + key,
        method: "get"
      })
        .then(res => {
          console.log(res);
          let { code, msg } = res.data;
          if (code == 200) {
            this.$message.success(msg);
            this.getArticlelistHandle();
          } else {
            this.$message.error(msg);
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    handleAdd() {
    //   this.ruleForm.name = "";
    //   this.modalTitle = "添加分类";
    //   this.visible = true;
      this.$router.push({path: '/home/cafrom'})
    },
    handleEdit(data) {
      this.$router.push({path: '/home/cafrom?id=' + data.id})
    },
    // 获取文章列表的方法
    getArticlelistHandle() {
      this.$axios({
        url: "http://127.0.0.1:9000/api/article/getArticleList",
        method: "get"
      })
        .then(res => {
          console.log(res);
          let { code, data } = res.data;
          if (code == 200) {
            this.dataSource = data;
            this.isloading = false;
            // this.$message.success(msg);
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
    this.getArticlelistHandle();
  }
};
</script>
<style>
.editable-cell {
  position: relative;
}

.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding-right: 24px;
}

.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}

.editable-cell-icon,
.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}

.editable-cell-icon {
  line-height: 18px;
  display: none;
}

.editable-cell-icon-check {
  line-height: 28px;
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
  color: #108ee9;
}

.editable-add-btn {
  margin-bottom: 8px;
}
</style>