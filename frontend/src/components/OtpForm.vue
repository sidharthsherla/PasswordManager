<template>
    <form class="mt-8 space-y-6" @submit.prevent="handleVerify">
        <p v-if="error" class="text-sm text-red-500 text-center">{{ error }}</p>
        <div>
            <input v-model="otp" type="text" maxlength="6" required placeholder="Enter 6-digit code" class="appearance-none text-center tracking-[1em] relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <button type="submit" :disabled="isLoading" class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
            {{ isLoading ? 'Verifying...' : 'Verify & Create Account' }}
        </button>
    </form>
</template>

<script setup>
import { ref } from 'vue';
import api from '../services/api';

const props = defineProps({
    signupData: {
        type: Object,
        required: true
    }
});
const emit = defineEmits(['set-token']);

const otp = ref('');
const error = ref('');
const isLoading = ref(false);

const handleVerify = async () => {
    error.value = '';
    isLoading.value = true;
    try {
        // Call the final registration endpoint with all data
        const res = await api.post('/auth/register', {
            email: props.signupData.email,
            password: props.signupData.password,
            otp: otp.value
        });
        emit('set-token', res.data.token);
    } catch (err) {
        error.value = err.response?.data?.msg || 'Verification failed. Invalid or expired OTP.';
    } finally {
        isLoading.value = false;
    }
};
</script>

