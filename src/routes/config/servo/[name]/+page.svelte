<script lang="ts">
	import { enhance } from '$app/forms';
	import RangeInput from '$lib/components/RangeInput.svelte';
	import { ServoController } from '$lib/motion/servoController';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1>Servo Editor: <small>{data.servo.name}</small></h1>

<!-- {JSON.stringify(data)} -->

<form action="?/setAngle" use:enhance>
    <div class="mb-3">
        <label class="form-label" for="" >Channel</label>
        <input class="form-control" type="number" name="channel" value={data.servo.channel}>
    </div>
    <div class="mb-3">
        <label class="form-label" for="" >Value</label>
        <input class="form-control" type="number" name="value">
    </div>
    <button class="btn btn-primary mt-3" type="submit">Set</button>
</form>

<!-- <RangeInput label="Current" value={data.servo.home} /> -->
<!-- <RangeInput label="Max" />
<RangeInput label="Home" /> -->

<!-- <div class="mb-3">
    <label for="exampleFormControlInput1" class="form-label">Max</label>
    <div class="input-group">
        <button class="btn btn-outline-primary" type="button">+</button>
        <input type="text" class="form-control" />
        <button class="btn btn-outline-primary" type="button">-</button>
    </div>
</div>

<div class="mb-3">
    <label for="exampleFormControlInput1" class="form-label">Home</label>
    <div class="input-group">
        <button class="btn btn-outline-primary" type="button">+</button>
        <input type="text" class="form-control" />
        <button class="btn btn-outline-primary" type="button">-</button>
    </div>
</div> -->