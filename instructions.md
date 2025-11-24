# Front-End Assignment: Shape Canvas Editor

Build a small web application where the user can create and manipulate shapes on a canvas.  
The focus of this assignment is **architecture**, **scalability**, and a **reusable undo/redo system**.  
UI polish is not required.

---

## Requirements

### Canvas & Shapes
- Provide a central canvas area (this can be a simple `div` with absolutely positioned elements; an HTML `<canvas>` is not required).
- Support **Rectangle** shapes.
- Each shape must have:
  - Position  
  - Fill color  

**Note:** Your code architecture should make it straightforward to add new shape types and new editable shape properties in the future. For this assignment, only the position and fill color need to be editable; all other properties can remain preset.

---

## User Actions (all must be undoable/redoable)

- Add Shape (Rectangle)
- Select Shape
- Move Shape  
  - Using numeric inputs (e.g. x/y fields). No drag-and-drop.
- Change Color
- Delete Shape

---

## Undo / Redo System

- Provide Undo and Redo buttons.
- Keyboard shortcuts:
  - **Undo:** Ctrl/Cmd + Z  
  - **Redo:** Ctrl/Cmd + Shift + Z

### Architecture Requirements
- Implement the undo/redo mechanism as a **reusable, plug-and-play module**.
  - It must not be tied specifically to the canvas.
  - It should be usable for other components or features.
- Use a **scalable state structure** that will remain maintainable as:
  - Shape count grows  
  - Shape types expand  
  - Interaction complexity increases  

The system should clearly support future extension for:
- Additional shape types  
- Additional keyboard shortcuts  

---

## Technical Requirements

- Use **TypeScript** with meaningful types for:
  - Shape models  
  - Undo/redo actions  
  - Canvas state
- Do not use any out-of-the-box undo/redo libraries or helpers
  - The undo/redo mechanism must be implemented by the candidate.
- Include a short **README** explaining:
  - High-level architecture overview  
  - Undo/redo design and how it can be reused  
  - How the state structure supports scaling  
  - Brief project structure and reasoning 

---

## Submission

Submit a link to a GitHub repository containing:
- TypeScript source code  
- Unit tests  
- README  