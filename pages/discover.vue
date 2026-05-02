<script setup lang="ts">
const { $supabase } = useNuxtApp()

const categories = ['全部', '热菜', '海鲜', '沙拉', '主食', '甜品']
const activeCategory = ref('全部')

// 从 Supabase 获取食谱
const { data: recipes } = await useAsyncData('all-recipes', async () => {
  const { data } = await $supabase
    .from('recipes')
    .select('*')
  return data || []
})

// 根据分类过滤
const filteredRecipes = computed(() => {
  if (!recipes.value) return []
  if (activeCategory.value === '全部') return recipes.value
  return recipes.value.filter(r => r.category === activeCategory.value)
})

// 本周必尝（随机选一个）
const mustTry = computed(() => {
  if (!recipes.value || recipes.value.length === 0) {
    return { title: '加载中...', description: '', image_url: '' }
  }
  const randomIndex = Math.floor(Math.random() * recipes.value.length)
  return recipes.value[randomIndex]
})

// 格式化推荐列表
const recommendations = computed(() => {
  if (!filteredRecipes.value) return []
  return filteredRecipes.value.map(r => ({
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
        <button class="active:scale-95 transition-transform hover:opacity-80">
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
        <div class="relative group overflow-hidden rounded-[32px] shadow-[0_12px_40px_rgba(84,44,0,0.12)]">
          <img :alt="mustTry.title" :src="mustTry.image_url" class="w-full h-64 object-cover" loading="lazy" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6">
            <span class="bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full w-fit mb-2">Editor's Pick</span>
            <h3 class="text-white font-headline-sm text-lg">{{ mustTry.title }}</h3>
            <p class="text-white/80 font-body-md text-sm mt-1">{{ mustTry.description }}</p>
          </div>
        </div>
      </section>

      <!-- Masonry Feed -->
      <section class="mb-10">
        <h2 class="font-headline-md text-on-surface mb-4">为你推荐</h2>
        <div v-if="recommendations.length === 0" class="text-center py-12 text-on-surface-variant">
          暂无食谱数据
        </div>
        <div v-else class="columns-2 gap-4">
          <div v-for="(item, i) in recommendations" :key="item.name + i" class="group break-inside-avoid mb-4">
            <div class="bg-white rounded-3xl overflow-hidden shadow-[0_4px_15px_rgba(84,44,0,0.06)] hover:shadow-[0_12px_30px_rgba(84,44,0,0.1)] transition-all">
              <img :alt="item.name" :src="item.image" class="w-full object-cover" :class="i % 3 === 0 ? 'h-64' : 'h-48'" loading="lazy" />
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
