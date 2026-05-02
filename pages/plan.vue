<script setup lang="ts">
const { $supabase } = useNuxtApp()
const router = useRouter()

const user = ref<any>(null)
const loading = ref(true)

// 当前选中日期
const today = new Date()
const weekStart = new Date(today)
weekStart.setDate(today.getDate() - today.getDay() + 1) // 周一
const selectedDate = ref(formatDate(today))

const mealPlans = ref<any[]>([])
const recipes = ref<any[]>([])
const showAddMeal = ref(false)
const addMealType = ref('午餐')
const adding = ref(false)

function formatDate(d: Date) {
  return d.toISOString().split('T')[0]
}

const weekDays = computed(() => {
  const days = []
  const dayNames = ['一', '二', '三', '四', '五', '六', '日']
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    days.push({
      date: formatDate(d),
      day: dayNames[i],
      dayNum: d.getDate(),
      isToday: formatDate(d) === formatDate(today),
      isSelected: formatDate(d) === selectedDate.value
    })
  }
  return days
})

// 按餐类型分组
const mealsByType = computed(() => {
  const types = ['早餐', '午餐', '晚餐', '加餐']
  return types.map(type => ({
    type,
    icon: type === '早餐' ? 'wb_sunny' : type === '午餐' ? 'light_mode' : type === '晚餐' ? 'dark_mode' : 'bakery_dining',
    items: mealPlans.value.filter(m => m.meal_type === type),
    color: type === '早餐' ? 'bg-amber-50 text-amber-600' : type === '午餐' ? 'bg-orange-50 text-orange-600' : type === '晚餐' ? 'bg-indigo-50 text-indigo-600' : 'bg-pink-50 text-pink-600'
  }))
})

// 营养摘要（从食谱数据计算）
const nutritionSummary = computed(() => {
  const totalCal = mealPlans.value.reduce((sum, m) => sum + (m.recipes?.calories || 0), 0)
  const totalProtein = mealPlans.value.reduce((sum, m) => sum + (m.recipes?.protein || 0), 0)
  const totalCarbs = mealPlans.value.reduce((sum, m) => sum + (m.recipes?.carbs || 0), 0)
  const totalFat = mealPlans.value.reduce((sum, m) => sum + (m.recipes?.fat || 0), 0)

  return { totalCal, totalProtein, totalCarbs, totalFat }
})

onMounted(async () => {
  if ($supabase) {
    const { data: { user: u } } = await $supabase.auth.getUser()
    user.value = u

    // 加载食谱列表
    const { data: r } = await $supabase.from('recipes').select('*')
    recipes.value = r || []
  }
  loading.value = false
})

// 监听日期变化，加载当日计划
watch(selectedDate, async () => {
  await loadMealPlans()
}, { immediate: true })

async function loadMealPlans() {
  if (!$supabase || !user.value) return
  const { data } = await $supabase
    .from('meal_plans')
    .select('*, recipes(*)')
    .eq('user_id', user.value.id)
    .eq('plan_date', selectedDate.value)
    .order('meal_type')
  mealPlans.value = data || []
}

function openAddMeal(type: string) {
  addMealType.value = type
  showAddMeal.value = true
}

async function addMealToPlan(recipeId: string) {
  if (!$supabase || !user.value) return
  adding.value = true
  await $supabase
    .from('meal_plans')
    .insert({
      user_id: user.value.id,
      recipe_id: recipeId,
      meal_type: addMealType.value,
      plan_date: selectedDate.value
    })
  showAddMeal.value = false
  await loadMealPlans()
  adding.value = false
}

async function removeMeal(planId: string) {
  if (!$supabase) return
  await $supabase.from('meal_plans').delete().eq('id', planId)
  await loadMealPlans()
}

// 推荐食谱
const suggestedRecipes = computed(() => {
  const plannedIds = mealPlans.value.map(m => m.recipe_id)
  return recipes.value.filter(r => !plannedIds.includes(r.id)).slice(0, 4)
})
</script>

<template>
  <div>
    <header class="bg-[#FFFBFA] sticky top-0 z-40 shadow-[0_4px_20px_rgba(84,44,0,0.06)]">
      <div class="flex justify-between items-center w-full px-5 py-4 max-w-2xl mx-auto">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">calendar_month</span>
          <h1 class="text-xl font-extrabold text-primary tracking-tight font-[Plus_Jakarta_Sans]">饮食计划</h1>
        </div>
      </div>
    </header>

    <main class="max-w-2xl mx-auto px-5 pt-4 pb-32 space-y-6">
      <!-- Week Calendar -->
      <section class="flex gap-2 overflow-x-auto hide-scrollbar -mx-5 px-5">
        <button
          v-for="day in weekDays"
          :key="day.date"
          @click="selectedDate = day.date"
          class="flex flex-col items-center min-w-[52px] py-3 px-2 rounded-2xl transition-all active:scale-95"
          :class="day.isSelected ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-surface-container-high text-on-surface-variant'"
        >
          <span class="text-[10px] font-bold">{{ day.day }}</span>
          <span class="text-lg font-extrabold mt-0.5">{{ day.dayNum }}</span>
          <span v-if="day.isToday" class="w-1.5 h-1.5 rounded-full mt-1" :class="day.isSelected ? 'bg-white' : 'bg-primary'"></span>
        </button>
      </section>

      <!-- Nutrition Summary -->
      <section v-if="mealPlans.length > 0" class="bg-white rounded-3xl p-5 shadow-[0_4px_15px_rgba(84,44,0,0.06)]">
        <h3 class="text-label-lg font-bold text-on-surface mb-4">营养摘要</h3>
        <div class="grid grid-cols-4 gap-3">
          <div class="text-center">
            <div class="text-headline-sm font-extrabold text-primary">{{ nutritionSummary.totalCal }}</div>
            <div class="text-[10px] text-on-surface-variant mt-1">千卡</div>
          </div>
          <div class="text-center">
            <div class="text-headline-sm font-extrabold text-amber-600">{{ nutritionSummary.totalProtein }}g</div>
            <div class="text-[10px] text-on-surface-variant mt-1">蛋白质</div>
          </div>
          <div class="text-center">
            <div class="text-headline-sm font-extrabold text-orange-500">{{ nutritionSummary.totalCarbs }}g</div>
            <div class="text-[10px] text-on-surface-variant mt-1">碳水</div>
          </div>
          <div class="text-center">
            <div class="text-headline-sm font-extrabold text-rose-500">{{ nutritionSummary.totalFat }}g</div>
            <div class="text-[10px] text-on-surface-variant mt-1">脂肪</div>
          </div>
        </div>
        <!-- Calorie progress -->
        <div class="mt-4">
          <div class="flex justify-between text-[10px] text-on-surface-variant mb-1">
            <span>热量摄入</span>
            <span>{{ nutritionSummary.totalCal }} / 2000 千卡</span>
          </div>
          <div class="h-2 bg-surface-container-high rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-primary to-orange-400 rounded-full transition-all" :style="{ width: Math.min(nutritionSummary.totalCal / 2000 * 100, 100) + '%' }"></div>
          </div>
        </div>
      </section>

      <!-- Not logged in -->
      <div v-if="!user && !loading" class="text-center py-12">
        <span class="material-symbols-outlined text-6xl text-on-surface-variant mb-4">lock</span>
        <p class="text-on-surface-variant mb-4">登录后可使用饮食计划功能</p>
        <button @click="router.push('/login')" class="px-6 py-3 rounded-full bg-primary text-white font-bold">去登录</button>
      </div>

      <!-- Meal Timeline -->
      <template v-if="user">
        <section v-for="meal in mealsByType" :key="meal.type" class="space-y-3">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-lg" :class="meal.color.split(' ')[1]">{{ meal.icon }}</span>
              <h3 class="font-label-lg font-bold text-on-surface">{{ meal.type }}</h3>
              <span class="text-[10px] text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-full">{{ meal.items.length }}</span>
            </div>
            <button @click="openAddMeal(meal.type)" class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center active:scale-90 transition-transform">
              <span class="material-symbols-outlined text-primary text-lg">add</span>
            </button>
          </div>

          <!-- Empty state -->
          <div v-if="meal.items.length === 0" class="bg-surface-container-lowest rounded-2xl p-4 text-center border-2 border-dashed border-surface-container-high">
            <p class="text-on-surface-variant text-sm">还没有安排，点击 + 添加</p>
          </div>

          <!-- Meal items -->
          <div v-for="item in meal.items" :key="item.id" class="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <img :src="item.recipes?.image_url" :alt="item.recipes?.title" class="w-14 h-14 rounded-xl object-cover" loading="lazy" />
            <div class="flex-1 min-w-0">
              <h4 class="font-label-md font-bold text-on-surface truncate">{{ item.recipes?.title }}</h4>
              <p class="text-[11px] text-on-surface-variant mt-0.5">{{ item.recipes?.calories || 0 }} 千卡</p>
            </div>
            <button @click="removeMeal(item.id)" class="p-2 rounded-full hover:bg-red-50 transition-colors">
              <span class="material-symbols-outlined text-red-400 text-lg">close</span>
            </button>
          </div>
        </section>
      </template>

      <!-- Suggested -->
      <section v-if="user && suggestedRecipes.length > 0" class="space-y-3">
        <h3 class="font-label-lg font-bold text-on-surface-variant">推荐添加</h3>
        <div class="grid grid-cols-2 gap-3">
          <button
            v-for="recipe in suggestedRecipes"
            :key="recipe.id"
            @click="addMealType = '午餐'; addMealToPlan(recipe.id)"
            class="bg-white rounded-2xl overflow-hidden shadow-sm text-left hover:shadow-md transition-all active:scale-[0.98]"
          >
            <img :src="recipe.image_url" :alt="recipe.title" class="w-full h-24 object-cover" loading="lazy" />
            <div class="p-3">
              <h4 class="text-xs font-bold text-on-surface truncate">{{ recipe.title }}</h4>
              <p class="text-[10px] text-on-surface-variant mt-0.5">{{ recipe.category }}</p>
            </div>
          </button>
        </div>
      </section>
    </main>

    <!-- Add Meal Modal -->
    <Teleport to="body">
      <div v-if="showAddMeal" class="fixed inset-0 z-50 flex items-end justify-center">
        <div class="absolute inset-0 bg-black/40" @click="showAddMeal = false"></div>
        <div class="relative w-full max-w-2xl bg-white rounded-t-[32px] p-6 pb-10 max-h-[70vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-headline-md font-bold text-on-surface">添加{{ addMealType }}</h3>
            <button @click="showAddMeal = false" class="p-2 rounded-full hover:bg-surface-container-high">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <!-- Meal type selector -->
          <div class="flex gap-2 mb-4 overflow-x-auto">
            <button
              v-for="type in ['早餐', '午餐', '晚餐', '加餐']"
              :key="type"
              @click="addMealType = type"
              class="px-4 py-2 rounded-full text-sm font-bold transition-all"
              :class="addMealType === type ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant'"
            >{{ type }}</button>
          </div>
          <!-- Recipe list -->
          <div class="space-y-3">
            <button
              v-for="recipe in recipes"
              :key="recipe.id"
              @click="addMealToPlan(recipe.id)"
              :disabled="adding"
              class="w-full flex items-center gap-3 p-3 rounded-2xl bg-surface-container-lowest hover:bg-surface-container-low transition-colors text-left active:scale-[0.99]"
            >
              <img :src="recipe.image_url" :alt="recipe.title" class="w-12 h-12 rounded-xl object-cover" loading="lazy" />
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-bold text-on-surface truncate">{{ recipe.title }}</h4>
                <p class="text-[11px] text-on-surface-variant">{{ recipe.category }} · {{ recipe.calories || 0 }}千卡</p>
              </div>
              <span class="material-symbols-outlined text-primary">add_circle</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <BottomNav />
  </div>
</template>
