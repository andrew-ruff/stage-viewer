<!--Simple component that allows a choice between all stages and dispatches
the ID of the new stage when the stage selection is changed. 
CURRENTLY UNUSED-->
<script>
    import stages from '$lib/stages.json';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher;

    let selected = 1;

    function new_stage(newStage) {
        dispatch(newStage);
    }
</script>

<label for="stage-select">Choose a stage:</label>

<div>
<select
class="bg-zinc-100 border rounded px-2 py-0 my-1 border-zinc-300 bg-none"
bind:value={selected}
on:change={() => dispatch(selected)}>
    {#each stages as stg}
        <option value={stg.id}>{stg.title}</option>
    {/each}
</select>
</div>
<!--<p>DEBUG: Current selection is: {selected}</p>-->