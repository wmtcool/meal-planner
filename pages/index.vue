<script setup lang="ts">
const categories = ['附近餐厅', '热门食谱', '快手菜', '甜品', '低脂健康']
const trends = [
  { name: '麻辣烫', image: 'https://images.unsplash.com/photo-1585032226651-759b378dcfaf?w=400&h=400&fit=crop' },
  { name: '轻食沙拉', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop' },
  { name: '手工披萨', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop' },
  { name: '牛排', image: 'https://images.unsplash.com/photo-1544025162-d76690b67f61?w=400&h=400&fit=crop' },
]

const dailyPick = {
  name: '蜂蜜香煎三文鱼',
  desc: '清新自然的口感，营养均衡的选择',
  time: '25 分钟',
  calories: '420 千卡',
  rating: '4.8',
  image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=400&fit=crop'
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
        <button class="hover:opacity-80 transition-opacity">
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
            <button class="relative flex flex-col items-center justify-center w-40 h-40 bg-white rounded-full shadow-[0_12px_40px_rgba(160,65,0,0.3)] active:scale-90 transition-transform">
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
          <div v-for="item in trends" :key="item.name" class="flex-shrink-0 w-40 space-y-3 group cursor-pointer active:scale-95 transition-transform">
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
        <div class="relative rounded-[32px] overflow-hidden shadow-[0_12px_40px_rgba(84,44,0,0.12)] bg-white group cursor-pointer">
          <div class="aspect-[16/10] overflow-hidden">
            <img :alt="dailyPick.name" :src="dailyPick.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
            <div class="absolute top-4 left-4 flex gap-2">
              <span class="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-sm shadow-sm">Healthy</span>
              <span class="bg-tertiary-container/90 text-on-tertiary-container px-3 py-1 rounded-full font-label-sm shadow-sm backdrop-blur-sm">Spicy</span>
            </div>
          </div>
          <div class="p-6 space-y-4">
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-headline-sm text-on-surface">{{ dailyPick.name }}</h4>
                <p class="text-on-surface-variant font-body-md mt-1">{{ dailyPick.desc }}</p>
              </div>
              <div class="flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded-lg">
                <span class="material-symbols-outlined text-secondary-container text-sm" style="font-variation-settings: 'FILL' 1;">star</span>
                <span class="font-label-md text-on-surface">{{ dailyPick.rating }}</span>
              </div>
            </div>
            <div class="flex items-center gap-6 text-on-surface-variant">
              <div class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-sm">schedule</span>
                <span class="text-sm font-medium">{{ dailyPick.time }}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-sm">local_fire_department</span>
                <span class="text-sm font-medium">{{ dailyPick.calories }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <BottomNav />
  </div>
</template>