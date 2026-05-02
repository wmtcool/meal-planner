<script setup lang="ts">
const route = useRoute()
const currentPath = computed(() => route.path)
</script>

<template>
  <nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pb-6 pt-3 bg-white/90 backdrop-blur-md shadow-[0_-8px_30px_rgba(84,44,0,0.08)] rounded-t-[32px] border-t border-orange-50">
    <NuxtLink to="/" class="flex flex-col items-center justify-center text-stone-400 px-2 py-1.5 hover:text-primary transition-colors active:scale-90 transition-transform duration-150" :class="{ 'text-primary bg-[#FFF4ED] rounded-2xl': currentPath === '/' }">
      <span class="material-symbols-outlined mb-1">home</span>
      <span class="font-[Plus_Jakarta_Sans] text-[11px] font-semibold">首页</span>
    </NuxtLink>
    
    <NuxtLink to="/discover" class="flex flex-col items-center justify-center text-stone-400 px-2 py-1.5 hover:text-primary transition-colors active:scale-90 transition-transform duration-150" :class="{ 'text-primary bg-[#FFF4ED] rounded-2xl': currentPath === '/discover' }">
      <span class="material-symbols-outlined mb-1">explore</span>
      <span class="font-[Plus_Jakarta_Sans] text-[11px] font-semibold">发现</span>
    </NuxtLink>
    
    <NuxtLink to="/favorites" class="flex flex-col items-center justify-center text-stone-400 px-2 py-1.5 hover:text-primary transition-colors active:scale-90 transition-transform duration-150" :class="{ 'text-primary bg-[#FFF4ED] rounded-2xl': currentPath === '/favorites' }">
      <span class="material-symbols-outlined mb-1">favorite</span>
      <span class="font-[Plus_Jakarta_Sans] text-[11px] font-semibold">收藏</span>
    </NuxtLink>

    <NuxtLink to="/plan" class="flex flex-col items-center justify-center text-stone-400 px-2 py-1.5 hover:text-primary transition-colors active:scale-90 transition-transform duration-150" :class="{ 'text-primary bg-[#FFF4ED] rounded-2xl': currentPath === '/plan' }">
      <span class="material-symbols-outlined mb-1">calendar_month</span>
      <span class="font-[Plus_Jakarta_Sans] text-[11px] font-semibold">计划</span>
    </NuxtLink>
    
    <NuxtLink to="/profile" class="flex flex-col items-center justify-center text-stone-400 px-2 py-1.5 hover:text-primary transition-colors active:scale-90 transition-transform duration-150" :class="{ 'text-primary bg-[#FFF4ED] rounded-2xl': currentPath === '/profile' }">
      <span class="material-symbols-outlined mb-1">person</span>
      <span class="font-[Plus_Jakarta_Sans] text-[11px] font-semibold">我的</span>
    </NuxtLink>
  </nav>

  <!-- Floating Action Button -->
  <button class="fixed right-6 bottom-28 w-14 h-14 bg-gradient-to-br from-primary to-[#FF8533] text-white rounded-2xl shadow-[0_8px_25px_rgba(255,107,0,0.3)] flex items-center justify-center active:scale-90 transition-transform z-40">
    <span class="material-symbols-outlined text-2xl">add</span>
  </button>
</template>