<script setup lang="ts">
const categories = ['附近餐厅', '热门食谱', '快手菜', '甜品', '低脂健康']

const mustTry = {
  name: '清晨活力：牛油果鹰嘴豆能量碗',
  desc: '开启健康生活的第一步，简单又美味',
  image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop'
}

const recommendations = [
  {
    name: '夏日地中海：清新番茄希腊沙拉',
    author: '小厨阿雅',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    likes: '1.2k',
    image: 'https://images.unsplash.com/photo-1540189544446-46aead26ecce?w=400&h=300&fit=crop'
  },
  {
    name: '街头味道：正宗墨西哥辣味塔可',
    author: '寻味家马克',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    likes: '856',
    image: 'https://images.unsplash.com/photo-1565299584946-b28f40a0ae38?w=400&h=300&fit=crop'
  },
  {
    name: '意式浪漫：手工宽面配罗勒奶油酱',
    author: '莉莉的厨房',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    likes: '2.4k',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop'
  },
  {
    name: '主厨秘籍：完美的五分熟牛排',
    author: 'Chef David',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    likes: '932',
    image: 'https://images.unsplash.com/photo-1544025162-d76690b67f61?w=400&h=300&fit=crop'
  }
]
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
          <button v-for="cat in categories" :key="cat" class="px-5 py-2.5 rounded-full font-label-md shadow-sm active:scale-95 transition-transform" :class="cat === '附近餐厅' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-on-surface-variant'">
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
          <img :alt="mustTry.name" :src="mustTry.image" class="w-full h-64 object-cover" loading="lazy" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6">
            <span class="bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full w-fit mb-2">Editor's Pick</span>
            <h3 class="text-white font-headline-sm text-lg">{{ mustTry.name }}</h3>
            <p class="text-white/80 font-body-md text-sm mt-1">{{ mustTry.desc }}</p>
          </div>
        </div>
      </section>

      <!-- Masonry Feed -->
      <section class="mb-10">
        <h2 class="font-headline-md text-on-surface mb-4">为你推荐</h2>
        <div class="columns-2 gap-4">
          <div v-for="item in recommendations" :key="item.name" class="group break-inside-avoid mb-4">
            <div class="bg-white rounded-3xl overflow-hidden shadow-[0_4px_15px_rgba(84,44,0,0.06)] hover:shadow-[0_12px_30px_rgba(84,44,0,0.1)] transition-all">
              <img :alt="item.name" :src="item.image" class="w-full object-cover" :class="item.name.includes('塔可') ? 'h-64' : 'h-48'" loading="lazy" />
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