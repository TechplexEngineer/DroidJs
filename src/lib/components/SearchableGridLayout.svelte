<script lang="ts">
	import { page } from '$app/stores';
	import { debounce } from '$lib/utils/debounce';
	import uFuzzy from '@leeoniya/ufuzzy';
	const matcher = new uFuzzy({});

	export let items: string[];

	let scriptFiles = items;
	let filterValue = '';

	const deb = debounce((value: string) => {
		if (value == '') {
			scriptFiles = items;
			return;
		}
		const matches = matcher.search(items, value);
		// console.log('matches', matches);
		if (!matches[0]) return;
		let scriptFilesTmp: string[] = [];
		for (const matchIdx of matches[0]) {
			scriptFilesTmp.push(items[matchIdx]);
		}
		scriptFiles = scriptFilesTmp;
	}, 250);

	$: deb(filterValue);

	export let categories: string[] | undefined;
</script>

<div class="input-group mb-3">
	<input
		class="form-control"
		type="text"
		placeholder="type to search..."
		bind:value={filterValue}
	/>
	<button
		class="btn btn-outline-primary pt-0"
		type="button"
		title="clear"
		on:click={() => {
			filterValue = '';
		}}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			fill="currentColor"
			class="bi bi-eraser"
			viewBox="0 0 16 16"
		>
			<path
				d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828zm2.121.707a1 1 0 0 0-1.414 0L4.16 7.547l5.293 5.293 4.633-4.633a1 1 0 0 0 0-1.414zM8.746 13.547 3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293z"
			/>
		</svg>
	</button>
</div>

{#if categories}
	<ul class="nav nav-pills">
		{#each categories.filter((c) => c.length > 0) as category}
			<button
				class="btn btn-sm btn-outline-primary fs-6 me-1"
				on:click={() => {
					filterValue = category;
				}}
			>
				{category}
			</button>
		{/each}
	</ul>
{/if}

<div class="row row-cols-3">
	{#each scriptFiles as file}
		<div class="col mb-3">
			<div class="card">
				<div class="card-body">
					<slot {file}>
						<a
							href="{$page.route.id}/edit/{file}"
							class="stretched-link text-reset text-decoration-none"
						>
							{file}
						</a>
					</slot>
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
