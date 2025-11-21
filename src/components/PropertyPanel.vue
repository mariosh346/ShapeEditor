<script setup lang="ts">
import { useCanvasStore } from '@/store/canvasStore';

const store = useCanvasStore();

const handlePosUpdate = (axis: 'x'|'y', e: Event) => {
  if (!store.selectedShape) return;
  const val = +(e.target as HTMLInputElement).value;
  const x = axis === 'x' ? val : store.selectedShape.x;
  const y = axis === 'y' ? val : store.selectedShape.y;
  store.moveShape(store.selectedShape.id, x, y);
};
const handleColorUpdate = (e: Event) => {
  if (!store.selectedShape) return;
  const val = (e.target as HTMLInputElement).value;
  store.updateColor(store.selectedShape.id, val);
};
</script>

<template>
  <aside class="property-panel">
    <div class="property-panel__header">
      <h2>Controls</h2>
      <div class="property-panel__undo-group">
        <button @click="store.undo()" :disabled="!store.canUndo">Undo</button>
        <button @click="store.redo()" :disabled="!store.canRedo">Redo</button>
      </div>
      <button class="btn-primary" @click="store.addRectangle()">+ Add Rectangle</button>
      <div class="hint">Shortcuts: Ctrl+Z / Ctrl+Shift+Z</div>
    </div>

    <div class="property-panel__content">
      <div v-if="store.selectedShape" class="property-panel__form-stack">
        <h3>Properties</h3>
        <label>
          X: <input type="number" :value="store.selectedShape.x" @change="e => handlePosUpdate('x', e)">
        </label>
        <label>
          Y: <input type="number" :value="store.selectedShape.y" @change="e => handlePosUpdate('y', e)">
        </label>
        <label>
          Fill: 
          <input type="color" :value="store.selectedShape.fill" @change="e => handleColorUpdate(e)">
        </label>
        <button class="btn-danger" @click="store.deleteSelected()">Delete</button>
      </div>
      <div v-else class="property-panel__empty-state">
        <p>Select a shape to edit.</p>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.property-panel { width: 300px; border-left: 1px solid #e2e8f0; background: white; display: flex; flex-direction: column; height: 100%; }
.property-panel__header { padding: 20px; border-bottom: 1px solid #e2e8f0; background: #f8fafc; }
.property-panel__undo-group { display: flex; gap: 10px; margin-bottom: 10px; }
.property-panel__content { padding: 20px; flex: 1; overflow-y: auto; }
.property-panel__form-stack { display: flex; flex-direction: column; gap: 15px; }
.property-panel__empty-state {
    text-align: center;
    color: #94a3b8;
    margin-top: 50px;
}
</style>
