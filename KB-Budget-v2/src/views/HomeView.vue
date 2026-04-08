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
    <RouterLink
      :to="{ name: 'add-transaction' }"
      class="fab-link"
      aria-label="지출/수익 추가"
    >
    </RouterLink>
    <AddTransactionFab />
  </div>
</template>

<style scoped>
.home {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1.25rem 1rem;
}
</style>
