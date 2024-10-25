<script lang="ts">
	import { page } from '$app/stores';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	import { enhance } from '$app/forms';
	import toast from 'svelte-french-toast';
	import type { Action } from 'svelte/action';

	//@todo use actio
	const myEnhance: Action<HTMLFormElement, { loading: string; success: string; error: string }> = (
		formElement,
		{ loading, success, error }
	) => {
		return enhance(formElement, () => {
			let doneHandler;
			toast.promise(
				new Promise((resolve, reject) => {
					doneHandler = async ({ result }) => {
						if (Math.floor(result.status / 100) == 2) resolve('');
						else {
							reject();
						}
					};
				}),
				{
					loading,
					success,
					error
				}
			);

			return doneHandler;
		});
	};
</script>

<svelte:head>
	<title>{$page.params.name} :: Script Editor :: DroidJs</title>
	<meta
		name="description"
		content="Scripts to animate your droids motion with DroidJs Droid Control Software"
	/>
</svelte:head>

<form
	method="POST"
	use:myEnhance={{
		loading: 'Saving...',
		success: 'Script Saved',
		error: 'Unable to save changes'
	}}
>
	<PageHeader title={`Edit Script '${$page.params.name}'`}>
		<div>
			<button formaction="?/save" class="btn btn-primary" type="submit">Save</button>

			<!-- <button formaction="?/run" class="btn btn-success" type="submit">Run</button> -->
		</div>
	</PageHeader>

	<textarea class="form-control" bind:value={data.script} name="script" />
</form>

<style>
	textarea {
		min-height: 500px;
	}
</style>
