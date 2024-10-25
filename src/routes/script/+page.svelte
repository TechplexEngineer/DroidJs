<script lang="ts">
	import { enhance } from '$app/forms';
	import uFuzzy from '@leeoniya/ufuzzy';
	import type { PageData } from './$types';
	import { debounce } from '$lib/utils/debounce';
	import toast from 'svelte-french-toast';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import ActionButton from '$lib/components/ActionButtonToast.svelte';
	import SearchableGridLayout from '$lib/components/SearchableGridLayout.svelte';

	export let data: PageData;
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

<SearchableGridLayout items={data.files} />
