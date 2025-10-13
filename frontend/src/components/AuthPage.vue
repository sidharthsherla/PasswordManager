<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
      <div class="text-center">
        <Shield class="mx-auto h-12 w-auto text-indigo-500" />
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
          {{ isLogin ? 'Sign in to your account' : 'Create a new account' }}
        </h2>
      </div>
      
      <component :is="isLogin ? LoginForm : SignupForm" @set-token="onSetToken" />

      <p class="text-center text-sm text-gray-600 dark:text-gray-400">
        {{ isLogin ? "Don't have an account? " : "Already have an account? " }}
        <button @click="isLogin = !isLogin" class="font-medium text-indigo-600 hover:text-indigo-500">
          {{ isLogin ? 'Sign up' : 'Sign in' }}
        </button>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue';
import { Shield } from 'lucide-vue-next';

const emit = defineEmits(['set-token']);
const isLogin = ref(true);
const LoginForm = defineAsyncComponent(() => import('./LoginForm.vue'));
const SignupForm = defineAsyncComponent(() => import('./SignupForm.vue'));
const onSetToken = (token) => {
    emit('set-token', token);
}
</script>