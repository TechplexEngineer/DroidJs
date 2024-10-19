
<script lang="ts">
    export let label = "";
    export let min = 0;
    export let max = 180;
    export let value = 0;
    export let step = 1;
</script>

<label for="" class="form-label">{label}</label>
<div class="d-flex">
    

    <input type="range" class="form-range" bind:value {min} {max}>

    <div class="input-group">
        <button class="btn btn-primary" type="button" on:click={() => value -= step}>-</button>
        <input type="number" class="form-control" bind:value {min} {max}/>
        <button class="btn btn-primary" type="button"on:click={() => value += step}>+</button>
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