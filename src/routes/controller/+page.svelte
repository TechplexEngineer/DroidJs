<script lang="ts">
	import TableForObjectArray from '$lib/components/TableForObjectArray.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const renderJSON = (val: any) => {
		return `<pre>${JSON.stringify(val, null, 2)}</pre>`;
	};

	const tableColumns = [
		{ data: 'number', title: 'Number' },
		{ data: 'name', title: 'Name' },
		{ data: 'numAxes', title: 'Num Axes' },
		{ data: 'numButtons', title: 'Num Buttons' },
		{ data: 'axisMap', title: 'Axis Map', renderHTML: renderJSON },
		{ data: 'buttonMap', title: 'Button Map', renderHTML: renderJSON },
		{ data: 'number', title: 'Actions' }
	];
</script>

<svelte:head>
	<title>Controller :: DroidJs</title>
	<meta name="description" content="Configure and test your Controller with DroidJs" />
</svelte:head>
<h1>Joystick Control</h1>

<!-- <table class="table table-striped">
    <thead>
        <tr>
            <th>Number</th>
            <th>Name</th>
            <th>Num Axes</th>
            <th>Num Buttons</th>
            <th>Actions</th>
        </tr>
    </thead>
</table> -->

<TableForObjectArray data={data.joysticks} columns={tableColumns} />
