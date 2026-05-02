<script setup lang="ts">
const { $supabase } = useNuxtApp()
const router = useRouter()

const categories = ['全部', '热菜', '海鲜', '沙拉', '主食', '甜品']
const activeCategory = ref('全部')

// 获取当前用户
const user = ref<any>(null)

onMounted(async () => {
  if ($supabase) {
    const { data: { user: u } } = await $supabase.auth.getUser()
    user.value = u
    if (u) loadFavorites()
  }
})

// 从 Supabase 获取食谱
const { data: recipes } = await useAsyncData('all-recipes', async () => {
  if (!$supabase) return []
  const { data } = await $supabase
    .from('recipes')
    .select('*')
  return data || []
})

// 获取用户收藏
const favorites = ref<string[]>([])

async function loadFavorites() {
  if (!$supabase || !user.value) return
  const { data } = await $supabase
    .from('favorites')
    .select('recipe_id')
  favorites.value = (data || []).map(f => f.recipe_id)
}

// 根据分类过滤
const filteredRecipes = computed(() => {
  if (!recipes.value) return []
  if (activeCategory.value === '全部') return recipes.value
  return recipes.value.filter(r => r.category === activeCategory.value)
})

// 本周必尝（随机选一个）
const mustTry = computed(() => {
  if (!recipes.value || recipes.value.length === 0) {
    return { id: '', title: '加载中...', description: '', image_url: '' }
  }
  const randomIndex = Math.floor(Math.random() * recipes.value.length)
  return recipes.value[randomIndex]
})

// 检查是否已收藏
function isFavorited(recipeId: string) {
  return favorites.value.includes(recipeId)
}

// 获取填充样式
function getFillStyle(recipeId: string) {
  return isFavorited(recipeId) ? "font-variation-settings: 'FILL' 1" : ''
}

// 切换收藏状态
async function toggleFavorite(recipeId: string) {
  if (!$supabase || !user.value) {
    router.push('/login')
    return
  }

  if (isFavorited(recipeId)) {
    await $supabase
      .from('favorites')
      .delete()
      .match({ user_id: user.value.id, recipe_id: recipeId })
    favorites.value = favorites.value.filter(id => id !== recipeId)
  } else {
    await $supabase
      .from('favorites')
      .insert({ user_id: user.value.id, recipe_id: recipeId })
    favorites.value.push(recipeId)
  }
}

// 格式化推荐列表
const recommendations = computed(() => {
  if (!filteredRecipes.value) return []
  return filteredRecipes.value.map(r => ({
    id: r.id,
    name: r.title,
    author: '美食达人',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    likes: Math.floor(Math.random() * 2000 + 500).toLocaleString(),
    image: r.image_url,
    category: r.category
  }))
})
</script>

<template>
  <div>
    <!-- TopAppBar -->
    <header class="bg-[#FFFBFA] sticky top-0 z-40 shadow-[0_4px_20px_rgba(84,44,0,0.06)]">
      <div class="flex justify-between items-center w-full px-5 py-4 max-w-2xl mx-auto">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">location_on</span>
          <h1 class="text-xl font-extrabold text-primary tracking-tight font-[Plus_Jakarta_Sans]">发现灵感</h1>
        </div>
        <button @click="router.push('/search')" class="active:scale-95 transition-transform hover:opacity-80">
          <span class="material-symbols-outlined text-stone-900">search</span>
        </button>
      </div>
    </header>

    <main class="max-w-2xl mx-auto px-5 pt-4 pb-32">
      <!-- Category Chips -->
      <section class="mb-8 overflow-x-auto hide-scrollbar -mx-5 px-5">
        <div class="flex gap-3 whitespace-nowrap">
          <button v-for="cat in categories" :key="cat" @click="activeCategory = cat" class="px-5 py-2.5 rounded-full font-label-md shadow-sm active:scale-95 transition-transform" :class="cat === activeCategory ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-on-surface-variant'">
            {{ cat }}
          </button>
        </div>
      </section>

      <!-- Must-try this week -->
      <section class="mb-10">
        <div class="flex justify-between items-end mb-4">
          <h2 class="font-headline-md text-on-surface">本周必尝</h2>
          <button class="text-primary font-label-sm">查看全部</button>
        </div>
        <div class="relative group overflow-hidden rounded-[32px] shadow-[0_12px_40px_rgba(84,44,0,0.12)] cursor-pointer" @click="router.push(`/recipe/${mustTry.id}`)">
          <img :alt="mustTry.title" :src="mustTry.image_url" class="w-full h-64 object-cover" loading="lazy" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6">
            <span class="bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full w-fit mb-2">Editor's Pick</span>
            <h3 class="text-white font-headline-sm text-lg">{{ mustTry.title }}</h3>
            <p class="text-white/80 font-body-md text-sm mt-1">{{ mustTry.description }}</p>
          </div>
          <button
            @click.stop="toggleFavorite(mustTry.id)"
            class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            <span
              class="material-symbols-outlined text-xl"
              :class="isFavorited(mustTry.id) ? 'text-red-500' : 'text-on-surface-variant'"
              :style="getFillStyle(mustTry.id)"
            >favorite</span>
          </button>
        </div>
      </section>

      <!-- Masonry Feed -->
      <section class="mb-10">
        <h2 class="font-headline-md text-on-surface mb-4">为你推荐</h2>
        <div v-if="recommendations.length === 0" class="text-center py-12 text-on-surface-variant">
          暂无食谱数据
        </div>
        <div v-else class="columns-2 gap-4">
          <div v-for="(item, i) in recommendations" :key="item.id" class="group break-inside-avoid mb-4 cursor-pointer" @click="router.push(`/recipe/${item.id}`)">
            <div class="bg-white rounded-3xl overflow-hidden shadow-[0_4px_15px_rgba(84,44,0,0.06)] hover:shadow-[0_12px_30px_rgba(84,44,0,0.1)] transition-all">
              <div class="relative">
                <img :alt="item.name" :src="item.image" class="w-full object-cover" :class="i % 3 === 0 ? 'h-64' : 'h-48'" loading="lazy" />
                <button
                  @click.stop="toggleFavorite(item.id)"
                  class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-colors"
                >
                  <span
                    class="material-symbols-outlined text-sm"
                    :class="isFavorited(item.id) ? 'text-red-500' : 'text-on-surface-variant'"
                    :style="getFillStyle(item.id)"
                  >favorite</span>
                </button>
              </div>
              <div class="p-4">
                <h4 class="font-headline-sm text-sm text-on-surface line-clamp-2">{{ item.name }}</h4>
                <div class="flex justify-between items-center mt-3">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                      <img :alt="item.author" :src="item.authorAvatar" class="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <span class="text-[11px] font-label-sm text-stone-500">{{ item.author }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-[14px] text-primary">favorite</span>
                    <span class="text-[11px] font-label-md text-stone-400">{{ item.likes }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <BottomNav />
  </div>
</template>
