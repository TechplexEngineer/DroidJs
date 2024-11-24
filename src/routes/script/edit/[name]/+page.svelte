<script lang="ts">
	import { page } from '$app/stores';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	import { enhance } from '$app/forms';
	import toast from 'svelte-french-toast';
	import type { Action } from 'svelte/action';
	import ActionButtonToast from '$lib/components/ActionButtonToast.svelte';

	// @todo use action
	// const myEnhance: Action<HTMLFormElement, { loading: string; success: string; error: string }> = (
	// 	formElement,
	// 	{ loading, success, error }
	// ) => {
	// 	return enhance(formElement, () => {
	// 		let doneHandler;
	// 		toast.promise(
	// 			new Promise((resolve, reject) => {
	// 				doneHandler = async ({ result }) => {
	// 					if (Math.floor(result.status / 100) == 2) resolve('');
	// 					else {
	// 						reject();
	// 					}
	// 				};
	// 			}),
	// 			{
	// 				loading,
	// 				success,
	// 				error
	// 			}
	// 		);

	// 		return doneHandler;
	// 	});
	// };

</script>

<svelte:head>
	<title>{$page.params.name} :: Script Editor :: DroidJs</title>
	<meta
		name="description"
		content="Scripts to animate your droids motion with DroidJs Droid Control Software"
	/>
</svelte:head>

<div class="container">
	<!-- <form
		method="POST"
		use:myEnhance={{
			loading: 'Saving...',
			success: 'Script Saved',
			error: 'Unable to save changes'
		}}
	> -->
		<PageHeader title={`Edit Script '${$page.params.name}'`}>
			<div class="d-flex">
				<ActionButtonToast
					action="?/save"
					loading="Saving..."
					success="Script Saved"
					error="Unable to save changes"
					actionLabel="Save"
					btnClass="btn-primary">
					<input type="hidden" name="script" bind:value={data.script}>
				</ActionButtonToast>
				<ActionButtonToast
					action="/script?/run"
					loading="Running..."
					success="Script Finshed!"
					error="Could not run script"
					actionLabel="Run"
					btnClass="ms-2 btn-outline-success">
					<input type="hidden" name="filename" value={$page.params.name}>
				</ActionButtonToast>
				<!-- <button formaction="?/save" class="btn btn-primary" type="submit">Save</button> -->

				<!-- <button formaction="/script?/run" class="btn btn-outline-success" type="submit" title="Run's the last saved version of the script">Run</button> -->
				<!-- <input type="hidden" name="filename" value={$page.params.name}> -->
			</div>
		</PageHeader>

		<textarea class="form-control" bind:value={data.script} name="script"/>
	<!-- </form> -->
</div>

<style>
	textarea {
		height: 500px;
		min-height: 500px;
	}
</style>
