<script lang="ts">
	import { enhance } from '$app/forms';
	import toast from 'svelte-french-toast';

	export let action; //"?/stop"
	export let loading = 'In Progress...';
	export let success = 'Success!';
	export let error = 'Failed :(';
	export let actionLabel;
	export let btnClass = 'btn-primary';
</script>

<form
	{action}
	method="POST"
	use:enhance={() => {
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
	}}
>
	<button class="btn {btnClass}" type="submit">{actionLabel}</button>
</form>
