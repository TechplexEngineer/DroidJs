<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionResult, SubmitFunction } from '@sveltejs/kit';
	import toast from 'svelte-french-toast';

	export let action; //"?/stop"
	export let loading: string = 'In Progress...';
	export let success: string | ((arg: ActionResult<Success, Failure>) => string) = 'Success!';
	export let error: string | ((arg: ActionResult<Success, Failure>) => string) = 'Failed :(';
	export let actionLabel = '';
	export let btnClass = 'btn-primary';
	export let title = '';
	let classname = '';
	export { classname as class };

	type Success = Record<string, unknown> | undefined;
	type Failure = Record<string, unknown> | undefined;

	const enhanceFn: SubmitFunction<Success, Failure> = () => {
		let doneHandler: ReturnType<SubmitFunction<Success, Failure>>;
		toast.promise(
			new Promise<ActionResult>((resolve, reject) => {
				doneHandler = async ({ result }) => {
					if (result.type == 'failure') {
						return reject(result);
					}
					return resolve(result);
				};
			}),
			{
				loading,
				success,
				error
			}
		);

		return doneHandler;
	};
</script>

<form {action} method="POST" class={classname} use:enhance={enhanceFn}>
	<button class="btn {btnClass}" type="submit" {title}>{actionLabel}</button>

	<!-- a way to add additional form fields -->
	<slot></slot>
</form>
