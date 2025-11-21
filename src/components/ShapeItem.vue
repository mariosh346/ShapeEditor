<script setup lang="ts">
import type { Shape } from '@/types';

interface Props {
  shape: Shape;
  isSelected: boolean;
}

defineProps<Props>();
defineEmits<{ (e: 'select', id: string): void }>();
</script>

<template>
  <div 
    class="shape-item"
    :class="{ 'shape-item--is-selected': isSelected }"
    :style="{
      transform: `translate(${shape.x}px, ${shape.y}px)`,
      width: `${shape.width}px`,
      height: `${shape.height}px`,
      backgroundColor: shape.fill
    }"
    @click.stop="$emit('select', shape.id)"
    data-test="shape-item"
  >
    <span v-if="isSelected" class="shape-item__debug-label">{{ shape.type }}</span>
  </div>
</template>

<style scoped>
.shape-item {
  position: absolute;
  cursor: pointer;
  transition: all 0.1s ease;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  box-sizing: border-box;
}
.shape-item:hover {
  filter: brightness(0.95);
}
.shape-item--is-selected {
  outline: 3px solid #3b82f6;
  z-index: 50;
}
.shape-item__debug-label {
  position: absolute;
  top: -20px;
  left: 0;
  font-size: 10px;
  background: #dbeafe;
  color: #1e40af;
  padding: 1px 4px;
  border-radius: 3px;
}
</style>