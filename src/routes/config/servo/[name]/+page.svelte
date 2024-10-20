<script lang="ts">
	import { enhance } from '$app/forms';
	import RangeInput from '$lib/components/RangeInput.svelte';
	import { ServoController } from '$lib/motion/servoController';
	import type { PageData } from './$types';

	export let data: PageData;

    let setAngleForm: HTMLFormElement;

    let home = data.servo.home;
    let min = data.servo.min;
    let max = data.servo.max;
</script>

<h1>Servo Editor: <small>{data.servo.name}</small></h1>

<!-- <pre>
{JSON.stringify(data, null, 2)}
</pre> -->

<!-- <form action="?/setAngle" method="POST" use:enhance={() => {
    return async ({ update }) => {
      update({ reset: false });
    };
  }}>
    <div class="mb-3">
        <label class="form-label" for="" >Channel</label>
        <input class="form-control" type="number" name="channel" value={data.servo.channel}>
    </div>
    <div class="mb-3">
        <label class="form-label" for="" >Value</label>
        <input class="form-control" type="number" name="value">
    </div>
    <button class="btn btn-primary mt-3" type="submit">Set</button>
</form> -->


<form action="?/setAngle" method="POST" use:enhance={() => {
    return async ({ update }) => {
      update({ reset: false });
    };
  }} bind:this={setAngleForm}>
    <input type="hidden" name="channel" bind:value={data.servo.channel}>
    <div class="d-flex">
        <RangeInput label="Min" name="value" bind:value={min} class="flex-grow-1"/>
        <div class="ms-2 mt-3">
            <button class="btn btn-primary mt-3" type="submit">Go To</button>
        </div>
    </div>
</form>

<form action="?/setAngle" method="POST" use:enhance={() => {
    return async ({ update }) => {
      update({ reset: false });
    };
  }} bind:this={setAngleForm}>
    <input type="hidden" name="channel" bind:value={data.servo.channel}>
    <div class="d-flex">
        <RangeInput label="Max" name="value" bind:value={max} class="flex-grow-1"/>
        <div class="ms-2 mt-3">
            <button class="btn btn-primary mt-3" type="submit">Go To</button>
        </div>
    </div>
</form>

<form action="?/setAngle" method="POST" use:enhance={() => {
    return async ({ update }) => {
      update({ reset: false });
    };
  }} bind:this={setAngleForm}>
    <input type="hidden" name="channel" bind:value={data.servo.channel}>
    <div class="d-flex">
        <RangeInput label="Home" name="value" bind:value={home} class="flex-grow-1"/>
        <div class="ms-2 mt-3">
            <button class="btn btn-primary mt-3" type="submit">Go To</button>
        </div>
    </div>
</form>

<form action="?/save" method="POST" use:enhance={() => {
    return async ({ update }) => {
      update({ reset: false });
    };
  }} bind:this={setAngleForm}>
    <input type="hidden" name="min" bind:value={min}/>
    <input type="hidden" name="max" bind:value={max}/>
    <input type="hidden" name="home" bind:value={home}/>
    <input type="hidden" name="name" bind:value={data.servo.name}/>
    <input type="hidden" name="channel" bind:value={data.servo.channel}>
    <div class="d-flex">
        
        <div>
            <button type="submit" class="btn btn-success mt-3">Save</button>
        </div>
    </div>
</form> 

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