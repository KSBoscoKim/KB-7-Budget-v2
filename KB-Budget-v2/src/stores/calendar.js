import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useCalendarStore = defineStore('calendar', () => {
  const selectedDate = ref(new Date());

  function setSelectedDate(date) {
    selectedDate.value = new Date(date);
  }

  function setSelectedDateByYearMonth(year, month, day = 1) {
    selectedDate.value = new Date(year, month - 1, day);
  }

  return {
    selectedDate,
    setSelectedDate,
    setSelectedDateByYearMonth,
  };
});
