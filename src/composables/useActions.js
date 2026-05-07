import { reactive, computed } from 'vue'
import { api } from '../api/client.js'

const state = reactive({
  actions: [],
})

export function useActions() {
  const actions = computed(() => state.actions)
  const hasActions = computed(() => state.actions.length > 0)

  async function loadActions() {
    try {
      const res = await api.get('/actions')
      if (res.ok) {
        const data = await res.json()
        state.actions = data.actions || []
      }
    } catch {
      // best-effort
    }
  }

  function findActionForToken(tokenId) {
    return state.actions.find((a) => a.token_id === tokenId)
  }

  return { actions, hasActions, loadActions, findActionForToken }
}
