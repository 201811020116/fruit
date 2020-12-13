<template xmlns:el-cascader="http://www.w3.org/1999/html">
    <div>
        <!--面包屑区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区-->
        <el-card>
            <!--搜索与添加区-->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getOrderList">
                        <el-button slot="append" icon="el-icon-search"  @click="getOrderList" ></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <!--订单列表区-->
            <el-table :data="orderlist" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="订单编号" prop="order_number" ></el-table-column>
                <el-table-column label="订单价格" prop="order_price" ></el-table-column>
                <el-table-column label="是否付款" prop="order_status">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.pay_status === '1' ">已付款</el-tag>
                        <el-tag type="danger" v-else>未付款</el-tag>
                    </template>

                </el-table-column>
                <el-table-column label="是否发货" prop="is_send"></el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.order_id)"></el-button>
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
                title="修改地址"
                :visible.sync="addressVisible"
                width="50%"
        @close="addressclosed">
            <el-form :model="addressForm" :rules="addressFormRules" ref="formRef" label-width="100px">
                <el-form-item label="省市区/县" prop="address1">
                    <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                    <el-input v-model="addressForm.address2" ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="addressVisible = false">取 消</el-button>
            <el-button type="primary"  @click="editAddress">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    import citydata from "./citydata.js"
    export default {
        name: "Order",
        data(){
            return{
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 10
                },
                orderlist: [],
                total: 0,
                addressVisible: false,
                addressForm:{
                    address1: [],
                    address2: ''
                },
                addressFormRules:{
                    address1: [
                        {required: true, message: "请选择省市区县", trigger: "blur"}
                  ],
                    address2: [
                        {required: true, message: "请填写详细地址", trigger: "blur"}
                    ]
                },
                cityData: citydata

            }

        },
        created() {
            this.getOrderList()

        },
        methods:{
            async getOrderList() {
                const {data: res} = await this.$http.get('orders', {params: this.queryInfo})
                if (res.meta.status !== 200) return this.$message.error('获取订单列表失败')
                this.orderlist = res.data.goods
                this.total = res.data.total
            },
            //监听pagesize改变的事件
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                this.getOrderList()
            },
            //监听页码值改变的事件
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage
                this.getOrderList()
            },

            //展示修改地址对话框
            async showEditDialog(id){
                const {data: res} = await this.$http.get('orders/' + id)
                if (res.meta.status !== 200) return this.$message.error('查询失败！')
                this.addressForm = res.data
                this.addressVisible = true
            },
            addressclosed(){
                this.$refs.formRef.resetFields()
            },
            // 修改地址并提交
            editAddress() {
                this.$refs.formRef.validate(async valid => {
                    if (!valid) return
                    //验证通过后，可以发起修改地址的网络请求
                    const {data: res} = await this.$http.put('orders/' + this.addressForm.order_id, {
                        address1: this.addressForm.address1,
                        address2: this.addressForm.address2
                    })
                    if (res.meta.status !== 200) {
                        this.$message.error('更新地址信息失败！')
                    }
                    //    关闭对话框
                    this.addressVisible = false
                    //    刷新数据列表
                    this.getOrderList()
                    // 提示修改成功
                    this.$message.success('更新地址成功！')
                })
            },

        }
    }
</script>

<style lang="less" scoped>

</style>