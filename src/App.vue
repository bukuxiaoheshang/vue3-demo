<template>
  <div class="table-box">
    <!--标题-->
    <div class="title">
      <h2>最简单的CURD demo</h2>
    </div>
    <div class="query-box">
      <el-input class="queryInput" v-model="queryInput"  placeholder="请输入姓名搜索" 
      @change="handleQueryName"/>
      <div class="btn-list">
        <el-button  type="primary"  @click="handleAdd">增加</el-button>
        <el-button  type="danger"  @click="handleDelList" v-if="multipleSelection.length>0">删除多选</el-button>
      </div>
     
    </div>
      <el-table :data="tableData" style="width: 100%" border="1" ref="multipleTableRef"
      @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="email" label="邮箱" width="120" />
        <el-table-column prop="phone" label="电话" width="120" />
        <el-table-column prop="state" label="状态" width="120" />
        <el-table-column prop="address" label="地址" width="500" />
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleRowDel(scope.row)" style="color:#F56C6C">
              删除
            </el-button>
            <el-button link type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
  
        <el-pagination background layout="prev, pager, next" 
        style="display: flex;justify-content:center;margin-top:10px"
        :total="total"
        v-model:current-page="curPage"
        @current-change="handleChangePage"/>
  
      <el-dialog v-model="dialogFormVisible" :title="dialogType=='add'?'新增':'编辑'" width="500">
        <el-form :model="tableForm">
          <el-form-item label="姓名" :label-width="120">
            <el-input v-model="tableForm.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="邮箱" :label-width="120">
            <el-input v-model="tableForm.email" autocomplete="off" />
          </el-form-item>
          <el-form-item label="电话" :label-width="120">
            <el-input v-model="tableForm.phone" autocomplete="off" />
          </el-form-item>
          <el-form-item label="状态" :label-width="120">
            <el-input v-model="tableForm.state" autocomplete="off" />
          </el-form-item>
          <el-form-item label="地址" :label-width="120">
            <el-input v-model="tableForm.address" autocomplete="off" />
          </el-form-item>   
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            
            <el-button type="primary" @click="dialogConfirm">
              确认
            </el-button>
          </div>
        </template>
      </el-dialog>
  </div>
</template>

<script setup>
  import {ref} from "vue";  
  import request from './utils/request'
  
  let total = $ref(5)
  let curPage = $ref(1)

  let queryInput = $ref ('')
  let tableData = $ref ([
  // {
  //   id:"1",
  //   name: 'Tom1',
  //   email:'1222@qq.com',
  //   phone:"139135138171",
  //   state: 'California',
  //   address: 'No. 189, Grove St, Los Angeles',
 
  // },
  // {id:"2",
  //   name: 'Tom2',
  //   email:'1222@qq.com',
  //   phone:"139135138171",
  //   state: 'California',
  //   address: 'No. 189, Grove St, Los Angeles',
 
  // },
  // {id:"3",
  //   name: 'Tom3',
  //   email:'1222@qq.com',
  //   phone:"139135138171",
  //   state: 'California',
  //   address: 'No. 189, Grove St, Los Angeles',
 
  // },
  // {id:"4",
  //   name: 'Tom4',
  //   email:'1222@qq.com',
  //   phone:"139135138171",
  //   state: 'California',
  //   address: 'No. 189, Grove St, Los Angeles',
 
  // },
])
  let tableCpy = Object.assign(tableData) 
  let  multipleSelection = $ref([])
  let dialogFormVisible =$ref(false)
  let tableForm = $ref({
    name:'张三',
    email:'1222@qq.com',
    phone:"139135138171",
    state:"在职",
    address:"广东省"
  })
let dialogType =$ref('add')

const handleRowDel =async ({ID}) => {
  debugger
   console.log(ID);
  // //1.通过id获取到条目对应的 索引值
  // let index =tableData.findIndex(item=>item.id==id)
  // tableData.splice(index,1)

  await request.delete(`delete/${ID}`)
  await getTableData(curPage)

}

const handleSelectionChange = (val)=> {
  //multipleSelection = val
  //console.log(val);
  multipleSelection=[]
  val.forEach(item=>
    multipleSelection.push(item.id)
  )
  console.log(multipleSelection);
}

const handleAdd = (val)=> {
  dialogFormVisible = true
  tableForm = []
  console.log(val);
  dialogType ='add'
}

const handleEdit = (row)=> {
  dialogFormVisible = true
  console.log(row);
  dialogType ='edit'
  tableForm = {...row}
}

const dialogConfirm = async ()=> {
   dialogFormVisible =false

   //判断是新增还是编辑
   if(dialogType=='add') {

  //   tableData.push({
  //   id: (tableData.length+1).toString(),
  //   ...tableForm
  //  })

//添加数据
   await request.post("/add",{
      ...tableForm
    })

    await getTableData(curPage)

   } else{
    //debugger
    //1.获取当前这条索引
    // let index =tableData.findIndex(item=>item.id===tableForm.id)
    // //2.替换当前索引值对应的数据
    // tableData[index]=tableForm

    await request.put(`/update/${tableForm.ID}`,{
      ...tableForm
    })
    await getTableData(curPage)
   }
    
 


}

const handleDelList = (val)=> {
  // multipleSelection.forEach(id=>{
  //   handleRowDel({id})
  // })

  multipleSelection.forEach(ID=>{
    handleRowDel({ID})
  })
  multipleSelection=[]
}

const handleQueryName = async (val)=> {
  // console.log(queryInput);
  // if(queryInput.length>0){
  //   tableData = tableData.filter(item=>item.name.toLowerCase().match(val.toLowerCase()))
  // } else {
  //   tableData = tableCpy
  // }
  if (val.length>0) {
    let res= await request.get(`/list/${val}`)
    tableData =res
  }else {
    getTableData(curPage)
  }

 
}

const getTableData = async (cur=1)=> {
  let res = await request.get('list',{
    pageSize:10,
    pageNum:cur
  })
  console.log(res)
  tableData = res.List
  total = res.total
}
getTableData()

//请求分页
const handleChangePage = (val)=> {
  debugger
  getTableData(curPage)
}

</script>

<style scoped>
  .table-box {
    width:800px;
   margin: 200px auto;
  }
  .title {
    text-align:center;
  }
  .query-box {
    display: flex;
    justify-content:space-between;
    margin-bottom:20px;
  }
 
  .queryInput{
    width: 200px;
  }


</style>
