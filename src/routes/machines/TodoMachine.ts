import { createMachine, sendParent } from "xstate";

interface TodoContext {
  id: number;
  title: string;
}

export const TodoMachine = (context: TodoContext) =>
  createMachine<TodoContext>({
    id: `todo-${context.id}`,
    context,
    initial: "INCOMPLETE",
    states: {
      INCOMPLETE: {
        entry: sendParent("UPDATE"),
        on: {
          TOGGLE: "COMPLETE",
        },
      },
      COMPLETE: {
        entry: sendParent("UPDATE"),
        on: {
          TOGGLE: "INCOMPLETE",
        },
      },
    },
  });
