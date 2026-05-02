<script setup lang="ts">
const { $supabase } = useNuxtApp()

const today = new Date()
const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

// 生成一周日期
const weekDates = computed(() => {
  const dates = []
  for (let i = -3; i <= 3; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    dates.push({
      day: weekDays[d.getDay()],
      date: d.getDate(),
      isToday: i === 0,
      fullDate: d.toISOString().split('T')[0]
    })
  }
  return dates
})

const activeDate = ref(today.toISOString().split('T')[0])

// 从 Supabase 获取食谱
const { data: recipes } = await useAsyncData('plan-recipes', async () => {
  const { data } = await $supabase
    .from('recipes')
    .select('*')
  return data || []
})

// 今日营养（模拟数据）
const nutrition = {
  target: 1850,
  achieved: 65,
  protein: { current: 45, target: 60 },
  carbs: { current: 180, target: 250 },
  fat: { current: 52, target: 65 }
}

// 餐单（随机选 2 个食谱）
const meals = computed(() => {
  if (!recipes.value || recipes.value.length === 0) return []
  const shuffled = [...recipes.value].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, 2).map((r, i) => ({
    type: i === 0 ? '早餐' : '午餐',
    time: i === 0 ? '08:30 AM' : '12:30 PM',
    name: r.title,
    calories: r.calories,
    tag: r.difficulty,
    image: r.image_url
  }))
})

// 推荐食谱（随机选 2 个）
const suggestions = computed(() => {
  if (!recipes.value || recipes.value.length === 0) return []
  const shuffled = [...recipes.value].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, 2).map(r => ({
    name: r.title,
    category: r.category,
    image: r.image_url
  }))
})
</script>

<template>
  <div>
    <!-- TopAppBar -->
    <header class="bg-[#FFFBFA] shadow-[0_4px_20px_rgba(84,44,0,0.06)] sticky top-0 z-50">
      <div class="flex justify-between items-center w-full px-5 py-4 max-w-2xl mx-auto">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-primary">location_on</span>
          <h1 class="text-xl font-extrabold text-primary tracking-tight font-[Plus_Jakarta_Sans]">饮食计划</h1>
        </div>
        <button class="hover:opacity-80 transition-opacity">
          <span class="material-symbols-outlined text-stone-900">search</span>
        </button>
      </div>
    </header>

    <main class="max-w-2xl mx-auto px-5 pt-4 space-y-8 pb-28">
      <!-- Horizontal Week Calendar -->
      <section class="mt-4">
        <div class="flex justify-between items-center mb-2">
          <h2 class="font-headline-sm text-on-surface">{{ today.getFullYear() }}年{{ today.getMonth() + 1 }}月</h2>
          <span class="text-label-sm text-primary font-bold">今天</span>
        </div>
        <div class="flex gap-3 overflow-x-auto hide-scrollbar py-2">
          <div v-for="d in weekDates" :key="d.fullDate" @click="activeDate = d.fullDate" class="flex flex-col items-center min-w-[56px] py-4 rounded-3xl cursor-pointer" :class="d.isToday ? 'bg-primary-container text-on-primary-container shadow-[0_8px_20px_rgba(255,107,0,0.25)] border-2 border-primary' : 'bg-surface-container-high text-on-surface-variant opacity-60'">
            <span class="text-label-sm mb-1">{{ d.day }}</span>
            <span class="font-headline-sm">{{ d.date }}</span>
          </div>
        </div>
      </section>

      <!-- Daily Nutrition Summary -->
      <section class="bg-surface-container-lowest rounded-[32px] p-6 shadow-[0_8px_30px_rgba(84,44,0,0.06)] border border-orange-50">
        <div class="flex justify-between items-end mb-4">
          <div>
            <p class="text-label-sm text-outline mb-1">今日目标摄入</p>
            <h3 class="text-headline-md text-on-surface">{{ nutrition.target.toLocaleString() }} <span class="text-label-md font-normal text-outline">千卡</span></h3>
          </div>
          <div class="text-right">
            <p class="text-label-sm text-primary font-bold">已达成 {{ nutrition.achieved }}%</p>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div class="space-y-2">
            <div class="flex justify-between text-label-sm">
              <span class="text-on-surface-variant">蛋白质</span>
              <span class="font-bold">{{ nutrition.protein.current }}g</span>
            </div>
            <div class="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
              <div class="h-full bg-primary rounded-full" :style="{ width: (nutrition.protein.current / nutrition.protein.target * 100) + '%' }"></div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between text-label-sm">
              <span class="text-on-surface-variant">碳水</span>
              <span class="font-bold">{{ nutrition.carbs.current }}g</span>
            </div>
            <div class="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
              <div class="h-full bg-secondary-container rounded-full" :style="{ width: (nutrition.carbs.current / nutrition.carbs.target * 100) + '%' }"></div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between text-label-sm">
              <span class="text-on-surface-variant">脂肪</span>
              <span class="font-bold">{{ nutrition.fat.current }}g</span>
            </div>
            <div class="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
              <div class="h-full bg-tertiary-container rounded-full" :style="{ width: (nutrition.fat.current / nutrition.fat.target * 100) + '%' }"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Meal Timeline -->
      <section class="space-y-4">
        <h2 class="font-headline-sm text-on-surface px-1">今日餐单</h2>
        
        <div v-for="meal in meals" :key="meal.type" class="relative pl-8">
          <div class="absolute left-[11px] top-8 bottom-0 w-[2px] bg-orange-100"></div>
          <div class="absolute left-0 top-1 w-6 h-6 rounded-full bg-[#FFF4ED] flex items-center justify-center border-2 border-primary-container z-10">
            <div class="w-2 h-2 rounded-full bg-primary-container"></div>
          </div>
          <div class="flex justify-between items-center mb-2">
            <span class="text-label-md font-bold text-on-surface">{{ meal.type }}</span>
            <span class="text-label-sm text-outline">{{ meal.time }}</span>
          </div>
          <div class="bg-white rounded-3xl overflow-hidden shadow-[0_4px_15px_rgba(84,44,0,0.04)] border border-orange-50 flex p-3 gap-4">
            <img :alt="meal.name" :src="meal.image" class="w-20 h-20 rounded-2xl object-cover" />
            <div class="flex-1 flex flex-col justify-center">
              <h4 class="font-label-md text-on-surface">{{ meal.name }}</h4>
              <div class="flex items-center gap-3 mt-1">
                <span class="bg-secondary-fixed text-on-secondary-fixed-variant px-2 py-0.5 rounded-full text-[10px] font-bold">{{ meal.tag }}</span>
                <span class="text-label-sm text-outline">{{ meal.calories }} kcal</span>
              </div>
            </div>
            <button class="self-center p-2 text-outline hover:text-primary transition-colors">
              <span class="material-symbols-outlined">more_vert</span>
            </button>
          </div>
        </div>

        <!-- Dinner (Empty/Add) -->
        <div class="relative pl-8">
          <div class="absolute left-0 top-1 w-6 h-6 rounded-full bg-surface-container flex items-center justify-center border-2 border-outline-variant z-10"></div>
          <div class="flex justify-between items-center mb-2">
            <span class="text-label-md font-bold text-on-surface">晚餐</span>
            <span class="text-label-sm text-outline">07:00 PM</span>
          </div>
          <button class="w-full py-6 border-2 border-dashed border-outline-variant rounded-[32px] flex flex-col items-center justify-center gap-2 text-outline hover:bg-orange-50 hover:border-primary transition-all active:scale-[0.98]">
            <span class="material-symbols-outlined text-3xl">add_circle</span>
            <span class="text-label-md">添加晚餐计划</span>
          </button>
        </div>
      </section>

      <!-- Suggestions -->
      <section class="mt-8">
        <div class="flex justify-between items-center mb-4">
          <h2 class="font-headline-sm text-on-surface">为你推荐</h2>
          <button class="text-label-sm text-primary">换一批</button>
        </div>
        <div v-if="suggestions.length === 0" class="text-center py-12 text-on-surface-variant">
          暂无推荐
        </div>
        <div v-else class="grid grid-cols-2 gap-4">
          <div v-for="item in suggestions" :key="item.name" class="group relative aspect-[4/5] rounded-[32px] overflow-hidden shadow-md">
            <img :alt="item.name" :src="item.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div class="absolute bottom-4 left-4 right-4 text-white">
              <p class="text-label-sm opacity-80">{{ item.category }}</p>
              <h5 class="font-label-md leading-tight">{{ item.name }}</h5>
            </div>
          </div>
        </div>
      </section>
    </main>

    <BottomNav />
  </div>
</template>
