<template>
  <el-dialog align-center style="width: 95vw;max-width: 600px;max-height: 85vh;" v-model="show" title="排行榜">
    <div style="overflow-y: auto;max-height: calc(85vh - 100px);margin-top:-30px">
      <div class="mb-2 flex items-center text-sm">
        <el-radio-group v-model="sortBy" @change="refreshMark" class="ml-4">
          <el-radio label="allUsed" size="small">总流量</el-radio>
          <el-radio label="averageSpeed" size="small">平均速度</el-radio>
          <el-radio label="onlineTime" size="small">在线时长</el-radio>
        </el-radio-group>
      </div>
      <div class="mb-2 flex items-center text-sm">
        <el-radio-group v-model="grade" @change="refreshMark" class="ml-4">
          <el-radio label='3' size="small">小时</el-radio>
          <el-radio label='2' size="small">天</el-radio>
          <el-radio label='1' size="small">月</el-radio>
          <el-radio label='0' size="small">年</el-radio>
          <el-checkbox v-model="past" label="上个统计周期" size="small" @change="refreshMark" />
        </el-radio-group>
      </div>
      <el-table style="min-height: 500px;" :table-layout="'auto'" v-loading="isLoading" :data="mark" size="small">
        <template #empty>
          <el-empty v-show="!isLoading" description="没有数据" />
        </template>
        <el-table-column type="index" label="" width="40" />
        <el-table-column prop="user" label="用户">
          <template #default="scope">
            <div class="block">
              <el-avatar :size="30" :src="scope.row.headimg" />
              <span style="margin-left: 10px;vertical-align: 6px;">{{ scope.row.user}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="data" :label="dataText" />
        <el-table-column v-if="showSimple" prop="user" label="属地">
          <template #default="scope">
            <div class="block">
              <el-tooltip class="item" effect="dark" :content="scope.row.short" placement="top">
                <el-tag size="small" :type="scope.row.type" class="tag-long" round>{{ scope.row.short }}</el-tag>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="!showSimple" prop="user" label="运营商">
          <template #default="scope">
            <div class="block">
              <el-tooltip class="item" effect="dark" :content="scope.row.isp" placement="top">
                <el-tag size="small" :type="scope.row.type" class="tag-short" round>{{ scope.row.isp }}</el-tag>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="!showSimple" prop="user" label="属地">
          <template #default="scope">
            <div class="block">
              <span style="margin-left: 10px;">{{ scope.row.addr}}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-button style="width: 100%" @click="isShowMe=true">用户中心</el-button>
  </el-dialog>
  <el-dialog align-center style="width: 99vw;max-width: 500px;" v-model="isShowMe" title="用户中心">
    <MyUI v-if="isShowMe" />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, type Ref, watch } from 'vue'
import { ElMessageBox } from 'element-plus'
import { rankingApi } from '@/services/ranking'
import type { RankingUser } from '@/types/ranking'
import MyUI from "./My.vue"

const sortBy = ref('allUsed')
const isLoading = ref(false)
const isShowMe = ref(false)
const showSimple = ref(true)

window.onresize = () => {
  if (window.outerWidth > 500) showSimple.value = false
  else showSimple.value = true
}
if (window.outerWidth > 500) showSimple.value = false
else showSimple.value = true

const past = ref(false)
const grade = ref('3')
const dataText = ref("总流量")

const getDataText = () => {
  let ret = { allUsed: "总流量", averageSpeed: "平均速度", onlineTime: "在线时长" }[sortBy.value]
  return ret ? ret : ""
}

const props = defineProps<{
  show?: { show: boolean }
}>()

const show = ref(false)
if (props.show) {
  watch(props.show, (ns, os) => {
    show.value = ns.show
  })
}

watch(show, (ns, os) => {
  if (props.show) props.show.show = ns
  if (ns) refreshMark()
})

const mark: Ref<RankingUser[]> = ref([])

const typeMatch = (str: string) => {
  const arr1 = ['移动', '联通', '电信', '广电']
  const arr2 = ['', 'success', 'warning', 'danger']
  for (let i in arr1) if (str.includes(arr1[i])) return arr2[i]
  return 'info'
}

const refreshMark = async () => {
  dataText.value = getDataText()
  isLoading.value = true
  mark.value = []
  try {
    let rep = await rankingApi.getRankings({
      grade: grade.value,
      sorted_by: sortBy.value,
      isPast: past.value
    })
    rep.data.forEach((element: any) => {
      let formatted
      if (sortBy.value == 'allUsed') {
        formatted = formatter(element.data, 0, [0, 0, 0, 0, 1, 1])
      } else if (sortBy.value == 'averageSpeed') {
        formatted = formatter(element.data * 8, 2, [0, 0, 0, 1, 1, 1])
      } else if (sortBy.value == 'onlineTime') {
        formatted = timeFormatter(element.data)
      }
      element.data = formatted
      element.type = typeMatch(element.isp)
      mark.value.push(element)
    })
  } catch (err) {
    ElMessageBox.alert('无法获取榜单信息，可能是后端服务器异常', '错误', {
      confirmButtonText: '确定'
    })
  }
  isLoading.value = false
}

import { formatter, timeFormatter } from '@/utils/formatters'
</script>

<style scoped>
.tag-short {
  max-width: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tag-long {
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
