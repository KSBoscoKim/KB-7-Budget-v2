<template>
  <div class="calendar">
    <!-- 월 네비게이션 -->
    <div class="calendar-header">
      <button @click="previousMonth" class="nav-btn">←</button>
      <h2 class="month-year">{{ monthYear }}</h2>
      <button @click="nextMonth" class="nav-btn">→</button>
    </div>

    <!-- 선택된 날짜 표시 -->
    <div class="selected-date-display">
      <button @click="goToToday" class="today-btn">
        오늘: {{ selectedDateKorean }}
      </button>
    </div>

    <!-- 요일 헤더 -->
    <div class="weekdays">
      <div
        class="weekday"
        v-for="day in ['일', '월', '화', '수', '목', '금', '토']"
        :key="day"
      >
        {{ day }}
      </div>
    </div>

    <!-- 달력 그리드 -->
    <div class="dates-grid">
      <button
        v-for="day in calendarDates"
        :key="`${day.year}-${day.month}-${day.date}`"
        @click="selectDate(day)"
        :class="{
          'date-cell': true,
          'other-month': !day.isCurrentMonth,
          today: day.isToday,
          selected: day.isSelected,
        }"
      >
        <div class="date-number">{{ day.date }}</div>
        <div class="date-content">
          <!-- 여기에 소비/지출이 들어올 자리 -->
          <template v-if="day.isCurrentMonth">
            <template
              v-for="tx in transactionStore.transactionsByDate[
                toDateKey(day)
              ] || []"
              :key="tx.id"
            >
              <div :class="['tx-row', tx.type]">
                <span class="dot"></span>
                <span class="tx-amount">
                  {{ tx.type === 'income' ? '+' : '-'
                  }}{{ tx.amount.toLocaleString() }}
                </span>
              </div>
            </template>
          </template>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCalendarStore } from '../stores/calendar';
import { useTransactionStore } from '@/stores/transaction';

const transactionStore = useTransactionStore();
const calendarStore = useCalendarStore();

const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth() + 1);

const monthYear = computed(() => {
  const date = new Date(currentYear.value, currentMonth.value - 1);
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });
});

const selectedDateKorean = computed(() => {
  const date = calendarStore.selectedDate;
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
  return (
    date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) + ` (${dayOfWeek})`
  );
});

const calendarDates = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;

  // 현재 월의 첫 날과 마지막 날
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  // 달력에 표시할 시작점 (지난 달의 일부)
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  // 달력에 표시할 끝점 (다음 달의 일부)
  const endDate = new Date(lastDay);
  const remainingDays = 42 - (endDate.getDate() + endDate.getDay());
  endDate.setDate(endDate.getDate() + remainingDays);

  const dates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selected = calendarStore.selectedDate;
  selected.setHours(0, 0, 0, 0);

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateValue = new Date(d);
    const isCurrentMonth =
      dateValue.getMonth() + 1 === month && dateValue.getFullYear() === year;
    const isToday = dateValue.getTime() === today.getTime();
    const isSelected = dateValue.getTime() === selected.getTime();

    dates.push({
      date: dateValue.getDate(),
      year: dateValue.getFullYear(),
      month: dateValue.getMonth() + 1,
      isCurrentMonth,
      isToday,
      isSelected,
      fullDate: new Date(dateValue),
    });
  }

  return dates;
});

function previousMonth() {
  if (currentMonth.value === 1) {
    currentYear.value--;
    currentMonth.value = 12;
  } else {
    currentMonth.value--;
  }
}

function nextMonth() {
  if (currentMonth.value === 12) {
    currentYear.value++;
    currentMonth.value = 1;
  } else {
    currentMonth.value++;
  }
}

function selectDate(day) {
  if (day.isCurrentMonth) {
    calendarStore.setSelectedDate(day.fullDate);
  }
}

function goToToday() {
  const today = new Date();
  currentYear.value = today.getFullYear();
  currentMonth.value = today.getMonth() + 1;
  calendarStore.setSelectedDate(today);
}

// day 객체를 'YYYY-MM-DD' 문자열로 변환 (transactionsByDate의 key 형식과 맞춤)
function toDateKey(day) {
  const mm = String(day.month).padStart(2, '0');
  const dd = String(day.date).padStart(2, '0');
  return `${day.year}-${mm}-${dd}`;
}
</script>

<style scoped>
.calendar {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 8px;
}

.month-year {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  flex: 1;
  text-align: center;
}

.nav-btn {
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s;
}

.nav-btn:hover {
  background: #f0f0f0;
}

.today-btn {
  padding: 8px 14px;
  border: 1px solid #2196f3;
  background: #e3f2fd;
  color: #2196f3;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
}

.today-btn:hover {
  background: #bbdefb;
  border-color: #1976d2;
}

.selected-date-display {
  text-align: center;
  padding: 12px;
  margin-bottom: 16px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.weekday {
  text-align: center;
  font-weight: 600;
  padding: 8px 0;
  font-size: 14px;
  color: #666;
}

.dates-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.date-cell {
  min-height: 120px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  padding: 8px;
  align-items: flex-start;
}

.date-number {
  font-weight: 600;
  margin-bottom: 4px;
}

.date-content {
  flex: 1;
  width: 100%;
  font-size: 12px;
  overflow: hidden;
}

.date-cell:hover:not(.other-month) {
  background: #f5f5f5;
  border-color: #999;
}

.date-cell.other-month {
  color: #ccc;
  background: #fafafa;
  cursor: not-allowed;
}

.date-cell.today {
  background: white;
  border: 2px solid #2196f3;
  color: #2196f3;
  font-weight: 600;
}

.date-cell.selected {
  background: #2196f3;
  color: white;
  border: 2px solid #2196f3;
  font-weight: 600;
}

.date-cell.selected.today {
  background: #2196f3;
  border: 2px solid #1565c0;
}

.tx-row {
  display: flex;
  align-items: center;
  gap: 3px;
  margin-bottom: 2px;
  overflow: hidden;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.tx-amount {
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 수입 - 파란색 */
.tx-row.income .dot {
  background: #2196f3;
}
.tx-row.income .tx-amount {
  color: #2196f3;
}

/* 지출 - 빨간색 */
.tx-row.expense .dot {
  background: #f44336;
}
.tx-row.expense .tx-amount {
  color: #f44336;
}

/* 선택된 날짜 칸에서는 글자색 흰색으로 덮어씀 */
.date-cell.selected .tx-amount {
  color: white;
}
.date-cell.selected .dot {
  background: rgba(255, 255, 255, 0.8);
}
</style>
