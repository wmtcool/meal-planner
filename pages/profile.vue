<script setup lang="ts">
const { $supabase } = useNuxtApp()
const router = useRouter()

// 获取当前用户
const user = ref<any>(null)
const loading = ref(true)
const favoritesCount = ref(0)
const historyCount = ref(0)
const planCount = ref(0)

onMounted(async () => {
  if (!$supabase) return

  const { data: { user: u } } = await $supabase.auth.getUser()
  user.value = u

  if (u) {
    const { count: favCount } = await $supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', u.id)
    favoritesCount.value = favCount || 0

    const { count: pCount } = await $supabase
      .from('meal_plans')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', u.id)
    planCount.value = pCount || 0

    // 浏览记录：统计用户收藏过的不同食谱数 + 计划中不同食谱数，作为近似
    const [favRes, planRes] = await Promise.all([
      $supabase.from('favorites').select('recipe_id').eq('user_id', u.id),
      $supabase.from('meal_plans').select('recipe_id').eq('user_id', u.id)
    ])
    const allRecipeIds = new Set([
      ...(favRes.data || []).map((r: any) => r.recipe_id),
      ...(planRes.data || []).map((r: any) => r.recipe_id)
    ])
    historyCount.value = allRecipeIds.size
  }

  loading.value = false
})

const stats = computed(() => [
  { icon: 'favorite', value: favoritesCount.value, label: '收藏食谱', onClick: () => router.push('/favorites') },
  { icon: 'history', value: historyCount.value, label: '浏览记录' },
  { icon: 'calendar_month', value: planCount.value, label: '饮食计划' }
])

const preferences = [
  { icon: 'restaurant', title: '口味偏好', desc: '清淡、适中、重口味' },
  { icon: 'no_meals', title: '饮食限制', desc: '过敏原、忌口食材' },
  { icon: 'fitness_center', title: '健康目标', desc: '减脂、增肌、保持' },
  { icon: 'notifications', title: '提醒设置', desc: '餐前提醒、计划通知' }
]

async function handleLogout() {
  if (!$supabase) return
  await $supabase.auth.signOut()
  user.value = null
  router.push('/login')
}

function goToLogin() {
  router.push('/login')
}
</script>

<template>
  <div>
    <!-- TopAppBar -->
    <header class="bg-[#FFFBFA] shadow-[0_4px_20px_rgba(84,44,0,0.06)] sticky top-0 z-40">
      <div class="flex justify-between items-center w-full px-5 py-4 max-w-2xl mx-auto">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-primary">person</span>
          <h1 class="text-xl font-extrabold text-primary tracking-tight font-[Plus_Jakarta_Sans]">个人中心</h1>
        </div>
        <button v-if="user" @click="handleLogout" class="text-label-sm text-on-surface-variant hover:text-primary transition-colors">
          退出登录
        </button>
      </div>
    </header>

    <main class="max-w-2xl mx-auto px-5 pt-4 pb-28 space-y-8">
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
        <p class="text-body-md text-on-surface-variant mb-6">登录后可使用更多功能</p>
        <button @click="goToLogin" class="px-8 py-4 rounded-full bg-primary text-white font-label-lg font-bold shadow-lg hover:opacity-90 transition-all active:scale-[0.98]">
          立即登录
        </button>
      </div>

      <!-- Logged In -->
      <template v-else>
        <!-- Profile Card -->
        <section class="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgba(84,44,0,0.06)] flex items-center gap-4">
          <div class="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center text-white text-3xl font-bold">
            {{ user.email?.charAt(0).toUpperCase() }}
          </div>
          <div class="flex-1">
            <h2 class="text-headline-md text-on-surface font-bold">{{ user.user_metadata?.name || '美食家' }}</h2>
            <p class="text-label-md text-on-surface-variant mt-1">{{ user.email }}</p>
          </div>
          <button class="p-3 rounded-full hover:bg-surface-container-high transition-colors">
            <span class="material-symbols-outlined text-on-surface-variant">edit</span>
          </button>
        </section>

        <!-- Stats -->
        <section class="grid grid-cols-3 gap-4">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="bg-surface-container-lowest rounded-2xl p-4 text-center cursor-pointer hover:bg-surface-container-low transition-colors"
            @click="stat.onClick"
          >
            <span class="material-symbols-outlined text-primary text-2xl">{{ stat.icon }}</span>
            <p class="text-headline-sm font-bold text-on-surface mt-2">{{ stat.value }}</p>
            <p class="text-label-sm text-on-surface-variant">{{ stat.label }}</p>
          </div>
        </section>

        <!-- Preferences -->
        <section class="space-y-3">
          <h3 class="text-label-lg text-on-surface-variant font-bold mb-4">偏好设置</h3>
          <div v-for="pref in preferences" :key="pref.title" class="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm">
            <div class="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center">
              <span class="material-symbols-outlined text-primary">{{ pref.icon }}</span>
            </div>
            <div class="flex-1">
              <h4 class="text-label-md font-bold text-on-surface">{{ pref.title }}</h4>
              <p class="text-label-sm text-on-surface-variant">{{ pref.desc }}</p>
            </div>
            <span class="material-symbols-outlined text-on-surface-variant">chevron_right</span>
          </div>
        </section>
      </template>
    </main>

    <BottomNav />
  </div>
</template>
