
<script lang="ts">
	import { debounce } from '$lib/utils/debounce';
    export let label = "";
    export let name: string|null = null;
    export let min = 0;
    export let max = 180;
    export let value = 0;
    export let step = 1;
    let className = ''
    export { className as class }
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    const debounceDispatch = debounce(dispatch, 250);
    $: debounceDispatch('change', value)
</script>
<div class={className}>
    <label for="" class="form-label">{label}</label>
    <div class="d-flex">
        

        <input type="range" class="form-range" bind:value {min} {max}/>

        <div class="input-group">
            <button class="btn btn-primary" type="button" on:click={() => value -= step}>-</button>
            <input type="number" class="form-control" bind:value {min} {max} {name}/>
            <button class="btn btn-primary" type="button" on:click={() => value += step}>+</button>
        </div>
    </div>
</div>

<style>
    .input-group {
        display: flex;
        align-items: center;
        max-width: 150px;
        margin-left: 25px;
    }
    input[type="number"] {
        text-align: center;
    }
</style>