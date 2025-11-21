import { reactive } from 'vue';

export interface ICommand {
  execute(): void;
  undo(): void;
}

const MAX_HISTORY = 50;

export class HistoryManager {
  private undoStack: ICommand[] = [];
  private redoStack: ICommand[] = [];
  private maxHistory: number;

  constructor(maxHistory = MAX_HISTORY) {
    this.maxHistory = maxHistory;
  }

  execute(command: ICommand) {
    command.execute();
    this.undoStack.push(command);
    this.redoStack = [];

    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }
  }

  undo() {
    const command = this.undoStack.pop();
    if (command) {
      command.undo();
      this.redoStack.push(command);
    }
  }

  redo() {
    const command = this.redoStack.pop();
    if (command) {
      command.execute();
      this.undoStack.push(command);
    }
  }

  get canUndo() { return this.undoStack.length > 0; }
  get canRedo() { return this.redoStack.length > 0; }
}