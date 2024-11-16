<script lang="ts">
	import { enhance } from '$app/forms';
	import ActionButtonToast from '$lib/components/ActionButtonToast.svelte';
	import { getEnhanceFn } from '$lib/components/actionEnhance';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import SearchableGridLayout from '$lib/components/SearchableGridLayout.svelte';
	import { groupSounds } from '$lib/sound/groupSounds';

	import type { PageData } from './$types';

	export let data: PageData;

	let volumeForm: HTMLFormElement;

	let categories = groupSounds(data.files);
</script>

<svelte:head>
	<title>Audio :: DroidJs</title>
	<meta name="description" content="Make your droid speak DroidJs Droid Control Software" />
</svelte:head>

<div class="container">
	<PageHeader title="Audio">
		<form method="POST" action="?/stop" use:enhance>
			<button type="submit" class="btn btn-danger">Stop</button>
		</form>
	</PageHeader>

	<form method="POST" action="?/setVolume" bind:this={volumeForm} use:enhance class="mb-3">
		<div class="d-flex">
			<label for="volume" class="form-label me-3">Volume</label>
			<input
				type="range"
				class="form-range"
				min="0"
				max="100"
				name="volume"
				value={data.volume}
				on:change={() => volumeForm.requestSubmit()}
			/>
			<input
				type="number"
				class="form-control"
				name="volumeNum"
				id=""
				value={data.volume}
				style="max-width: 75px; margin-left: 25px; margin-top: -7px"
			/>
		</div>
	</form>

	{#if categories}
		<ul class="nav nav-pills mb-4">
			{#each Object.keys(categories)
				.filter((c) => c.length > 0)
				.sort() as category}
				<ActionButtonToast
					action="?/playRandom"
					loading="Playing..."
					success={(result) => {
						const msg = `Played: ${result.data.message}`;
						console.log(msg);
						return msg;
					}}
					error={(result) => {
						return result.data.message
							? `Error: ${result.data.message}`
							: 'Unable to play random sound';
					}}
					actionLabel={category}
					btnClass="btn-outline-primary"
					title="Play random song"
					class="me-2 mb-2"
				>
					<input type="hidden" name="category" value={category} />
				</ActionButtonToast>
			{/each}
		</ul>
	{/if}

	<SearchableGridLayout items={data.files} let:file>
		<form
			method="POST"
			action="?/play"
			use:enhance={getEnhanceFn(
				'Playing...4',
				(result) => {
					const msg = `Played: ${result.data.message}`;
					console.log(msg);
					return msg;
				},
				(result) => {
					return result.data.message
						? `Error: ${result.data.message}`
						: 'Unable to play random sound';
				}
			)}
		>
			<input type="hidden" name="filename" value={file} />
			<button type="submit" class="btn btn-link text-reset text-decoration-none stretched-link"
				>{file}</button
			>
		</form>
	</SearchableGridLayout>
</div>
