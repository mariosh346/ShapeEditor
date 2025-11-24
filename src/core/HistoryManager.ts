export interface ICommand {
  execute(): void;
  undo(): void;
}

const MAX_HISTORY = 50;

export class HistoryManager {
  private history: ICommand[] = [];
  private pointer: number = -1;
  private maxHistory: number;

  constructor(maxHistory = MAX_HISTORY) {
    this.maxHistory = maxHistory;
  }

  private checkEndAndTruncate() {
    if (this.pointer < this.history.length - 1) {
      this.history = this.history.slice(0, this.pointer + 1);
    }
  }

  execute(command: ICommand) {
    command.execute();

    this.checkEndAndTruncate();

    this.history.push(command);
    this.pointer++;

    if (this.history.length > this.maxHistory) {
      this.history.shift();
      this.pointer--;
    }
  }

  undo() {
    if (this.pointer >= 0) {
      const command = this.history[this.pointer];
      command.undo();
      this.pointer--;
    }
  }

  redo() {
    if (this.pointer < this.history.length - 1) {
      this.pointer++;
      const command = this.history[this.pointer];
      command.execute();
    }
  }

  get canUndo() { return this.pointer >= 0; }
  get canRedo() { return this.pointer < this.history.length - 1; }
}
