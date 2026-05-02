<script setup lang="ts">
const { $supabase } = useNuxtApp()
const route = useRoute()
const router = useRouter()

const recipeId = route.params.id as string
const recipe = ref<any>(null)
const loading = ref(true)
const user = ref<any>(null)
const isFavorited = ref(false)
const showAddToPlan = ref(false)
const addMealType = ref('午餐')

onMounted(async () => {
  if ($supabase) {
    const { data: { user: u } } = await $supabase.auth.getUser()
    user.value = u

    const { data } = await $supabase
      .from('recipes')
      .select('*')
      .eq('id', recipeId)
      .single()
    recipe.value = data

    if (u && data) {
      const { data: fav } = await $supabase
        .from('favorites')
        .select('id')
        .eq('user_id', u.id)
        .eq('recipe_id', recipeId)
        .maybeSingle()
      isFavorited.value = !!fav
    }
  }
  loading.value = false
})

function getFillStyle() {
  return isFavorited.value ? "font-variation-settings: 'FILL' 1" : ''
}

async function toggleFavorite() {
  if (!$supabase || !user.value) {
    router.push('/login')
    return
  }

  if (isFavorited.value) {
    await $supabase
      .from('favorites')
      .delete()
      .match({ user_id: user.value.id, recipe_id: recipeId })
    isFavorited.value = false
  } else {
    await $supabase
      .from('favorites')
      .insert({ user_id: user.value.id, recipe_id: recipeId })
    isFavorited.value = true
  }
}

async function addToPlan() {
  if (!$supabase || !user.value) {
    router.push('/login')
    return
  }

  const today = new Date().toISOString().split('T')[0]
  await $supabase
    .from('meal_plans')
    .insert({
      user_id: user.value.id,
      recipe_id: recipeId,
      meal_type: addMealType.value,
      plan_date: today
    })
  showAddToPlan.value = false
  // toast feedback
  alert(`已添加到今日${addMealType.value}`)
}
</script>

<template>
  <div class="min-h-screen bg-[#FFFBFA]">
    <!-- Loading -->
    <div v-if="loading" class="text-center py-20">
      <div class="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>

    <template v-else-if="recipe">
      <!-- Hero Image -->
      <div class="relative">
        <img :src="recipe.image_url" :alt="recipe.title" class="w-full h-72 object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"></div>
        <!-- Back button -->
        <button @click="router.back()" class="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg active:scale-90 transition-transform">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <!-- Favorite button -->
        <button @click="toggleFavorite" class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg active:scale-90 transition-transform">
          <span
            class="material-symbols-outlined"
            :class="isFavorited ? 'text-red-500' : 'text-stone-600'"
            :style="getFillStyle()"
          >favorite</span>
        </button>
      </div>

      <!-- Content -->
      <div class="max-w-2xl mx-auto px-5 -mt-8 relative z-10 pb-8">
        <!-- Title Card -->
        <div class="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(84,44,0,0.08)]">
          <div class="flex items-start justify-between gap-3">
            <h1 class="text-headline-lg font-extrabold text-on-surface">{{ recipe.title }}</h1>
            <span class="shrink-0 bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              {{ recipe.category }}
            </span>
          </div>
          <p class="text-body-md text-on-surface-variant mt-3 leading-relaxed">{{ recipe.description }}</p>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-4 mt-6">
            <div class="text-center bg-surface-container-lowest rounded-2xl py-3">
              <span class="material-symbols-outlined text-primary text-xl">schedule</span>
              <p class="text-headline-sm font-bold text-on-surface mt-1">{{ recipe.cook_time }}</p>
              <p class="text-[10px] text-on-surface-variant">分钟</p>
            </div>
            <div class="text-center bg-surface-container-lowest rounded-2xl py-3">
              <span class="material-symbols-outlined text-orange-500 text-xl">local_fire_department</span>
              <p class="text-headline-sm font-bold text-on-surface mt-1">{{ recipe.calories }}</p>
              <p class="text-[10px] text-on-surface-variant">千卡</p>
            </div>
            <div class="text-center bg-surface-container-lowest rounded-2xl py-3">
              <span class="material-symbols-outlined text-amber-500 text-xl">signal_cellular_alt</span>
              <p class="text-headline-sm font-bold text-on-surface mt-1">{{ recipe.difficulty }}</p>
              <p class="text-[10px] text-on-surface-variant">难度</p>
            </div>
          </div>
        </div>

        <!-- Nutrition -->
        <div v-if="recipe.protein || recipe.carbs || recipe.fat" class="bg-white rounded-3xl p-6 shadow-sm mt-4">
          <h2 class="font-label-lg font-bold text-on-surface mb-4">营养成分</h2>
          <div class="space-y-3">
            <div v-if="recipe.protein">
              <div class="flex justify-between text-sm mb-1">
                <span class="text-on-surface-variant">蛋白质</span>
                <span class="font-bold text-amber-600">{{ recipe.protein }}g</span>
              </div>
              <div class="h-2 bg-surface-container-high rounded-full overflow-hidden">
                <div class="h-full bg-amber-400 rounded-full" :style="{ width: Math.min(recipe.protein / 60 * 100, 100) + '%' }"></div>
              </div>
            </div>
            <div v-if="recipe.carbs">
              <div class="flex justify-between text-sm mb-1">
                <span class="text-on-surface-variant">碳水化合物</span>
                <span class="font-bold text-orange-500">{{ recipe.carbs }}g</span>
              </div>
              <div class="h-2 bg-surface-container-high rounded-full overflow-hidden">
                <div class="h-full bg-orange-400 rounded-full" :style="{ width: Math.min(recipe.carbs / 300 * 100, 100) + '%' }"></div>
              </div>
            </div>
            <div v-if="recipe.fat">
              <div class="flex justify-between text-sm mb-1">
                <span class="text-on-surface-variant">脂肪</span>
                <span class="font-bold text-rose-500">{{ recipe.fat }}g</span>
              </div>
              <div class="h-2 bg-surface-container-high rounded-full overflow-hidden">
                <div class="h-full bg-rose-400 rounded-full" :style="{ width: Math.min(recipe.fat / 65 * 100, 100) + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Ingredients -->
        <div v-if="recipe.ingredients" class="bg-white rounded-3xl p-6 shadow-sm mt-4">
          <h2 class="font-label-lg font-bold text-on-surface mb-4">食材清单</h2>
          <div class="text-body-md text-on-surface-variant whitespace-pre-line leading-relaxed">{{ recipe.ingredients }}</div>
        </div>

        <!-- Steps -->
        <div v-if="recipe.steps" class="bg-white rounded-3xl p-6 shadow-sm mt-4">
          <h2 class="font-label-lg font-bold text-on-surface mb-4">做法步骤</h2>
          <div class="text-body-md text-on-surface-variant whitespace-pre-line leading-relaxed">{{ recipe.steps }}</div>
        </div>

        <!-- Add to Plan Button -->
        <button
          @click="showAddToPlan = true"
          class="w-full mt-6 py-4 rounded-full bg-primary text-white font-label-lg font-bold shadow-lg shadow-primary/30 hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span class="material-symbols-outlined">add_circle</span>
          添加到饮食计划
        </button>
      </div>
    </template>

    <!-- Not Found -->
    <div v-else class="text-center py-20">
      <span class="material-symbols-outlined text-6xl text-on-surface-variant">restaurant</span>
      <p class="text-on-surface-variant mt-4">食谱不存在</p>
      <button @click="router.push('/')" class="mt-4 px-6 py-3 rounded-full bg-primary text-white font-bold">返回首页</button>
    </div>

    <!-- Add to Plan Modal -->
    <Teleport to="body">
      <div v-if="showAddToPlan" class="fixed inset-0 z-50 flex items-center justify-center px-5">
        <div class="absolute inset-0 bg-black/40" @click="showAddToPlan = false"></div>
        <div class="relative bg-white rounded-3xl p-6 w-full max-w-sm">
          <h3 class="font-headline-md font-bold text-on-surface mb-4">添加到饮食计划</h3>
          <div class="flex gap-2 mb-4 flex-wrap">
            <button
              v-for="type in ['早餐', '午餐', '晚餐', '加餐']"
              :key="type"
              @click="addMealType = type"
              class="px-5 py-2.5 rounded-full text-sm font-bold transition-all"
              :class="addMealType === type ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant'"
            >{{ type }}</button>
          </div>
          <div class="flex gap-3">
            <button @click="showAddToPlan = false" class="flex-1 py-3 rounded-full bg-surface-container-high text-on-surface-variant font-bold">取消</button>
            <button @click="addToPlan" class="flex-1 py-3 rounded-full bg-primary text-white font-bold">确认</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
