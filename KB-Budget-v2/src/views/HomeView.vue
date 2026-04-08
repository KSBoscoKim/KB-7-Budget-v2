<script setup>
import { ref } from 'vue';
import Calendar from '../components/Calendar.vue';
import Filter from '@/components/Filter.vue';
import FilterModal from '@/components/FilterModal.vue';
import Transaction from '@/components/Transaction.vue';
import AddTransactionFab from '@/components/AddTransactionFab.vue'

const filterModalOpen = ref(false);
const filterFocusSection = ref('date');

function openFilter(section) {
  filterFocusSection.value = section;
  filterModalOpen.value = true;
}
</script>

<template>
  <div class="home">
    <Filter
      @open-date="openFilter('date')"
      @open-category="openFilter('category')"
    />
    <Transaction />
    <FilterModal
      v-model="filterModalOpen"
      :focus-section="filterFocusSection"
    />
    <AddTransactionFab />
  </div>
</template>

<style scoped>
.home {
  /* app-main의 스크롤 영역을 자연스럽게 채움 */
  display: flex;
  flex-direction: column;
  padding: 1rem 0 1.25rem;
  background: var(--color-bg-page);
}
</style>
