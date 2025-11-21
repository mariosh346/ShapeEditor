import type { CanvasStoreActions } from '@/store/canvasStore';
import type { Shape } from '@/types';
import type { ICommand } from '@/core/HistoryManager';

export class AddShapeCommand implements ICommand {
  constructor(private store: CanvasStoreActions, private shape: Shape) {}

  execute() {
    this.store._rawAddShape(this.shape);
    this.store.selectShape(this.shape.id);
  }

  undo() {
    this.store._rawRemoveShape(this.shape.id);
    this.store.selectShape(null);
  }
}

export class MoveShapeCommand implements ICommand {
  private oldX: number;
  private oldY: number;

  constructor(
    private store: CanvasStoreActions,
    private shapeId: string,
    private newX: number,
    private newY: number
  ) {
    const shape = store.getShapeById(shapeId);
    if (!shape) throw new Error(`Shape ${shapeId} not found`);
    this.oldX = shape.x;
    this.oldY = shape.y;
  }

  execute() {
    this.store._rawUpdateShape(this.shapeId, { x: this.newX, y: this.newY });
  }

  undo() {
    this.store._rawUpdateShape(this.shapeId, { x: this.oldX, y: this.oldY });
  }
}

export class ChangeColorCommand implements ICommand {
  private oldColor: string;

  constructor(
    private store: CanvasStoreActions,
    private shapeId: string,
    private newColor: string
  ) {
    const shape = store.getShapeById(shapeId);
    if (!shape) throw new Error(`Shape ${shapeId} not found`);
    this.oldColor = shape.fill;
  }

  execute() {
    this.store._rawUpdateShape(this.shapeId, { fill: this.newColor });
  }

  undo() {
    this.store._rawUpdateShape(this.shapeId, { fill: this.oldColor });
  }
}

export class DeleteShapeCommand implements ICommand {
  private shapeBackup: Shape;
  private indexBackup: number;

  constructor(private store: CanvasStoreActions, private shapeId: string) {
    const shape = store.getShapeById(shapeId);
    if (!shape) throw new Error(`Shape ${shapeId} not found`);
    this.shapeBackup = { ...shape };
    this.indexBackup = store.getLayerIndex(shapeId);
  }

  execute() {
    this.store.selectShape(null);
    this.store._rawRemoveShape(this.shapeId);
  }

  undo() {
    this.store._rawAddShape(this.shapeBackup, this.indexBackup);
  }
}