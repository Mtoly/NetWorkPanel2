<template>
  <div v-show="show" ref="chartContainer" style="width: 100%; height: 400px;"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsType } from 'echarts'
import { formatter } from '@/services/speedTest'

const props = defineProps<{
  show: boolean
}>()

const chartContainer = ref<HTMLElement | null>(null)
let myChart: EChartsType
let showArray: Array<[number, number]> = []
let speedTemp: number[] = []
let stepLength = 1

onMounted(() => {
  if (!chartContainer.value) return
  myChart = echarts.init(chartContainer.value)
  
  const chartOption = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const speed = formatter(params[0].data[1], 1, [0, 0, 1, 2, 2, 2])
        return `${new Date(params[0].data[0] * 1000).toLocaleString()}<br />${speed}`
      }
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    title: {
      left: 'left',
      text: '速度图表'
    },
    xAxis: {
      type: 'time',
      boundaryGap: false,
      axisLabel: { show: false },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (val: number) => {
          const a = formatter(val, 1, [0, 0, 0, 0, 0, 0])
          return a === '-' ? '0' : a
        }
      }
    },
    series: [{
      name: '速度',
      type: 'line',
      smooth: false,
      symbol: 'none',
      areaStyle: {},
      data: [[new Date().getTime() / 1000, 0]]
    }],
    grid: {
      x: 0,
      y: 40,
      x2: 8,
      y2: 10,
      containLabel: true
    }
  }

  myChart.setOption(chartOption)
  window.addEventListener('resize', () => myChart?.resize())
})

onUnmounted(() => {
  myChart?.dispose()
})

watch(() => props.show, (newVal) => {
  if (newVal) {
    setTimeout(() => myChart?.resize(), 100)
  }
})

const updateChart = (speed: number) => {
  let refresh = false
  speedTemp.push(speed)
  
  while (speedTemp.length >= stepLength) {
    refresh = true
    const tmp = speedTemp.splice(0, stepLength)
    const avg = tmp.includes(0) ? 0 : tmp.reduce((a, b) => a + b, 0) / stepLength
    showArray.push([new Date().getTime() / 1000, avg])
  }
  
  while (showArray.length >= 200) {
    refresh = true
    const result: Array<[number, number]> = []
    const lengthToProcess = showArray.length % 2 === 0 ? showArray.length : showArray.length - 1
    for (let i = 0; i < lengthToProcess; i += 2) {
      result.push([showArray[i][0], (showArray[i][1] + showArray[i + 1][1]) / 2])
    }
    showArray = result
    stepLength *= 2
  }
  
  if (props.show && refresh && myChart) {
    myChart.setOption({
      series: [{ data: showArray }]
    })
  }
}

const clearChart = () => {
  speedTemp = []
  showArray.push([new Date().getTime() / 1000, 0])
}

defineExpose({
  updateChart,
  clearChart
})
</script>
