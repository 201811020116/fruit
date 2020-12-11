<template>

    <el-container class="home-container">
        <!--  头部布局-->
        <el-header>
            <div>
                <img src="src/assets/logo.png">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!-- 页面主体    -->
        <el-container>

            <el-aside>
                <!--侧边栏菜单区-->
                <el-menu
                        background-color="slateblue"
                        text-color="#fff"
                        active-text-color="#409EFF"
                        unique-opened
                        router
                :default-active="activePath">
                    <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
                        <template slot="title">
                            <i :class="iconsObj[item.id]"></i>
                            <span>{{item.authName}}</span>
                        </template>
                        <el-menu-item :index=" '/'+ subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState( '/'+ subItem.path)">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>


            </el-aside>

            <el-main>
                <router-view></router-view>
            </el-main>

        </el-container>
    </el-container>
</template>

<script>
    export default {
        data() {
            return {
                menulist: [],
                iconsObj: {
                    '125': 'iconfont icon-yonghu',
                    '103': 'iconfont icon-lifangtilitiduomiantifangkuai2',
                    '101': 'iconfont icon-gouwushangpinliwushoutidaimianxing',
                    '102': 'iconfont icon-danju',
                    '145': 'iconfont icon-baobiao'
                },
                activePath: ''
            }
        },
        created() {
            this.getMenuList()
            this.activePath = window.sessionStorage.getItem('activePath')
        },
        name: "Home",
        methods: {
            logout() {
                window.sessionStorage.clear();
                this.$router.push('/login');
            },

            async getMenuList() {
                const {data: res} = await this.$http.get('menus')
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
                this.menulist = res.data
                console.log(res)
            },
            saveNavState(activePath){
                window.sessionStorage.setItem('activePath', activePath)
                this.activePath = activePath
            }
        }
    }
</script>

<style langg="less" scoped>
    .home-container {
        height: 100%;
    }

    .el-header {
        background-color: #373D41;
        display: flex;
        justify-content: space-between;
        padding-left: 0;
        align-items: center;
        color: #ffffff;
        font-size: 20px;
        >div{
            display: flex;
            align-items: center;
            span{
                margin-left: 15px;
            }
        }
    }

    .el-aside {
        background-color: slateblue;
        .el-menu {
            border-right: none;
        }
    }

    .el-main {
        background-color: #eaedf1;
    }

    .iconfont {
        margin-right: 10px;
    }
</style>