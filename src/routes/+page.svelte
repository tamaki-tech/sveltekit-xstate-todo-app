<script lang="ts">
  import { useSelector } from "@xstate/svelte";
  import { interpret } from "xstate";
  import {
    Table,
    TableBody,
    TableHead,
    TableHeadCell,
    Checkbox,
    Input,
    Button,
    Progressbar,
  } from "flowbite-svelte";
  import TodoItemRow from "./components/TodoItemRow.svelte";
  import DetailDialog from "./components/DetailDialog.svelte";
  import { TodoListMachine } from "./machines/TodoListMachine";

  const machine = interpret(TodoListMachine()).start();

  const todos = useSelector(machine, (state) => state.context.todos);
  const progress = useSelector(machine, (state) => state.context.progress);
  const selectedTodo = useSelector(machine, (state) => state.context.selected);
  const isOpenDetail = useSelector(machine, (state) =>
    state.matches("SHOW_DETAIL")
  );

  let value = "";

  const addTodo = () => {
    machine.send({ type: "CREATE", title: value });
    value = "";
  };
</script>

{#if $selectedTodo && $isOpenDetail}
  <DetailDialog
    todoMachine={$selectedTodo}
    on:close={() => machine.send("CLOSE")}
  />
{/if}

<div class="py-4 flex flex-row gap-2">
  <Input placeholder="Input new task name..." bind:value />
  <Button disabled={!value} on:click={addTodo}>Add</Button>
</div>

<div class="py-4">
  <Progressbar progress={`${$progress}`} />
</div>

<div class="py-4">
  <Table hoverable={true}>
    <TableHead>
      <TableHeadCell class="!p-4">
        <Checkbox />
      </TableHeadCell>
      <TableHeadCell>Title</TableHeadCell>
      <TableHeadCell>
        <span class="sr-only">Edit</span>
      </TableHeadCell>
    </TableHead>
    <TableBody tableBodyClass="divide-y">
      {#each $todos as todo}
        <TodoItemRow
          todoMachine={todo}
          on:click={(event) =>
            machine.send({ type: "OPEN_DETAIL", id: event.detail.id })}
        />
      {/each}
    </TableBody>
  </Table>
</div>
