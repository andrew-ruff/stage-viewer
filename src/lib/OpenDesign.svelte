<script>
  import { open } from '@tauri-apps/api/dialog';
  import { readTextFile, BaseDirectory } from '@tauri-apps/api/fs';
  import { loadedStage } from '../stores.js';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  const openDataFolder = async () => {
    let parsed;
    let contents;
    try {
      const path = await open({
        multiple: false,
        title: "Open Saved Design",
        defaultPath: ".",
      });
      contents = await readTextFile(path);
      parsed = JSON.parse(contents);
    } catch (err) {
      console.error(err);
    }
    // Some simple input validation
    if (parsed && typeof(parsed === "object")) {
      $loadedStage = parsed;
      dispatch('update', {
        text: 'Test'
      });
      console.log("Dispatched stage update message!");
    }
  }

</script>

<div>
  <button
  class="bg-zinc-200 text-zinc-800 rounded px-4 my-1"
  on:click={openDataFolder}>Open File</button>
</div>