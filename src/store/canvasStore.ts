import { defineStore } from 'pinia';
import { reactive, computed } from 'vue';
import { HistoryManager } from '@/core/HistoryManager';
import { AddShapeCommand, MoveShapeCommand, ChangeColorCommand, DeleteShapeCommand } from '@/model/ShapeCommands';
import { shape, type Shape, type ShapeType } from '@/types';

export interface CanvasStoreActions {
  _rawAddShape(shape: Shape, index?: number): void;
  _rawRemoveShape(id: string): void;
  _rawUpdateShape(id: string, updates: Partial<Shape>): void;
  getShapeById(id: string): Shape | undefined;
  getLayerIndex(id: string): number;
  selectShape(id: string | null): void;
}

export const useCanvasStore = defineStore('canvas', () => {
  const history = reactive(new HistoryManager());

  const state = reactive<{
    shapes: Record<string, Shape>;
    layerOrder: string[];
    selectedId: string | null;
  }>({
    shapes: {},
    layerOrder: [],
    selectedId: null
  });

  // Getters
  const shapesArray = computed(() => state.layerOrder.map(id => state.shapes[id]));
  const selectedShape = computed(() => state.selectedId ? state.shapes[state.selectedId] : null);
  const canUndo = computed(() => history.canUndo);
  const canRedo = computed(() => history.canRedo);

  // Internal Mutations
  const actionsContext: CanvasStoreActions = {
    _rawAddShape: (shape, index) => {
      state.shapes[shape.id] = shape;
      index !== undefined ? state.layerOrder.splice(index, 0, shape.id) : state.layerOrder.push(shape.id);
    },
    _rawRemoveShape: (id) => {
      delete state.shapes[id];
      state.layerOrder = state.layerOrder.filter(sid => sid !== id);
    },
    _rawUpdateShape: (id, updates) => {
      if (state.shapes[id]) Object.assign(state.shapes[id], updates);
    },
    getShapeById: (id) => state.shapes[id],
    getLayerIndex: (id) => state.layerOrder.indexOf(id),
    selectShape: (id) => state.selectedId = id
  };

  // Public Actions
  function addRectangle() {
    addShape(shape.rectangle);
  }

  function addShape(type: ShapeType) {
    const id = crypto.randomUUID();
    const newShape: Shape = {
      id, type,
      x: 100 + (Math.random() * 50), y: 100 + (Math.random() * 50),
      width: 120, height: 80, fill: '#3b82f6'
    };
    history.execute(new AddShapeCommand(actionsContext, newShape));
  }

  function moveShape(id: string, x: number, y: number) {
    history.execute(new MoveShapeCommand(actionsContext, id, x, y));
  }

  function updateColor(id: string, color: string) {
    history.execute(new ChangeColorCommand(actionsContext, id, color));
  }

  function deleteSelected() {
    if (state.selectedId) history.execute(new DeleteShapeCommand(actionsContext, state.selectedId));
  }

  return {
    state, shapesArray, selectedShape, canUndo, canRedo,
    addRectangle, moveShape, updateColor, deleteSelected, selectShape: actionsContext.selectShape,
    undo: () => history.undo(),
    redo: () => history.redo(),
    getShapeById: actionsContext.getShapeById,
    getLayerIndex: actionsContext.getLayerIndex
  };
});