export interface Memento<State> {
  state: State;
}

export class UndoManager<State> {
  private undoStack: Memento<State>[] = [];
  private redoStack: Memento<State>[] = [];

  constructor(private base: Memento<State>) {}

  execute(memento: Memento<State>) {
    this.undoStack.push(memento);
    this.redoStack = [];
    // console.log(this.toString());
  }

  undo(): State {
    const memento = this.undoStack.pop();
    if (!memento) throw new Error("No more undo states");
    this.redoStack.push(memento);
    const prevMemento = this.undoStack.slice(-1)[0] || this.base;
    // console.log(this.toString());
    return prevMemento.state;
  }

  redo(): State {
    const memento = this.redoStack.pop();
    if (!memento) throw new Error("No more redo states");
    this.undoStack.push(memento);
    // console.log(this.toString());
    return memento.state;
  }

  get canUndo() {
    return this.undoStack.length > 0;
  }

  get canRedo() {
    return this.redoStack.length > 0;
  }

  toString() {
    return `undoStack: ${this.undoStack.length}, redoStack: ${this.redoStack.length}`;
  }
}
