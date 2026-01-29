<template>
  <div class="slider-demo-block">
    <span class="font-background">测速地址：</span>
    <el-button type="primary" :icon="CopyDocument" link @click="copyUrl" />
    <el-button type="primary" :icon="Edit" link @click="editVisible = true" />
    <br>
    <el-select style="width: 100%;" v-model="selectedUrl" @change="handleUrlChange">
      <el-option-group v-for="group in nodes" :key="group.label" :label="group.label">
        <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value" />
      </el-option-group>
      <template #prefix>
        <el-icon><Link /></el-icon>
      </template>
    </el-select>
  </div>

  <el-dialog style="width: 90%;max-width: 700px;" v-model="editVisible" title="自定义地址">
    <el-table v-if="customNodes.length" :data="customNodes" style="width: 100%" max-height="300">
      <el-table-column prop="label" label="名称" width="100" />
      <el-table-column prop="value" label="URL" />
      <el-table-column fixed="right" label="" width="50">
        <template #default="scope">
          <el-button type="danger" link :icon="Delete" @click="removeNode(scope.$index)" />
        </template>
      </el-table-column>
    </el-table>
    <el-empty v-else description="没有自定义地址" />
    <el-button class="mt-4" style="width: 100%" @click="addVisible = true">添加地址</el-button>
  </el-dialog>

  <el-dialog style="width: 90%;max-width: 700px;" v-model="addVisible" title="添加链接">
    <el-form :model="addForm">
      <el-form-item label="名称:" label-width='50px'>
        <el-input v-model="addForm.label" autocomplete="off" />
      </el-form-item>
      <el-form-item label="url:" label-width='50px'>
        <el-input v-model="addForm.value" autocomplete="off">
          <template #suffix>
            <el-icon v-if="urlParser(addForm.value)"><CircleCheck /></el-icon>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <el-alert title="注意：" type="warning">
      在浏览器工作的程序受到浏览器安全策略的限制<br>
      以下情况你将无法正常使用链接<br>
      1.你使用https协议打开的本站，但是url是http协议<br>
      2.目标服务器返回的Access-Control-Allow-Origin响应头没有允许本站<br>
      具体细节请在报错后查看控制台
    </el-alert>
    <el-alert title="免责声明：" type="error">
      请勿用于非法用途，使用本功能造成的一切后果由用户承担
    </el-alert>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addVisible = false">取消</el-button>
        <el-button type="primary" :disabled="!urlParser(addForm.value) || !addForm.label || addForm.checking" @click="addNode">
          确认
          <el-icon v-if="addForm.checking" class="is-loading"><Loading /></el-icon>
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Link, Edit, Delete, CircleCheck, Loading, CopyDocument } from '@element-plus/icons-vue'
import { toClipboard } from '@soerenmartius/vue3-clipboard'
import { useNodesStore } from '@/stores/nodes'
import { checkUrl, urlParser } from '@/services/speedTest'

const nodesStore = useNodesStore()
const nodes = computed(() => nodesStore.allNodes)
const customNodes = computed(() => nodesStore.customNodes)
const selectedUrl = computed({
  get: () => nodesStore.runUrl,
  set: (val) => nodesStore.setRunUrl(val)
})

const editVisible = ref(false)
const addVisible = ref(false)
const addForm = ref({
  label: '',
  value: '',
  checking: false
})

const handleUrlChange = (value: string) => {
  nodesStore.setRunUrl(value)
}

const copyUrl = () => {
  toClipboard(selectedUrl.value).then(() => {
    ElMessage.success('已复制当前链接')
  })
}

const removeNode = (index: number) => {
  nodesStore.removeCustomNode(index)
}

const addNode = async () => {
  addForm.value.value = urlParser(addForm.value.value)
  addForm.value.checking = true
  const urlStatus = await checkUrl(addForm.value.value)
  addForm.value.checking = false
  
  if (!urlStatus.status) {
    ElMessage.error(urlStatus.info)
    return
  }
  
  nodesStore.addCustomNode({
    label: addForm.value.label,
    value: addForm.value.value
  })
  
  addForm.value.label = ''
  addForm.value.value = ''
  addVisible.value = false
}
</script>

<style scoped>
.font-background {
  color: #344357;
  font-size: 14px;
}

@media (prefers-color-scheme: dark) {
  .font-background {
    color: rgb(193, 206, 230);
  }
}
</style>
