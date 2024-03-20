<!--
The drawable canvas containing the stage and blocks
TODO:
Dynamic sizing with clean scaling
Use raw stage images with superimposed grid 
-->
<script>
  import { onMount } from "svelte";
  import { writeTextFile, BaseDirectory } from "@tauri-apps/api/fs";
  // May need to import fd to use the variable in CSS
  import dirtTex from '$lib/blocks/dirt.png';
  import sandTex from '$lib/blocks/sand.png';
  import iceTex from '$lib/blocks/ice.png';
  import woolTex from '$lib/blocks/white_wool.png';
  import woodTex from '$lib/blocks/oak_planks.png';
  import stoneTex from '$lib/blocks/stone.png';
  import ironTex from '$lib/blocks/iron_block.png';

  import SaveDesign from "./SaveDesign.svelte";
  import OpenDesign from "./OpenDesign.svelte";
  import stages from '$lib/stages.json';
  import { loadedStage } from '../stores.js';
  /*
  It feels silly to import all images manually, but if I used JSON they'd have
  to be put in static instead of lib to have a reliable URL. If I did that, it
  would disable the hash-based caching that Vite uses when serving non-static
  images, which would increase the amount of images served.
  */
  import bf from '$lib/stages/bf.png';
  import fd from '$lib/stages/fd.png';
  import { head_selector } from "svelte/internal";

  // Same order as JSON file
  const stageImgs = [
    bf,
    fd
  ];

  let nothing;
  let dirt;
  let sand;
  let ice;
  let wool;
  let wood;
  let stone;
  let iron;
  
  let bgImage = stageImgs[0];

  let tool = "dirt";
  let canvas;
  let ctx;
  let isDrawing = false;

  let materials;
  let stageGrid;

  let blockWidth;
  let blockHeight;
  let gridOffsetLeft;
  let gridOffsetTop;

  let canvasWidth = 1154;
  let canvasHeight = 610;

  // May export this as prop to allow initialization to different stages - could be useful with saving/loading.
  // Could be the main way of changing stage - not sure if there are performance penalties to that.
  let stage = 0;

  function createArray(length) {
    var arr = new Array(length || 0),
    i = length;

    if (arguments.length > 1) {
      var args = Array.prototype.slice.call(arguments, 1);
      while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }
    return arr;
  }


  onMount(() => {
    ctx = canvas.getContext("2d");

    // There has to be a better way than 3 steps per image
    nothing = new Image();
    dirt = new Image();
    sand = new Image();
    // Ice transparency means multiple draws on a tile stack, make non-transparent version?
    ice = new Image();
    wool = new Image();
    wood = new Image();
    stone = new Image();
    iron = new Image();
    dirt.src = dirtTex;
    sand.src = sandTex;
    ice.src = iceTex;
    wool.src = woolTex;
    wood.src = woodTex;
    stone.src = stoneTex;
    iron.src = ironTex;
    ctx.imageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;

    // Create array with same dims as the current map. This will store drawing.
    stageGrid = createArray(stages[stage]['map'].length, stages[stage]['map'][0].length);
    for (let i = 0; i < stageGrid.length; i++) {
      for (let j = 0; j < stageGrid[0].length; j++) {
        stageGrid[i][j] = 0;
      }
    }



    materials = {
      "nothing": {
        "number": 0,
        "image": nothing
      },
      "dirt": {
        "number": 1,
        "image": dirt
      },
      "sand": {
        "number": 1,
        "image": sand
      },
      "ice": {
        "number": 1,
        "image": ice
      },
      "wool": {
        "number": 1,
        "image": wool
      },
      "wood": {
        "number": 2,
        "image": wood
      },
      "stone": {
        "number": 3,
        "image": stone
      },
      "iron": {
        "number": 4,
        "image": iron
      }
    };

    
    // DEBUG:
    console.log("Current Stage Info:");
    console.log(stages[stage]["title"]);
    console.log(stages[stage]["image"]);
    change_stage(0);
    console.log("New Stage Info:");
    console.log(stages[stage]["title"]);
    console.log(stages[stage]["image"]);
  });



  function start_draw(e) {
    isDrawing = true;
    draw(e);
  }

  

  function end_draw() {
    isDrawing = false;
  }

  function draw(e) {
    // console.log(e);
    // console.log("Click at: " + e.clientX + ", " + e.clientY);
    let x = e.clientX - canvas.offsetLeft;
    let y = e.clientY - canvas.offsetTop;
    // console.log("Adjusted position: " + x + ", " + y);
    // Convert canvas-relative pixel coords to block grid coords, may be better as independent function
    // This is slightly inefficient for use in only this function but these values will be used to create a saveable text file
    x -= gridOffsetLeft;
    y -= gridOffsetTop;
    x = Math.floor(x/blockWidth);
    y = Math.floor(y/blockHeight);
    // console.log("Block-grid position: " + x + ", " + y);
    // Obtain top left pixel of square to be drawn
    let drawX = (x*blockWidth) + gridOffsetLeft;
    let drawY = (y*blockHeight) + gridOffsetTop;
    // console.log("Draw position: " + drawX + ", " + drawY);
    // Draw a rectangle of height blockHeight and width blockWidth at drawX,drawY
    if (stages[stage]['map'][y][x] > 0 && isDrawing) {
      // This conditional produces errors if the click location is outside the grid defined by the text file. This produces the desired result, but is a bit messy. May add a condition to ensure that click location is within the main grid.
      if (tool == 'eraser') {
        // console.log("Should have erased something");
        ctx.clearRect(drawX, drawY, blockHeight, blockWidth);
        stageGrid[y][x] = 0;
      }
      else {
        // console.log("Should have drawn something");
        try {
          ctx.drawImage(materials[tool]['image'], drawX, drawY, blockWidth, blockHeight);
        } catch (err) {
          console.error(err);
        }
        stageGrid[y][x] = materials[tool]['number'];
      }
      // ctx.fillStyle = 'red';
      // console.log('Unexpected tool selection!');
      // ctx.fillRect(drawX, drawY, blockHeight, stages[stage]["blockHeight"]);
    }
  }

  function change_stage(stageNum) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // console.log(stageNum);
    stage = stageNum;
    bgImage = stageImgs[stageNum];
    if (tool == "dirt" || tool == "sand" || tool == "ice" || tool == "wool") {
      tool = stages[stage]["baseMat"];
    }
    let hCenter = stages[stage]["hRes"] / 2.0;
    // 114 is empirical fudge factor to compensate for less crop from top
    let vCenter = stages[stage]["vRes"] / 2.0 + stages[stage]["centerOffset"];
    console.log("hCenter type: " + typeof(hCenter) + " Value: " + hCenter);
    console.log("hCenter type: " + typeof(vCenter) + " Value: " + vCenter);
    blockWidth = (hCenter - stages[stage]["hLandmarkPX"]) / stages[stage]["hLandmarkBFC"];
    blockHeight = blockWidth;
    // blockHeight = (vCenter - stages[stage]["vLandmarkPX"]) / stages[stage]["vLandmarkBFC"];
    // Calculate pixel width of # of blocks from center to edge
    let hEdgeDist = stages[stage]["hCenterB"] * blockWidth;
    let vEdgeDist = stages[stage]["vCenterB"] * blockHeight;
    // Sub that from center to find edge
    gridOffsetLeft = hCenter - hEdgeDist;
    gridOffsetTop = vCenter - vEdgeDist;
    // console.log("Block width: " + blockWidth + " Block height: " + blockHeight);
    canvas.width = stages[stage]["hRes"];
    canvas.height = stages[stage]["vRes"];
    ctx.imageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
  }

  function clear_stage(canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < stageGrid.length; i++) {
      for (let j = 0; j < stageGrid[0].length; j++) {
        stageGrid[i][j] = 0;
      }
    }
  }

  function updateStage(canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < stageGrid.length; i++) {
      for (let j = 0; j < stageGrid[0].length; j++) {
        if (stageGrid[i][j] != 0) {
          let drawX = (j*blockWidth) + gridOffsetLeft;
          let drawY = (i*blockHeight) + gridOffsetTop;
          ctx.drawImage(materials[tool]['image'], drawX, drawY, blockWidth, blockHeight);
        }
      }
    }
  }

  function loadDesign(canvas) {
    console.log("Design update message received!");
    change_stage($loadedStage["stage"]);
    stageGrid = $loadedStage["design"].slice();
    updateStage(canvas);
  }
  // No UI framework yet but I plan on using Tailwind CSS once this project is more feature-complete.
  
  let designData;
  $: designData = {
    stage: stage,
    design: stageGrid,
  };

</script>


<canvas
  style="background-image: url({bgImage})"
  bind:this={canvas}
  on:mousedown={(e) => start_draw(e)}
  on:mousemove={(e) => draw(e)}
  on:mouseleave={() => end_draw()}
  on:mouseup={() => end_draw()}

  width=1090
  height=674
>
  <p>You must have JavaScript enabled and a browser that supports the Canvas HTML element to use this tool.</p>
</canvas>

<div
class="space-x-1 space-top-2 capitalize columns-4xs"
>
  <div>
    <input type="radio" name="tool" value={stages[stage]["baseMat"]} bind:group={tool} checked
    class="appearance-none checked:bg-indigo-700 hover:bg-indigo-200 active:bg-indigo-700 focus:bg-indigo-700
    hover:shadow-inner text-indigo-700 focus-visible:ring-offset-indigo-700 focus-visible:ring-offset-2">
    <label for={stages[stage]["baseMat"]}>{stages[stage]["baseMat"]}</label>
  </div>
  <div>
    <input type="radio" name="tool" value="wood" bind:group={tool}
    class="appearance-none checked:bg-indigo-700 hover:bg-indigo-200 active:bg-indigo-700 focus:bg-indigo-700
    hover:shadow-inner text-indigo-700 focus-visible:ring-offset-indigo-700 focus-visible:ring-offset-2">
    <label for="wood">wood</label>
  </div>
  <div>
    <input type="radio" name="tool" value="stone" bind:group={tool}
    class="appearance-none checked:bg-indigo-700 hover:bg-indigo-200 active:bg-indigo-700 focus:bg-indigo-700
    hover:shadow-inner text-indigo-700 focus-visible:ring-offset-indigo-700 focus-visible:ring-offset-2">
    <label for="stone">stone</label>
  </div>
  <div>
    <input type="radio" name="tool" value="iron" bind:group={tool}
    class="appearance-none checked:bg-indigo-700 hover:bg-indigo-200 active:bg-indigo-700 focus:bg-indigo-700
    hover:shadow-inner text-indigo-700 focus-visible:ring-offset-indigo-700 focus-visible:ring-offset-2">
    <label for="iron">iron</label>
  </div>
  <div>
    <input type="radio" name="tool" value="eraser" bind:group={tool}
    class="appearance-none checked:bg-indigo-700 hover:bg-indigo-200 active:bg-indigo-700 focus:bg-indigo-700
    hover:shadow-inner text-indigo-700 focus-visible:ring-offset-indigo-700 focus-visible:ring-offset-2">
    <label for="eraser">eraser</label>
  </div>
  <button on:click={clear_stage(canvas)}
    class="bg-zinc-200 text-zinc-800 rounded px-4"
  >Clear</button>
  <!--<button on:click={console.log(stageGrid)}>Log State</button>-->
</div>
<select
class="bg-[url(data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e)]
bg-zinc-100 border rounded px-2 py-0 my-1 border-zinc-300 w-80"
bind:value={stage}
on:change={() => change_stage(stage)}
>
    {#each stages as stg}
        <option value={stg.id}>{stg.title}</option>
    {/each}
</select>
<SaveDesign dataToSave={JSON.stringify(designData)}></SaveDesign>

<OpenDesign on:update={loadDesign(canvas)} />

  <!--<p>{stageGrid}</p>-->
<style>
</style>