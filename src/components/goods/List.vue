<template>
    <div>
        <!--面包屑区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区-->
        <el-card>
            <!--搜索与添加区-->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="add">添加商品</el-button>
                </el-col>
            </el-row>

            <!--商品列表区-->
            <el-table :data="goodslist" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name" width="460"></el-table-column>
                <el-table-column label="商品价格（元）" prop="goods_price" width="100px"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight" width="80"></el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini"
                                   @click="showEditDialog(scope.row.goods_id)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                                   @click="removeById(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>


            <!--分页区-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1, 5, 10, 15]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>
        <el-dialog
                title="修改商品"
                :visible.sync="editDialogVisible"
                width="50%"
                @close="editDialogClosed">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
                <el-form-item label="商品名称">
                    <el-input v-model="editForm.goods_name" disabled></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="goods_price">
                    <el-input v-model="editForm.goods_price"></el-input>
                </el-form-item>
                <el-form-item label="商品重量" prop="goods_weight">
                    <el-input v-model="editForm.goods_weight"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editInfo()">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "List",
    data(){
        return {
            //   获取商品列表的参数对象
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 10
            },
            goodslist: [],
            total: 0,
            editForm: {
                goods_name:'',
                goods_price:'',
                goods_weight:''
            },
            editFormRules: {
                goods_name: [
                    {required: true, message: "请输入商品名", trigger: "blur"}
                      ],
                goods_price: [
                    {required: true, message: "请输入商品价格", trigger: "blur"}
                      ],
                goods_weight: [
                    {required: true, message: "请输入商品重量", trigger: "blur"}
                ]
            },
            editDialogVisible : false
    }
    },
    created() {
        this.getGoodsList()
    },
    methods:{
        async getGoodsList() {
            const {data: res} = await this.$http.get('goods', {params: this.queryInfo})
            if (res.meta.status !== 200) return this.$message.error('获取商品列表失败')
            this.goodslist = res.data.goods
            this.total = res.data.total
        },
        //监听pagesize改变的事件
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getUserList()
        },
        //监听页码值改变的事件
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getGoodsList()
        },

        async showEditDialog(id){
            const {data: res} = await this.$http.get('goods/' + id)
            if (res.meta.status !== 200) return this.$message.error('查询失败！')
            this.editForm = res.data
            this.editDialogVisible = true
        },
        //监听修改对话框的关闭事件
        editDialogClosed() {
            this.$refs.editFormRef.resetFields()
        },
        // 修改信息并提交
        editInfo() {
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return
                //验证通过后，可以发起修改的网络请求
                const {data: res} = await this.$http.put('goods/' + this.editForm.goods_id, {
                    goods_price: this.editForm.goods_price,
                    goods_weight: this.editForm.goods_weight
                })
                if (res.meta.status !== 200) {
                    this.$message.error('更新失败！')
                }
                //    关闭对话框
                this.editDialogVisible = false
                //    刷新数据列表
                this.getGoodsList()
                // 提示修改成功
                this.$message.success('更新成功！')
            })
        },
        // 根据id删除用户信息
        async removeById(id) {
            const confirmResult = await this.$confirm('确定永久删除该商品吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            if (confirmResult !== 'confirm') {
                return this.$message.info('取消删除')
            }
            const {data: res} = await this.$http.delete(`goods/${id}`)
            if (res.meta.status !== 200) {
                return this.$message.error('删除失败！')
            }
            this.$message.success('删除成功！')
            this.getGoodsList()
        },
        //添加商品
        add(){
            this.$router.push('/goods/add')
        }
    }
    }
</script>

<style lang="less" scoped>

</style>