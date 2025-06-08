<script lang="ts">
	import TableForObjectArray, {
		type TableColumn
	} from '$lib/components/TableForObjectArray.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const renderJSON = (val: any) => {
		return `<pre>${JSON.stringify(val, null, 2)}</pre>`;
	};

	const tableColumns: TableColumn[] = [
		{ data: 'number', title: 'Number' },
		{ data: 'name', title: 'Name' },
		{ data: 'numAxes', title: 'Num Axes' },
		{ data: 'numButtons', title: 'Num Buttons' },
		{ data: 'axisMap', title: 'Axis Map', renderHTML: renderJSON },
		{ data: 'buttonMap', title: 'Button Map', renderHTML: renderJSON },
		{
			data: 'number',
			title: 'Actions',
			renderHTML: (val, type, any) => {
				return `<a href="controller/js${val}" class="btn btn-primary btn-sm">Test</a>`;
			}
		}
	];
</script>

<svelte:head>
	<title>Controller :: DroidJs</title>
	<meta name="description" content="Configure and test your Controller with DroidJs" />
</svelte:head>

<div class="container">
	<h1>Joystick Control</h1>

	<TableForObjectArray data={data.joysticks} columns={tableColumns} />
</div>
