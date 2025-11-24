import { describe, it, expect, beforeEach } from 'vitest';
import { HistoryManager, ICommand } from '../../src/core/HistoryManager';

class MockCommand implements ICommand {
  executed = 0;
  undone = 0;
  execute() { this.executed++; }
  undo() { this.undone++; }
}

describe('HistoryManager', () => {
  let history: HistoryManager;

  beforeEach(() => {
    history = new HistoryManager();
  });

  describe('Initialization', () => {
    it('should start with canUndo as false', () => {
      expect(history.canUndo).toBe(false);
    });

    it('should start with canRedo as false', () => {
      expect(history.canRedo).toBe(false);
    });
  });

  describe('Execution', () => {
    it('should execute the command', () => {
      const cmd = new MockCommand();
      history.execute(cmd);
      expect(cmd.executed).toBe(1);
    });

    it('should enable undo after execution', () => {
      const cmd = new MockCommand();
      history.execute(cmd);
      expect(history.canUndo).toBe(true);
    });

    it('should keep redo disabled after execution', () => {
      const cmd = new MockCommand();
      history.execute(cmd);
      expect(history.canRedo).toBe(false);
    });
  });

  describe('Undo', () => {
    it('should call undo on the command', () => {
      const cmd = new MockCommand();
      history.execute(cmd);
      history.undo();
      expect(cmd.undone).toBe(1);
    });

    it('should disable undo when history becomes empty', () => {
      const cmd = new MockCommand();
      history.execute(cmd);
      history.undo();
      expect(history.canUndo).toBe(false);
    });

    it('should enable redo after undo', () => {
      const cmd = new MockCommand();
      history.execute(cmd);
      history.undo();
      expect(history.canRedo).toBe(true);
    });
  });

  describe('Redo', () => {
    it('should call execute on the command during redo', () => {
      const cmd = new MockCommand();
      history.execute(cmd);
      history.undo();
      history.redo();
      expect(cmd.executed).toBe(2);
    });

    it('should enable undo after redo', () => {
      const cmd = new MockCommand();
      history.execute(cmd);
      history.undo();
      history.redo();
      expect(history.canUndo).toBe(true);
    });

    it('should disable redo after redoing to the end', () => {
      const cmd = new MockCommand();
      history.execute(cmd);
      history.undo();
      history.redo();
      expect(history.canRedo).toBe(false);
    });
  });

  describe('Truncate History', () => {
    it('should have redo enabled before truncation', () => {
      const cmd1 = new MockCommand();
      const cmd2 = new MockCommand();
      history.execute(cmd1);
      history.execute(cmd2);
      history.undo();
      expect(history.canRedo).toBe(true);
    });

    it('should disable redo after executing new command (truncation)', () => {
      const cmd1 = new MockCommand();
      const cmd2 = new MockCommand();
      const cmd3 = new MockCommand();
      history.execute(cmd1);
      history.execute(cmd2);
      history.undo();
      history.execute(cmd3);
      expect(history.canRedo).toBe(false);
    });

    it('should reach start of history after undoing new sequence', () => {
      const cmd1 = new MockCommand();
      const cmd2 = new MockCommand();
      const cmd3 = new MockCommand();
      history.execute(cmd1);
      history.execute(cmd2);
      history.undo(); // Undo cmd2
      history.execute(cmd3); // Overwrite
      
      history.undo(); // Undo cmd3
      history.undo(); // Undo cmd1
      expect(history.canUndo).toBe(false);
    });

    it('should not contain the overwritten command in redo history', () => {
      const cmd1 = new MockCommand();
      const cmd2 = new MockCommand();
      const cmd3 = new MockCommand();
      history.execute(cmd1);
      history.execute(cmd2);
      history.undo(); // Undo cmd2
      history.execute(cmd3); // Overwrite

      history.undo(); // Undo cmd3
      history.undo(); // Undo cmd1
      
      history.redo(); // Redo cmd1
      history.redo(); // Redo cmd3
      // If cmd2 was still there, we might be able to redo again or behavior would be different, 
      // but essentially checking we are at the end now
      expect(history.canRedo).toBe(false);
    });
  });

  describe('Max History Limit', () => {
    it('should allow undo when within limit', () => {
      const smallHistory = new HistoryManager(2);
      const cmd1 = new MockCommand();
      const cmd2 = new MockCommand();
      smallHistory.execute(cmd1);
      smallHistory.execute(cmd2);
      expect(smallHistory.canUndo).toBe(true);
    });

    it('should drop oldest command when exceeding limit', () => {
      const smallHistory = new HistoryManager(2);
      const cmd1 = new MockCommand();
      const cmd2 = new MockCommand();
      const cmd3 = new MockCommand();
      
      smallHistory.execute(cmd1);
      smallHistory.execute(cmd2);
      smallHistory.execute(cmd3);
      
      smallHistory.undo(); // undo cmd3
      smallHistory.undo(); // undo cmd2
      
      // Should be empty now because cmd1 was dropped
      expect(smallHistory.canUndo).toBe(false);
    });

    it('should not allow redoing beyond current tip after dropping history', () => {
      const smallHistory = new HistoryManager(2);
      const cmd1 = new MockCommand();
      const cmd2 = new MockCommand();
      const cmd3 = new MockCommand();
      
      smallHistory.execute(cmd1);
      smallHistory.execute(cmd2);
      smallHistory.execute(cmd3);
      
      smallHistory.undo(); // undo cmd3
      smallHistory.undo(); // undo cmd2
      
      smallHistory.redo(); // redo cmd2
      smallHistory.redo(); // redo cmd3
      
      expect(smallHistory.canRedo).toBe(false);
    });
  });
});
