import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { NodeGroup, CustomNode } from '@/types/node'
import { storage } from '@/services/storage'
import nodesJson from '@/assets/nodes.json'

export const useNodesStore = defineStore('nodes', () => {
  const customNodes = ref<CustomNode[]>(storage.get('customNodes', []))
  const runUrl = ref<string>(storage.get('url', ''))
  
  const onlineNodes = ref<NodeGroup[]>([])
  for (const groupName in nodesJson) {
    const group = nodesJson[groupName as keyof typeof nodesJson]
    const temp: NodeGroup = { label: groupName, options: [] }
    for (const node in group) {
      temp.options.push({
        value: group[node as keyof typeof group],
        label: node
      })
    }
    onlineNodes.value.push(temp)
  }

  const allNodes = ref<NodeGroup[]>(
    customNodes.value.length
      ? [{ label: '自定义', options: customNodes.value }].concat(onlineNodes.value)
      : onlineNodes.value
  )

  if (!runUrl.value && allNodes.value[0]?.options[0]) {
    runUrl.value = allNodes.value[0].options[0].value
  }

  const addCustomNode = (node: CustomNode) => {
    customNodes.value.push(node)
    storage.set('customNodes', customNodes.value)
    updateAllNodes()
  }

  const removeCustomNode = (index: number) => {
    customNodes.value.splice(index, 1)
    storage.set('customNodes', customNodes.value)
    updateAllNodes()
  }

  const updateAllNodes = () => {
    allNodes.value = customNodes.value.length
      ? [{ label: '自定义', options: customNodes.value }].concat(onlineNodes.value)
      : onlineNodes.value
  }

  const setRunUrl = (url: string) => {
    runUrl.value = url
    storage.set('url', url)
  }

  return {
    customNodes,
    onlineNodes,
    allNodes,
    runUrl,
    addCustomNode,
    removeCustomNode,
    setRunUrl
  }
})
