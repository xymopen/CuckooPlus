import { Sm, Md, Lg } from '@/components/Breakpoints'
import DefaultLayout from '@/layouts/default/index.vue'
import PlainLayout from '@/layouts/plain.vue'

declare module 'vue' {
  interface GlobalComponents {
    Sm: typeof Sm
    Md: typeof Md
    Lg: typeof Lg
    DefaultLayout: typeof DefaultLayout
    PlainLayout: typeof PlainLayout
  }
}
