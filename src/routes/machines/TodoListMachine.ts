import { assign, createMachine, spawn, type ActorRefFrom } from "xstate";
import { TodoMachine } from "./TodoMachine";

interface TodoListContext {
  todos: ActorRefFrom<typeof TodoMachine>[];
  selected?: ActorRefFrom<typeof TodoMachine>;
  progress: number;
}

const calcProgress = (todos: ActorRefFrom<typeof TodoMachine>[]) => {
  const completes = todos.filter((t) => t.getSnapshot()?.matches("COMPLETE"));
  return (completes.length / todos.length) * 100;
};

export const TodoListMachine = () =>
  createMachine<TodoListContext>(
    {
      id: "todoList",
      context: {
        todos: [],
        selected: undefined,
        progress: 0,
      },
      initial: "SHOW_LIST",
      states: {
        SHOW_LIST: {
          on: {
            CREATE: {
              actions: "createTodo",
            },
            UPDATE: {
              actions: "updateProgress",
            },
            OPEN_DETAIL: {
              actions: "selectTodo",
              target: "SHOW_DETAIL",
            },
          },
        },
        SHOW_DETAIL: {
          on: {
            CLOSE: "SHOW_LIST",
            UPDATE: "UPDATE_TODO",
          },
        },
        UPDATE_TODO: {
          invoke: {
            src: "updateTodoDetail",
            onDone: "SHOW_LIST",
            onError: "SHOW_DETAIL",
          },
        },
      },
    },
    {
      actions: {
        createTodo: assign((ctx, event) => ({
          todos: [
            ...ctx.todos,
            spawn(
              TodoMachine({ id: ctx.todos.length + 1, title: event.title })
            ),
          ],
        })),

        updateProgress: assign((ctx) => ({
          progress: calcProgress(ctx.todos),
        })),

        selectTodo: assign((ctx, event) => ({
          selected: ctx.todos.find((todo) => todo.id === event.id.toString()),
        })),
      },
      services: {
        updateTodoDetail: async () => console.log("hogehoge"),
      },
    }
  );
