<script setup lang="ts">
const { $supabase } = useNuxtApp()
const router = useRouter()

const searchQuery = ref('')
const isSearching = ref(false)
const results = ref<any[]>([])

// 搜索食谱
async function handleSearch() {
  if (!searchQuery.value.trim()) return

  isSearching.value = true
  const { data } = await $supabase
    .from('recipes')
    .select('*')
    .or(`title.ilike.%${searchQuery.value}%,description.ilike.%${searchQuery.value}%,category.ilike.%${searchQuery.value}%`)

  results.value = data || []
  isSearching.value = false
}

// 点击食谱跳转详情（暂时跳首页）
function goToRecipe(recipe: any) {
  router.push(`/?recipe=${recipe.id}`)
}
</script>

<template>
  <div class="min-h-screen bg-[#FFFBFA]">
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-[#FFFBFA] shadow-[0_4px_20px_rgba(84,44,0,0.06)]">
      <div class="max-w-2xl mx-auto px-5 py-4">
        <div class="flex items-center gap-3">
          <button @click="router.back()" class="p-2 -ml-2 hover:bg-surface-container-high rounded-full transition-colors">
            <span class="material-symbols-outlined text-on-surface-variant">arrow_back</span>
          </button>
          <div class="flex-1 relative">
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text"
              placeholder="搜索食谱、食材、菜系..."
              class="w-full h-12 px-5 pr-12 rounded-full bg-surface-container-high text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/30"
              autofocus
            />
            <button
              @click="handleSearch"
              class="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center"
            >
              <span class="material-symbols-outlined text-white text-lg">search</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-2xl mx-auto px-5 py-6 pb-20">
      <!-- Loading -->
      <div v-if="isSearching" class="text-center py-12">
        <div class="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Results -->
      <div v-else-if="results.length > 0" class="space-y-4">
        <p class="text-label-md text-on-surface-variant">找到 {{ results.length }} 个结果</p>
        <div class="grid gap-4">
          <div
            v-for="recipe in results"
            :key="recipe.id"
            @click="goToRecipe(recipe)"
            class="flex gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer active:scale-[0.98]"
          >
            <img :src="recipe.image_url" :alt="recipe.title" class="w-24 h-24 rounded-xl object-cover" loading="lazy" />
            <div class="flex-1 flex flex-col justify-center">
              <h4 class="font-label-md text-on-surface">{{ recipe.title }}</h4>
              <p class="text-label-sm text-on-surface-variant mt-1 line-clamp-2">{{ recipe.description }}</p>
              <div class="flex items-center gap-3 mt-2">
                <span class="bg-surface-container-high px-2 py-0.5 rounded text-[10px] text-on-surface-variant">{{ recipe.category }}</span>
                <span class="text-label-sm text-on-surface-variant">{{ recipe.cook_time }} 分钟</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="searchQuery && !isSearching" class="text-center py-16">
        <span class="material-symbols-outlined text-6xl text-on-surface-variant opacity-40">search_off</span>
        <p class="text-body-md text-on-surface-variant mt-4">没有找到相关内容</p>
      </div>

      <!-- Initial State -->
      <div v-else class="text-center py-16">
        <span class="material-symbols-outlined text-6xl text-on-surface-variant opacity-40">restaurant</span>
        <p class="text-body-md text-on-surface-variant mt-4">搜索你喜欢的美食</p>
      </div>
    </main>
  </div>
</template>
