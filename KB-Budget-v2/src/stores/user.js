import { ref } from 'vue'
import { defineStore } from 'pinia'
import seed from '../../db.json'
import { fetchUser } from '../api/users'

/** 로그인 화면 없이 가정하는 세션 유저 (db.json users id) */
export const ASSUMED_SESSION_USER_ID = '1'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref(null)
  const loadError = ref(null)

  async function loadCurrentUser() {
    loadError.value = null
    try {
      currentUser.value = await fetchUser(ASSUMED_SESSION_USER_ID)
    } catch (e) {
      loadError.value = e
      const fallback = seed.users?.find((u) => String(u.id) === ASSUMED_SESSION_USER_ID)
      currentUser.value = fallback ? { ...fallback } : null
      console.error(e)
    }
  }

  return {
    currentUser,
    loadError,
    loadCurrentUser,
  }
})
