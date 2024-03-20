<script>
  import {BaseDirectory, createDir, writeFile, exists} from "@tauri-apps/api/fs"

  // Will need to do something about duplicate file names
  export let dataToSave;
  let name = "design"

  // First 2 functions adapted from: https://www.matthewtao.com/blog/post/glipma-devlog-2/

  const createDataFolder = async () => {
    try {
      await createDir("data", {
          dir: BaseDirectory.AppData,
          recursive: true,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const writeDataFile = async () => {
    // If the folder doesn't exist, create it.
    if (!(await exists("data", {dir: BaseDirectory.AppData}))) {
      createDataFolder();
    }
    try {
      await writeFile(
      {
          contents: dataToSave,
          path: `data/` + name + `.json`,
      },
      {
          dir: BaseDirectory.AppData,
      },
      );
    } catch (e) {
      console.log(e);
    }
  };


</script>

<div>
  <input type="text"
  class="bg-zinc-100 border rounded px-2 py-0 my-1 border-zinc-300"
  bind:value={name}>
  <button on:click={writeDataFile(name)}
    class="bg-indigo-700 text-white rounded px-4">
    Save</button>
  <!--<p>Save Location: {toString(BaseDirectory.AppData) + `data/` + name + `.json`}</p>-->
</div>