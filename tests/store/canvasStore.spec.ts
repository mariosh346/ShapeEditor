import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useCanvasStore } from '../../src/store/canvasStore';
import { shape } from '../../src/types';

describe('CanvasStore Integration', () => {
  let store: ReturnType<typeof useCanvasStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useCanvasStore();
  });

  describe('Add Shape', () => {
    it('should add a rectangle', () => {
      store.addRectangle();
      expect(store.shapesArray.length).toBe(1);
      const newShape = store.shapesArray[0];
      expect(newShape.type).toBe(shape.rectangle);
      expect(store.state.selectedId).toBe(newShape.id);
    });

    it('should undo adding a shape', () => {
      store.addRectangle();
      const shapeId = store.shapesArray[0].id;
      
      store.undo();
      expect(store.shapesArray.length).toBe(0);
      expect(store.state.shapes[shapeId]).toBeUndefined();
      expect(store.state.selectedId).toBe(null);
    });

    it('should redo adding a shape', () => {
      store.addRectangle();
      store.undo();
      store.redo();
      expect(store.shapesArray.length).toBe(1);
      expect(store.state.selectedId).toBe(store.shapesArray[0].id);
    });
  });

  describe('Selection', () => {
    it('should select a shape', () => {
      store.addRectangle();
      store.selectShape(null); // Deselect first
      expect(store.state.selectedId).toBeNull();
      
      const shapeId = store.shapesArray[0].id;
      store.selectShape(shapeId);
      expect(store.state.selectedId).toBe(shapeId);
      expect(store.selectedShape?.id).toBe(shapeId);
    });
  });

  describe('Move Shape', () => {
    let shapeId: string;

    beforeEach(() => {
      store.addRectangle();
      shapeId = store.shapesArray[0].id;
    });

    it('should move shape to new coordinates', () => {
      const initialX = store.getShapeById(shapeId)!.x;
      const newX = initialX + 50;
      const newY = 200;

      store.moveShape(shapeId, newX, newY);
      
      const movedShape = store.getShapeById(shapeId);
      expect(movedShape?.x).toBe(newX);
      expect(movedShape?.y).toBe(newY);
    });

    it('should undo move', () => {
      const initialX = store.getShapeById(shapeId)!.x;
      const initialY = store.getShapeById(shapeId)!.y;

      store.moveShape(shapeId, 300, 300);
      store.undo();

      const revertedShape = store.getShapeById(shapeId);
      expect(revertedShape?.x).toBe(initialX);
      expect(revertedShape?.y).toBe(initialY);
    });

    it('should redo move', () => {
      store.moveShape(shapeId, 300, 300);
      store.undo();
      store.redo();

      const movedShape = store.getShapeById(shapeId);
      expect(movedShape?.x).toBe(300);
      expect(movedShape?.y).toBe(300);
    });
  });

  describe('Change Color', () => {
    let shapeId: string;
    let initialColor: string;

    beforeEach(() => {
      store.addRectangle();
      shapeId = store.shapesArray[0].id;
      initialColor = store.getShapeById(shapeId)!.fill;
    });

    it('should update shape color', () => {
      const newColor = '#00ff00';
      store.updateColor(shapeId, newColor);
      expect(store.getShapeById(shapeId)?.fill).toBe(newColor);
    });

    it('should undo color change', () => {
      const newColor = '#00ff00';
      store.updateColor(shapeId, newColor);
      store.undo();
      expect(store.getShapeById(shapeId)?.fill).toBe(initialColor);
    });

    it('should redo color change', () => {
      const newColor = '#00ff00';
      store.updateColor(shapeId, newColor);
      store.undo();
      store.redo();
      expect(store.getShapeById(shapeId)?.fill).toBe(newColor);
    });
  });

  describe('Delete Shape', () => {
    let shapeId: string;

    beforeEach(() => {
      store.addRectangle();
      shapeId = store.shapesArray[0].id;
    });

    it('should delete selected shape', () => {
      store.selectShape(shapeId);
      store.deleteSelected();
      expect(store.shapesArray.length).toBe(0);
      expect(store.getShapeById(shapeId)).toBeUndefined();
    });

    it('should undo deletion', () => {
      store.selectShape(shapeId);
      store.deleteSelected();
      store.undo();
      
      expect(store.shapesArray.length).toBe(1);
      expect(store.getShapeById(shapeId)).toBeDefined();
    });

    it('should restore layer order on undo deletion', () => {
      // Add another shape to test order
      store.addRectangle(); // shape 2
      const shape2Id = store.shapesArray[1].id;
      
      store.selectShape(shapeId); // select first shape
      store.deleteSelected();
      
      expect(store.shapesArray.length).toBe(1);
      expect(store.shapesArray[0].id).toBe(shape2Id);

      store.undo();
      
      expect(store.shapesArray.length).toBe(2);
      expect(store.shapesArray[0].id).toBe(shapeId); // Should be back at index 0
      expect(store.shapesArray[1].id).toBe(shape2Id);
    });

    it('should redo deletion', () => {
      store.selectShape(shapeId);
      store.deleteSelected();
      store.undo();
      store.redo();
      
      expect(store.shapesArray.length).toBe(0);
    });
  });
});
