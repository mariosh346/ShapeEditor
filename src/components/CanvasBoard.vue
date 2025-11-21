<script setup lang="ts">
import { useCanvasStore } from '@/store/canvasStore';
import ShapeItem from './ShapeItem.vue';

const store = useCanvasStore();
</script>

<template>
  <div class="canvas-board" @click.self="store.selectShape(null)">
    <div class="canvas-board__instructions">
      <h1 class="canvas-board__header">Shape Canvas</h1>
      <p>Click "Add Rectangle" to start.</p>
    </div>

    <transition-group name="canvas-board__fade">
      <ShapeItem
        v-for="shape in store.shapesArray"
        :key="shape.id"
        :shape="shape"
        :is-selected="store.state.selectedId === shape.id"
        @select="store.selectShape"
      />
    </transition-group>
  </div>
</template>

<style scoped>
.canvas-board {
  flex: 1;
  position: relative;
  background-color: #fff;
  background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
  background-size: 20px 20px;
  overflow: hidden;
  height: 100%;
}
.canvas-board__header {
  margin-top:0;
}
.canvas-board__instructions {
  position: absolute;
  top: 20px;
  left: 20px;
  pointer-events: none;
  color: #94a3b8;
}
</style>