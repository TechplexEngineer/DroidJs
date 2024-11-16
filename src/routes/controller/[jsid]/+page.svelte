<script lang="ts">
	import { page } from '$app/stores';
	import ActionButtonToast from '$lib/components/ActionButtonToast.svelte';
	import RangeInput from '$lib/components/RangeInput.svelte';
	import { source } from 'sveltekit-sse';

	export let data;

	const value = source(`/controller/${$page.params.jsid}`).select('message');

	let messages: string[] = [];

	const appendValue = (value: string) => {
		if (messages.length > 25) {
			messages = messages.slice(1);
		}
		messages = [...messages, value];
	};

	$: appendValue($value);
	const controller = data.joysticks.find((j) => `js${j.number}` == $page.params.jsid);
</script>

<div class="container-fluid">
	<div class="row">
		<div class="col-md-8">
			<h2>Events</h2>
			<pre>{messages.join('\n')}</pre>
		</div>
		<div class="col-md-4">
			<h2>Controls</h2>

			{#each Object.entries(controller?.buttonMap) as [num, name]}
				<ActionButtonToast
					action="?/event"
					loading="Playing..."
					success={(result) => {
						console.log('success', result);
						// const msg = `Played: ${result.data.message}`;
						// console.log(msg);
						// return msg;
					}}
					error={(result) => {
						console.log(result);
						// return result.data.message
						// 	? `Error: ${result.data.message}`
						// 	: 'Unable to play random sound';
					}}
					actionLabel={`${num} -- ${name}`}
					btnClass="btn-outline-primary"
					title="Play random song"
				>
					<input type="hidden" name="button" value={num} />
				</ActionButtonToast>
				<!-- <div class="btn btn-primary ms-2 mt-2">{num} -- {name}</div> -->
			{/each}
			<hr />

			{#each Object.entries(controller?.axisMap) as [num, name]}
				<RangeInput label={name} name="value" value={0} />
			{/each}

			<!-- <pre>{JSON.stringify(controller, null, 2)}</pre> -->
		</div>
	</div>
</div>
