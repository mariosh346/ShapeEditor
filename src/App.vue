<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import CanvasBoard from '@/components/CanvasBoard.vue';
import PropertyPanel from '@/components/PropertyPanel.vue';
import { useCanvasStore } from '@/store/canvasStore';

const store = useCanvasStore();

const handleKeydown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
    e.preventDefault();
    if (e.shiftKey) store.redo();
    else store.undo();
  }
  if (e.key === 'Delete' || e.key === 'Backspace') {
    const target = e.target as HTMLElement;
    if (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
      return;
    }
    store.deleteSelected();
  }
};

onMounted(() => window.addEventListener('keydown', handleKeydown));
onUnmounted(() => window.removeEventListener('keydown', handleKeydown));
</script>

<template>
  <div class="app-layout">
    <CanvasBoard />
    <PropertyPanel />
  </div>
</template>