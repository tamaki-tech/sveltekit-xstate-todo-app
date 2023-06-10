<script lang="ts">
  import { useSelector } from "@xstate/svelte";
  import { TableBodyCell, TableBodyRow, Checkbox } from "flowbite-svelte";
  import type { ActorRefFrom } from "xstate";
  import type { TodoMachine } from "../machines/TodoMachine";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher<{ click: { id: number } }>();

  export let todoMachine: ActorRefFrom<typeof TodoMachine>;

  const isDone = useSelector(todoMachine, (state) => state.matches("COMPLETE"));
  const title = useSelector(todoMachine, (state) => state.context.title);
  const id = useSelector(todoMachine, (state) => state.context.id);
</script>

<TableBodyRow>
  <TableBodyCell class="!p-4">
    <Checkbox
      checked={$isDone}
      on:click={() => todoMachine.send({ type: "TOGGLE" })}
    />
  </TableBodyCell>
  <TableBodyCell tdClass:line-through={$isDone}>
    <span class:line-through={$isDone}>{$title}</span>
  </TableBodyCell>
  <TableBodyCell>
    <button
      class="cursor-pointer font-medium text-blue-600 hover:underline dark:text-blue-500"
      on:click={() => dispatch("click", { id: $id })}
    >
      Edit
    </button>
  </TableBodyCell>
</TableBodyRow>
