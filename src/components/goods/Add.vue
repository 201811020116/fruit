<template>
    <div>
        <!--面包屑区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区-->
        <el-card>
            <!--提示区域-->
            <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
            <!-- 步骤条区-->
            <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
                <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="tab">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="2">
                        <el-upload
                                :action='uploadURL'
                                :on-preview="handlePreview"
                                :on-remove="handleRemove"
                                multiple
                                list-type="picture"
                                :headers="headerObj"
                                :on-success="handleSuccess">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="3">
                        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                        <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <!-- 图片预览-->
        <el-dialog
                title="预览"
                :visible.sync="previewDialogVisible"
                width="50%">
            <img :src="previewPath" class="previewImg">
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Add",
        data() {
            return {
                activeIndex: '0',
                addForm: {
                    goods_name: '',
                    goods_price: '',
                    goods_weight: '',
                    goods_number: '',
                    goods_introduce:''
                },
                addFormRules: {
                    goods_name: [
                        {required: true, message: "请输入商品名称", trigger: "blur"},
                    ],
                    goods_price: [
                        {required: true, message: "请输入商品价格", trigger: "blur"},
                    ],
                    goods_weight: [
                        {required: true, message: "请输入商品重量", trigger: "blur"},
                    ],
                    goods_number: [
                        {required: true, message: "请输入商品数量", trigger: "blur"},
                    ]
                },
                headerObj: {
                    authorization: window.sessionStorage.getItem('token')
                },
                uploadURL:"http://127.0.0.1:8888/api/private/v1/upload",
                pics:[],
                previewPath: '',
                previewDialogVisible: false
            }
        },
        created() {
        },

        methods: {
            tab(activeName, oldActiveName) {
                if (oldActiveName === '0' && (this.addForm.goods_number == 0 | this.addForm.goods_weight == 0)) {
                    this.$message.error("请将基本信息填写完整！")
                    return false
                }

            },
            // 处理预览操作
            handlePreview(file) {
                this.previewPath = file.response.data.url
                this.previewDialogVisible=true
            },
            //处理移除图片操作
            handleRemove(file) {
                //    1. 获取删除图片的临时路径
                const filePath = file.response.data.tmp_path
                //    2.找到pics数组对应的索引值
                const i = this.addForm.pics.findIndex(x => x.pic === filePath)
                //    3. 调用splice方法移除图片信息对象
                this.addForm.pics.splice(i,1)
            },
            // 监听上传图片成功事件
            handleSuccess(response){
                // 1.拼接得到图片信息对象
                const picInfo = { pic: response.data.tmp_path }
            //    2.吗，
                this.addForm.pics.push(picInfo)
            },
            //添加商品
            add(){
                this.$refs.addFormRef.validate( async valid => {
                    if(!valid) return this.$message.error("请填写必要的表单项！")
                    const {data: res} = await this.$http.post('goods', this.addForm)
                    if (res.meta.status !== 201) {
                        this.$message.error('添加商品失败！')
                    }
                    this.$message.success('添加成功！')
                    console.log(res.meta.status)
                    this.$router.push('/goods')
                })
            }


        }
    }
</script>

<style scoped>
    .previewImg{
        width: 100%;
    }
    .btnAdd{
        margin-top: 15px;
    }
</style>