<script>
  import "../app.css";
</script>

<style lang="postcss">
  :global(html) {
    background-color: theme(colors.zinc.100);
  }
</style>

<header class="bg-zinc-200 px-4 py-2">
  <h1 class="text-5xl text-zinc-900 font-semibold">Stage Viewer</h1>
</header>

<div class="md:container md:mx-lg my-4">
<slot></slot>
</div>

<footer class="bg-zinc-200 px-2 my-4">
  <p class="text-zinc-700">
    Stage images are from Tournameta's
    <a href="https://www.tournameta.com/stage-comparison/"
      class="text-zinc-900 hover:underline">
    Ultimate Stage Comparison Tool</a>.
    <br />
    Block textures are from the
    <a href="https://www.curseforge.com/minecraft/texture-packs/coterie-craft-16x"
      class="text-zinc-900 hover:underline">
    Coterie Craft texture pack</a>, licensed under
    <a href="https://creativecommons.org/licenses/by-nc/4.0/"
      class="text-zinc-900 hover:underline">CC BY-NC 4.0</a>.
    <br />
    NOT AN OFFICIAL MINECRAFT PRODUCT.
    NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT.
  </p>
</footer>
  
  