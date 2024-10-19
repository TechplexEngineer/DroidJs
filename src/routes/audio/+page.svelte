<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	export let data: PageData;

	let volumeForm: HTMLFormElement;
</script>

<svelte:head>
	<title>Audio :: DroidJs</title>
	<meta name="description" content="Make your droid speak DroidJs Droid Control Software" />
</svelte:head>

<form method="POST" action="?/setVolume" bind:this={volumeForm} use:enhance>
	<label for="volume" class="form-label">Volume</label>
	<div class="d-flex">
		<input type="range" class="form-range" min="0" max="100" name="volume" value={data.volume} on:change={() => volumeForm.requestSubmit()}>
		<input type="number" class="form-control" name="volumeNum" id="" value={data.volume} style="max-width: 75px; margin-left: 25px; margin-top: -7px">
	</div>
</form>

<form method="POST" action="?/stop" use:enhance>
	<button type="submit" class="btn btn-danger">Stop</button>
</form>

{#each data.files as file}
	<ul>
		<li>
			<form method="POST" action="?/play" use:enhance>
				{file}
				<input type="hidden" name="filename" value={file} />
				<button type="submit" class="btn btn-outline-primary">Play</button>
			</form>
		</li>
	</ul>
{/each}
