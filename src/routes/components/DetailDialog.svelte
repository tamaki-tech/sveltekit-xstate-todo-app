<script lang="ts">
  import { Input, Button, Modal, Label } from "flowbite-svelte";
  import { createEventDispatcher } from "svelte";
  import type { ActorRefFrom } from "xstate";
  import type { TodoMachine } from "../machines/TodoMachine";
  import { useSelector } from "@xstate/svelte";

  const dispatch = createEventDispatcher();

  export let todoMachine: ActorRefFrom<typeof TodoMachine>;

  const title = useSelector(todoMachine, (state) => state.context.title);
</script>

<Modal open size="xs" class="w-full" permanent>
  <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Edit</h3>
  <Label class="space-y-2">
    <span>Title</span>
    <Input type="text" name="title" required value={$title} />
  </Label>
  <Button class="w-full1" on:click={() => dispatch("close")}>Close</Button>
</Modal>
