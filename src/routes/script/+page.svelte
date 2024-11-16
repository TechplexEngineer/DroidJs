<script lang="ts">
	import { enhance } from '$app/forms';
	import uFuzzy from '@leeoniya/ufuzzy';
	import type { PageData } from './$types';
	import { debounce } from '$lib/utils/debounce';
	import toast from 'svelte-french-toast';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import ActionButton from '$lib/components/ActionButtonToast.svelte';
	import SearchableGridLayout from '$lib/components/SearchableGridLayout.svelte';
	import { page } from '$app/stores';

	export let data: PageData;
</script>

<svelte:head>
	<title>Scripts :: DroidJs</title>
	<meta
		name="description"
		content="Scripts to animate your droids motion with DroidJs Droid Control Software"
	/>
</svelte:head>
<div class="container">
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

	<SearchableGridLayout items={data.files} let:file>
		<div class="d-flex align-items-center">
			<div class="flex-grow-1">{file}</div>
			<a href="{$page.route.id}/edit/{file}" class="btn btn-outline-secondary">Edit</a>
			<form action="?/run" method="POST" use:enhance>
				<input type="hidden" name="filename" value={file} />
				<button class="btn btn-outline-primary ms-2">Run</button>
			</form>
		</div>

		<!-- <a href="{$page.route.id}/edit/{file}" class="stretched-link text-reset text-decoration-none">
		</a> -->
	</SearchableGridLayout>
</div>
