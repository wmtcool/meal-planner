import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const url = config.public.supabaseUrl
  const anonKey = config.public.supabaseAnonKey

  if (!url || !anonKey) {
    console.warn('Supabase 配置缺失，请检查环境变量')
    return {
      provide: {
        supabase: null
      }
    }
  }

  const supabase = createClient(url, anonKey)

  return {
    provide: {
      supabase
    }
  }
})
