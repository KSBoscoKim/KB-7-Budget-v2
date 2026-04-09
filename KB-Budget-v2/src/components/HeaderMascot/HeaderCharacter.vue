<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import RabbitMascot from './RabbitMascot.vue'
import BearMascot from './BearMascot.vue'
import CrocodileMascot from './CrocodileMascot.vue'
import AlpacaMascot from './AlpacaMascot.vue'

const { currentUser } = storeToRefs(useUserStore())

const MASCOT_MAP = {
  '보슬비형': RabbitMascot,
  '플렉스형': BearMascot,
  '사회형':   CrocodileMascot,
  '계획형':   AlpacaMascot,
}

const mascotComponent = computed(
  () => MASCOT_MAP[currentUser.value?.spendingType] ?? null
)
</script>

<template>
  <component :is="mascotComponent" v-if="mascotComponent" />
</template>
