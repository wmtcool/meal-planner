<script setup lang="ts">
const { $supabase } = useNuxtApp()
const router = useRouter()

const isLogin = ref(true)
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleSubmit() {
  loading.value = true
  error.value = ''
  
  try {
    if (isLogin.value) {
      const { error: err } = await $supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value
      })
      if (err) throw err
      router.push('/profile')
    } else {
      const { error: err } = await $supabase.auth.signUp({
        email: email.value,
        password: password.value
      })
      if (err) throw err
      alert('注册成功！请查收邮箱验证邮件。')
    }
  } catch (e: any) {
    error.value = e.message || '操作失败'
  } finally {
    loading.value = false
  }
}

async function handleGoogleLogin() {
  const { error: err } = await $supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/profile'
    }
  })
  if (err) error.value = err.message
}
</script>

<template>
  <div class="min-h-screen bg-[#FFFBFA] flex items-center justify-center px-5 py-12">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-4">
          <span class="material-symbols-outlined text-white text-3xl">restaurant</span>
        </div>
        <h1 class="text-headline-lg font-bold text-on-surface">每天吃什么</h1>
        <p class="text-body-md text-on-surface-variant mt-2">发现美食，享受生活</p>
      </div>

      <!-- Form Card -->
      <div class="bg-white rounded-[32px] p-8 shadow-[0_12px_40px_rgba(84,44,0,0.08)]">
        <div class="flex mb-8">
          <button @click="isLogin = true" class="flex-1 py-3 text-label-lg font-bold border-b-2 transition-colors" :class="isLogin ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant'">
            登录
          </button>
          <button @click="isLogin = false" class="flex-1 py-3 text-label-lg font-bold border-b-2 transition-colors" :class="!isLogin ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant'">
            注册
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-label-sm text-on-surface-variant mb-2">邮箱</label>
            <input v-model="email" type="email" required class="w-full px-4 py-3 rounded-2xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="your@email.com" />
          </div>
          <div>
            <label class="block text-label-sm text-on-surface-variant mb-2">密码</label>
            <input v-model="password" type="password" required minlength="6" class="w-full px-4 py-3 rounded-2xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="至少6位密码" />
          </div>

          <p v-if="error" class="text-error text-label-sm text-center">{{ error }}</p>

          <button type="submit" :disabled="loading" class="w-full py-4 rounded-full bg-primary text-white font-label-lg font-bold shadow-lg hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50">
            {{ loading ? '处理中...' : (isLogin ? '登录' : '注册') }}
          </button>
        </form>

        <div class="mt-6">
          <div class="flex items-center gap-4 my-6">
            <div class="flex-1 h-px bg-outline-variant"></div>
            <span class="text-label-sm text-on-surface-variant">或</span>
            <div class="flex-1 h-px bg-outline-variant"></div>
          </div>

          <button @click="handleGoogleLogin" class="w-full py-4 rounded-full border border-outline-variant flex items-center justify-center gap-3 hover:bg-surface-container-high transition-colors">
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span class="text-label-md font-medium">使用 Google 登录</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
