<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	console.log(data);

	let showAddHardwareModal = false;

	const addHardware = () => {
		console.log('Add Hardware');
	};
</script>

<div class="d-flex justify-content-between">
	<div></div>
	<h1>Hardware Config</h1>
	<div>
		<button class="btn btn-success" on:click={() => (showAddHardwareModal = !showAddHardwareModal)}
			>Add Hardware</button
		>
	</div>
</div>

<table class="table table-striped">
	<thead>
		<tr>
			<th>Name</th>
			<th>Type</th>
			<th>Summary</th>
			<th>Actions</th>
		</tr>
	</thead>
	<tbody>
		{#each data.hardware as item}
			<tr>
				<td>{item.name}</td>
				<td>{item.type}</td>
				<td>{JSON.stringify(item.config)}</td>
				<td>
					<button class="btn btn-primary">Edit</button>
					<button class="btn btn-danger">Delete</button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<Modal show={showAddHardwareModal} title="Add Hardware" callback={addHardware} />
