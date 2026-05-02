<script setup lang="ts">
const { $supabase } = useNuxtApp()
const router = useRouter()

// 从 Supabase 获取所有食谱
const { data: recipes } = await useAsyncData('recipes', async () => {
  if (!$supabase) return []
  const { data } = await $supabase
    .from('recipes')
    .select('*')
  return data || []
})

// 随机选择一个作为每日精选
const dailyPick = computed(() => {
  if (!recipes.value || recipes.value.length === 0) {
    return {
      title: '加载中...',
      description: '',
      image_url: '',
      cook_time: 0,
      calories: 0,
      difficulty: ''
    }
  }
  const randomIndex = Math.floor(Math.random() * recipes.value.length)
  const recipe = recipes.value[randomIndex]
  return {
    ...recipe,
    rating: (4.5 + Math.random() * 0.5).toFixed(1)
  }
})

// 格式化热门数据
const trends = computed(() => {
  if (!recipes.value) return []
  return recipes.value.slice(0, 4).map(r => ({
    id: r.id,
    name: r.title,
    image: r.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'
  }))
})

// "帮我挑" - 随机推荐
const showPicker = ref(false)
const pickedRecipe = ref<any>(null)
const isPicking = ref(false)

function handlePick() {
  if (!recipes.value || recipes.value.length === 0) return

  isPicking.value = true
  showPicker.value = true

  // 模拟随机滚动效果
  let count = 0
  const interval = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * recipes.value.length)
    pickedRecipe.value = recipes.value[randomIndex]
    count++

    if (count >= 10) {
      clearInterval(interval)
      isPicking.value = false
    }
  }, 100)
}

function closePicker() {
  showPicker.value = false
  pickedRecipe.value = null
}

function goToRecipe(id?: string) {
  const rid = id || pickedRecipe.value?.id
  if (rid) {
    router.push(`/recipe/${rid}`)
    if (!id) closePicker()
  }
}
</script>

<template>
  <div>
    <!-- TopAppBar -->
    <header class="bg-[#FFFBFA] shadow-[0_4px_20px_rgba(84,44,0,0.06)] sticky top-0 z-40">
      <div class="flex justify-between items-center w-full px-5 py-4 max-w-2xl mx-auto">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">location_on</span>
          <span class="font-[Plus_Jakarta_Sans] text-stone-900 font-semibold">上海</span>
        </div>
        <h1 class="text-xl font-extrabold text-primary tracking-tight">每天吃什么</h1>
        <button @click="router.push('/search')" class="hover:opacity-80 transition-opacity">
          <span class="material-symbols-outlined text-stone-900">search</span>
        </button>
      </div>
    </header>

    <main class="max-w-2xl mx-auto px-5 pt-6 space-y-8 pb-20">
      <!-- Hero Section -->
      <section class="relative overflow-hidden rounded-[32px] bg-primary-container p-8 text-on-primary-container">
        <div class="relative z-10 flex flex-col items-center text-center space-y-6">
          <div class="space-y-2">
            <h2 class="font-headline-lg text-white">今天吃什么？</h2>
            <p class="font-body-md text-white/90">纠结也是一种艺术，让我们帮你决定</p>
          </div>
          <div class="relative group">
            <div class="absolute -inset-4 bg-white/20 blur-xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <button
              @click="handlePick"
              class="relative flex flex-col items-center justify-center w-40 h-40 bg-white rounded-full shadow-[0_12px_40px_rgba(160,65,0,0.3)] active:scale-90 transition-transform"
            >
              <span class="material-symbols-outlined text-primary text-5xl mb-2">restaurant</span>
              <span class="text-primary font-bold text-lg">帮我挑</span>
            </button>
          </div>
          <div class="flex gap-4 pt-2">
            <span class="bg-white/20 px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">精选餐厅</span>
            <span class="bg-white/20 px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">快手食谱</span>
          </div>
        </div>
        <div class="absolute -top-10 -right-10 w-40 h-40 bg-secondary-container/30 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-on-primary-container/20 rounded-full blur-3xl"></div>
      </section>

      <!-- Trending Now -->
      <section class="space-y-4">
        <div class="flex justify-between items-end">
          <h3 class="font-headline-md text-on-surface">当下热门</h3>
          <button class="text-primary font-label-md hover:opacity-80">查看全部</button>
        </div>
        <div class="flex overflow-x-auto gap-4 hide-scrollbar -mx-5 px-5 py-2">
          <div v-for="item in trends" :key="item.id" class="flex-shrink-0 w-40 space-y-3 group cursor-pointer active:scale-95 transition-transform" @click="goToRecipe(item.id)">
            <div class="h-48 rounded-[24px] overflow-hidden shadow-[0_8px_20px_rgba(84,44,0,0.08)]">
              <img :alt="item.name" :src="item.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
            </div>
            <p class="font-label-md text-center text-on-surface-variant">{{ item.name }}</p>
          </div>
        </div>
      </section>

      <!-- Daily Special -->
      <section class="space-y-4">
        <h3 class="font-headline-md text-on-surface">每日精选</h3>
        <div class="relative rounded-[32px] overflow-hidden shadow-[0_12px_40px_rgba(84,44,0,0.12)] bg-white group cursor-pointer" @click="goToRecipe(dailyPick.id)">
          <div class="aspect-[16/10] overflow-hidden">
            <img :alt="dailyPick.title" :src="dailyPick.image_url" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
            <div class="absolute top-4 left-4 flex gap-2">
              <span class="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-sm shadow-sm">{{ dailyPick.difficulty }}</span>
              <span v-if="dailyPick.tags && dailyPick.tags[0]" class="bg-tertiary-container/90 text-on-tertiary-container px-3 py-1 rounded-full font-label-sm shadow-sm backdrop-blur-sm">{{ dailyPick.tags[0] }}</span>
            </div>
          </div>
          <div class="p-6 space-y-4">
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-headline-sm text-on-surface">{{ dailyPick.title }}</h4>
                <p class="text-on-surface-variant font-body-md mt-1">{{ dailyPick.description }}</p>
              </div>
              <div class="flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded-lg">
                <span class="material-symbols-outlined text-secondary-container text-sm" style="font-variation-settings: 'FILL' 1;">star</span>
                <span class="font-label-md text-on-surface">{{ dailyPick.rating }}</span>
              </div>
            </div>
            <div class="flex items-center gap-6 text-on-surface-variant">
              <div class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-sm">schedule</span>
                <span class="text-sm font-medium">{{ dailyPick.cook_time }} 分钟</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-sm">local_fire_department</span>
                <span class="text-sm font-medium">{{ dailyPick.calories }} 千卡</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <BottomNav />

    <!-- Picker Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showPicker" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm" @click.self="closePicker">
          <div class="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl">
            <div class="text-center">
              <h3 class="text-headline-md text-on-surface mb-2">
                {{ isPicking ? '正在挑选...' : '今天吃这个！' }}
              </h3>

              <div v-if="pickedRecipe" class="mt-6">
                <div class="w-full aspect-video rounded-2xl overflow-hidden mb-4">
                  <img :src="pickedRecipe.image_url" :alt="pickedRecipe.title" class="w-full h-full object-cover" />
                </div>
                <h4 class="text-headline-sm text-on-surface">{{ pickedRecipe.title }}</h4>
                <p class="text-body-md text-on-surface-variant mt-2">{{ pickedRecipe.description }}</p>
                <div class="flex justify-center gap-4 mt-4 text-label-sm text-on-surface-variant">
                  <span>{{ pickedRecipe.cook_time }} 分钟</span>
                  <span>{{ pickedRecipe.calories }} 千卡</span>
                </div>
              </div>

              <div class="flex gap-3 mt-8">
                <button
                  @click="handlePick"
                  :disabled="isPicking"
                  class="flex-1 py-3 rounded-full border-2 border-primary text-primary font-label-lg font-bold hover:bg-primary/5 transition-colors disabled:opacity-50"
                >
                  再抽一次
                </button>
                <button
                  @click="goToRecipe()"
                  :disabled="!pickedRecipe || isPicking"
                  class="flex-1 py-3 rounded-full bg-primary text-white font-label-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  就这个了
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
