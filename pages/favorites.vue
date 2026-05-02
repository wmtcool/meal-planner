<script setup lang="ts">
const { $supabase } = useNuxtApp()
const router = useRouter()

const user = ref<any>(null)
const favorites = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  if (!$supabase) return

  const { data: { user: u } } = await $supabase.auth.getUser()
  user.value = u

  if (u) {
    const { data } = await $supabase
      .from('favorites')
      .select(`
        id,
        recipe_id,
        created_at,
        recipes (
          id,
          title,
          description,
          image_url,
          cook_time,
          calories,
          category,
          difficulty
        )
      `)
      .order('created_at', { ascending: false })

    favorites.value = (data || []).map(f => ({
      ...f.recipes,
      favorite_id: f.id,
      created_at: f.created_at
    }))
  }

  loading.value = false
})

// 取消收藏
async function removeFavorite(recipeId: string) {
  if (!$supabase || !user.value) return

  await $supabase
    .from('favorites')
    .delete()
    .match({ user_id: user.value.id, recipe_id: recipeId })

  favorites.value = favorites.value.filter(f => f.id !== recipeId)
}

// 跳转详情
function goToRecipe(recipe: any) {
  router.push(`/?recipe=${recipe.id}`)
}
</script>

<template>
  <div>
    <!-- Header -->
    <header class="bg-[#FFFBFA] shadow-[0_4px_20px_rgba(84,44,0,0.06)] sticky top-0 z-40">
      <div class="flex justify-between items-center w-full px-5 py-4 max-w-2xl mx-auto">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-primary">favorite</span>
          <h1 class="text-xl font-extrabold text-primary tracking-tight font-[Plus_Jakarta_Sans]">我的收藏</h1>
        </div>
      </div>
    </header>

    <main class="max-w-2xl mx-auto px-5 pt-4 pb-28">
      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Not Logged In -->
      <div v-else-if="!user" class="text-center py-16">
        <div class="w-20 h-20 rounded-full bg-surface-container-high mx-auto mb-6 flex items-center justify-center">
          <span class="material-symbols-outlined text-4xl text-on-surface-variant">person_outline</span>
        </div>
        <h2 class="text-headline-md text-on-surface mb-2">未登录</h2>
        <p class="text-body-md text-on-surface-variant mb-6">登录后可查看收藏</p>
        <button @click="router.push('/login')" class="px-8 py-4 rounded-full bg-primary text-white font-label-lg font-bold shadow-lg hover:opacity-90 transition-all active:scale-[0.98]">
          立即登录
        </button>
      </div>

      <!-- Empty -->
      <div v-else-if="favorites.length === 0" class="text-center py-16">
        <div class="w-20 h-20 rounded-full bg-surface-container-high mx-auto mb-6 flex items-center justify-center">
          <span class="material-symbols-outlined text-4xl text-on-surface-variant">favorite_border</span>
        </div>
        <h2 class="text-headline-md text-on-surface mb-2">暂无收藏</h2>
        <p class="text-body-md text-on-surface-variant mb-6">去发现页收藏喜欢的食谱吧</p>
        <button @click="router.push('/discover')" class="px-8 py-4 rounded-full bg-primary text-white font-label-lg font-bold shadow-lg hover:opacity-90 transition-all active:scale-[0.98]">
          去发现
        </button>
      </div>

      <!-- Favorites List -->
      <div v-else class="space-y-4">
        <p class="text-label-md text-on-surface-variant">{{ favorites.length }} 个收藏</p>
        <div class="grid gap-4">
          <div
            v-for="recipe in favorites"
            :key="recipe.id"
            class="flex gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer active:scale-[0.98]"
            @click="goToRecipe(recipe)"
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
            <button
              @click.stop="removeFavorite(recipe.id)"
              class="self-center p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
            >
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      </div>
    </main>

    <BottomNav />
  </div>
</template>
