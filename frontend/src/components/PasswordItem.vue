<template>
  <li class="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
    <div class="flex items-center space-x-4">
      <div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center font-bold text-indigo-500">
        {{ passwordData.website_name.charAt(0).toUpperCase() }}
      </div>
      <div>
        <p class="font-semibold text-gray-900 dark:text-white">{{ passwordData.website_name }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ passwordData.username }}</p>
      </div>
    </div>
    <div class="flex items-center space-x-4">
      <p class="font-mono text-sm">
        {{ showPassword ? passwordData.password : '••••••••••••' }}
      </p>
      <button @click="showPassword = !showPassword" class="text-gray-500 hover:text-indigo-500">
        <component :is="showPassword ? EyeOff : Eye" :size="20" />
      </button>
      <button @click="handleCopy" class="text-gray-500 hover:text-indigo-500">
        <component :is="copied ? Check : Copy" :size="20" :class="{'text-green-500': copied}" />
      </button>
      <button @click="isDeleteModalOpen = true" class="text-gray-500 hover:text-red-500">
        <Trash2 :size="20" />
      </button>
    </div>
    <ConfirmDeleteModal :is-open="isDeleteModalOpen" :website-name="passwordData.website_name" @close="isDeleteModalOpen = false" @confirm="handleDelete" />
  </li>
</template>

<script setup>
import { ref } from 'vue';
import { Eye, EyeOff, Copy, Check, Trash2 } from 'lucide-vue-next';
import api from '../services/api';
import ConfirmDeleteModal from './ConfirmDeleteModal.vue';

const props = defineProps({ passwordData: Object });
const emit = defineEmits(['password-deleted']);

const showPassword = ref(false);
const copied = ref(false);
const isDeleteModalOpen = ref(false);

const handleCopy = () => {
  navigator.clipboard.writeText(props.passwordData.password).then(() => {
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  });
};

const handleDelete = async () => {
    try {
        await api.delete(`/passwords/${props.passwordData.password_id}`);
        emit('password-deleted');
        isDeleteModalOpen.value = false;
    } catch (error) {
        console.error("Failed to delete password", error);
        alert("Could not delete password.");
    }
}
</script>

