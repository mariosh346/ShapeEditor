# Shape Canvas Editor

A Vue 3 + TypeScript application that implements a reusable Undo/Redo system using the Command Pattern.

## High-Level Architecture

The application uses **Vue 3** for the UI and **Pinia** for state management. The architecture separates concerns into three main layers:

1.  **UI Components (`src/components`)**: Pure presentation layers that render data from the store and emit events or call store actions.
2.  **State Management (`src/store`)**: The Pinia store (`canvasStore`) acts as the single source of truth. It handles business logic but delegates actual state mutations to the Command system.
3.  **Command System (`src/model`, `src/core`)**: Encapsulates all user actions as objects. This decoupling allows the Undo/Redo mechanism to operate independently of the specific logic it controls.

## Undo/Redo Design (Command Pattern)

The undo/redo functionality is built from scratch using the **Command Design Pattern**.

### Core Components

-   **`ICommand` Interface**: Defines the contract (`execute()` and `undo()`) that all actions must satisfy.
-   **`HistoryManager`**: A generic, standalone class responsible for:
    -   Maintaining the stack of executed commands.
    -   Managing the pointer to the current state.
    -   Handling undo/redo traversals.
    -   Truncating history when new actions diverge from a previous undo point.

### Reusability

The `HistoryManager` is completely agnostic of the application domain. It can be reused in any part of the application (or other applications) simply by passing it objects that implement `ICommand`.

```typescript
// Example of reuse
class MyCustomAction implements ICommand {
  execute() { /* do something */ }
  undo() { /* reverse it */ }
}
history.execute(new MyCustomAction());
```

## Scalable State Structure

To ensure performance and maintainability as the number of shapes grows, the state is **normalized**:

```typescript
state: {
  shapes: Record<string, Shape>; // O(1) lookup by ID
  layerOrder: string[];          // Array of IDs defining render order
  selectedId: string | null;
}
```

### Why this supports scaling:
1.  **O(1) Access**: Finding a specific shape to update or delete takes constant time, regardless of how many shapes exist.
2.  **Separation of Concerns**: Rendering order (`layerOrder`) is managed separately from shape data. Reordering layers is efficient (array manipulation) without needing to mutate shape objects.
3.  **Memory Efficiency**: Shapes are stored once in the dictionary, preventing duplication.

## Project Structure

-   `src/core`: Contains the generic `HistoryManager`. This is "infrastructure" code.
-   `src/model`: Contains the concrete Command implementations (`AddShapeCommand`, `MoveShapeCommand`, etc.) specific to the business domain.
-   `src/store`: Ties the core logic and models together, exposing a reactive API to the UI.
-   `src/components`: Vue components (`CanvasBoard`, `PropertyPanel`).

## Running the Project

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Run development server:
    ```bash
    npm run dev
    ```
3.  Run tests:
    ```bash
    npm run test
    ```
