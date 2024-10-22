<script lang="ts">
	import { enhance } from '$app/forms';
	import uFuzzy from '@leeoniya/ufuzzy';
	import type { PageData } from './$types';
	import { debounce } from '$lib/utils/debounce';
	import toast from 'svelte-french-toast';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import ActionButton from '$lib/components/ActionButton.svelte';

	export let data: PageData;
	const matcher = new uFuzzy({});

	let filterValue = '';
	let scriptFiles = data.files;

	const handleChange = (value: string) => {
		if (value == '') {
			scriptFiles = data.files;
			return;
		}
		const matches = matcher.search(data.files, value);
		// console.log('matches', matches);
		if (!matches[0]) return;
		let scriptFilesTmp: string[] = [];
		for (const matchIdx of matches[0]) {
			scriptFilesTmp.push(data.files[matchIdx]);
		}
		scriptFiles = scriptFilesTmp;
	};
	const deb = debounce(handleChange, 250);

	$: deb(filterValue);
</script>

<svelte:head>
	<title>Scripts :: DroidJs</title>
	<meta
		name="description"
		content="Scripts to animate your droids motion with DroidJs Droid Control Software"
	/>
</svelte:head>

<PageHeader title="Script Library">
	<ActionButton
		action="?/stop"
		loading="Stopping..."
		success="All scripts stopped!"
		error="Could not stop scripts"
		actionLabel="Stop All"
		btnClass="btn-warning"
	/>
</PageHeader>

<div class="mb-3">
	<input
		class="form-control"
		type="text"
		placeholder="type to search..."
		bind:value={filterValue}
	/>
</div>

<div class="row row-cols-3">
	{#each scriptFiles as file}
		<div class="col mb-3">
			<div class="card">
				<div class="card-body">
					<a href="/script/edit/{file}" class="stretched-link text-reset text-decoration-none">
						{file}
					</a>
				</div>
			</div>
		</div>
	{/each}
</div>

<style lang="scss">
	.card:hover {
		background-color: #eee;
	}
</style>
