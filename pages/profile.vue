<script setup lang="ts">
const user = {
  name: '林小食',
  bio: '“唯有美食与爱不可辜负”',
  level: '5',
  levelTitle: '美食鉴赏家',
  stats: [
    { value: '128', label: '收藏餐厅' },
    { value: '42', label: '我的食谱' },
    { value: '365', label: '打卡天数' }
  ]
}

const preferences = [
  { icon: 'local_fire_department', label: '无辣不欢', active: true },
  { icon: 'set_meal', label: '海鲜爱好者', active: true },
  { icon: 'fitness_center', label: '正在减脂', active: true },
  { icon: 'coffee', label: '重度咖啡因', active: true }
]

const settings = [
  { icon: 'manage_accounts', label: '账号设置', badge: null },
  { icon: 'notifications', label: '通知', badge: true },
  { icon: 'chat_bubble', label: '意见反馈', badge: null },
  { icon: 'info', label: '关于我们', badge: null }
]
</script>

<template>
  <div>
    <!-- TopAppBar -->
    <header class="bg-[#FFFBFA] shadow-[0_4px_20px_rgba(84,44,0,0.06)] sticky top-0 z-40">
      <div class="flex justify-between items-center w-full px-5 py-4 max-w-2xl mx-auto">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">location_on</span>
          <span class="font-[Plus_Jakarta_Sans] text-stone-900 font-bold">上海</span>
        </div>
        <h1 class="text-xl font-extrabold text-primary tracking-tight">每天吃什么</h1>
        <button class="hover:opacity-80 transition-opacity">
          <span class="material-symbols-outlined text-stone-900">search</span>
        </button>
      </div>
    </header>

    <main class="max-w-2xl mx-auto px-5 pt-6 space-y-8 pb-28">
      <!-- Profile Header -->
      <section class="relative bg-surface-container-lowest rounded-[32px] p-8 sunlight-shadow flex flex-col items-center text-center">
        <div class="relative mb-4">
          <div class="w-24 h-24 rounded-full border-4 border-primary-container/20 p-1 overflow-hidden">
            <img alt="User Avatar" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop" class="w-full h-full object-cover rounded-full" />
          </div>
          <div class="absolute bottom-0 right-0 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-sm text-[10px] shadow-sm flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]" style="font-variation-settings: 'FILL' 1;">stars</span>
            LV.{{ user.level }} {{ user.levelTitle }}
          </div>
        </div>
        <h2 class="font-headline-md text-on-surface">{{ user.name }}</h2>
        <p class="text-on-surface-variant font-label-md mt-1">{{ user.bio }}</p>
      </section>

      <!-- Stats Row -->
      <section class="grid grid-cols-3 gap-4">
        <div v-for="stat in user.stats" :key="stat.label" class="bg-surface-container-low rounded-2xl p-4 flex flex-col items-center sunlight-shadow">
          <span class="text-headline-sm font-bold text-primary">{{ stat.value }}</span>
          <span class="text-label-sm text-on-surface-variant mt-1">{{ stat.label }}</span>
        </div>
      </section>

      <!-- Taste Preferences -->
      <section class="space-y-2">
        <h3 class="font-headline-sm text-on-surface px-1">口味偏好</h3>
        <div class="bg-surface-container rounded-[24px] p-6 space-y-4">
          <div class="flex flex-wrap gap-2">
            <span v-for="pref in preferences" :key="pref.label" class="px-4 py-2 rounded-full font-label-md flex items-center gap-2" :class="pref.active ? 'bg-[#FFF4ED] text-primary' : 'bg-surface-container-highest text-on-surface-variant'">
              <span class="material-symbols-outlined text-[18px]">{{ pref.icon }}</span>
              {{ pref.label }}
            </span>
          </div>
          <div class="flex justify-between items-center pt-2 border-t border-outline-variant/30">
            <p class="text-label-sm text-on-surface-variant">基于您的 12 份食谱分析</p>
            <button class="text-primary font-label-md flex items-center">
              更新偏好 <span class="material-symbols-outlined text-[16px] ml-1">chevron_right</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Settings List -->
      <section class="bg-surface-container-lowest rounded-[32px] overflow-hidden sunlight-shadow">
        <div class="divide-y divide-outline-variant/20">
          <button v-for="item in settings" :key="item.label" class="w-full flex justify-between items-center p-5 hover:bg-surface-container-low transition-colors group">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="item.icon === 'manage_accounts' ? 'bg-primary-fixed text-on-primary-fixed-variant' : item.icon === 'notifications' ? 'bg-secondary-fixed text-on-secondary-fixed-variant' : item.icon === 'chat_bubble' ? 'bg-surface-container-highest text-on-surface-variant' : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'">
                <span class="material-symbols-outlined">{{ item.icon }}</span>
              </div>
              <span class="font-label-md text-on-surface">{{ item.label }}</span>
            </div>
            <div class="flex items-center gap-2">
              <div v-if="item.badge" class="w-2 h-2 rounded-full bg-error animate-pulse"></div>
              <span class="material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform">chevron_right</span>
            </div>
          </button>
        </div>
      </section>

      <!-- Promotion Banner -->
      <section class="bg-primary p-6 rounded-[32px] text-on-primary flex items-center justify-between relative overflow-hidden">
        <div class="relative z-10 space-y-1">
          <h4 class="font-headline-sm">升级高级会员</h4>
          <p class="text-label-sm opacity-90">解锁定制化营养建议与独家食谱</p>
          <button class="mt-2 bg-white text-primary px-4 py-2 rounded-full font-label-md active:scale-95 transition-transform shadow-sm">
            立即开启
          </button>
        </div>
        <div class="absolute right-[-20px] bottom-[-20px] opacity-20 transform rotate-12">
          <span class="material-symbols-outlined text-[120px]">bakery_dining</span>
        </div>
      </section>
    </main>

    <BottomNav />
  </div>
</template>