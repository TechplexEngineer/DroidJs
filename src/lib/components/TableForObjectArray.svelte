<script context="module" lang="ts">
	import { type SvelteComponent } from "svelte";

	export type TableColumns = (
		| string
		| { data: string; title: string; render?: renderFn; renderHTML?: renderFn, renderComponent?: renderFnC }
	)[];
	export type renderFn = (val: any, type: any, row: any) => string;
	export type renderFnC = (val: any, type: any, row: any) => {component: any, props: Record<string, any>};
</script>

<script lang="ts">
	export let data: Record<string, string | number>[];
	
	export let columns: TableColumns | null = null;
	
	export const generateListOfCols = (columns: TableColumns | null, data: Record<string, string | number>[]) => {
		if (columns === null) {
			columns = Object.keys(data[0] || { 'No Data': '' });
		}
		return columns.map((k) => {
			if (typeof k === 'string') {
				return {
					data: k,
					title: k.charAt(0).toUpperCase() + k.slice(1)
				};
			}
			return k;
		});
	}

	$: cols2Render = generateListOfCols(columns, data);
</script>

<table class="table table-striped">
	<thead>
		<tr>
			{#each cols2Render as obj}
				<th>{obj.title}</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each data as row}
			<tr>
				{#each cols2Render as colCfg}
					{#if colCfg.render}
						<td>{colCfg.render(row[colCfg.data], null, row)}</td>
					{:else if colCfg.renderHTML}
						<td>{@html colCfg.renderHTML(row[colCfg.data], null, row)}</td>
					{:else if colCfg.renderComponent}
						{@const {component, props} = colCfg.renderComponent(row[colCfg.data], null, row)}
						<td><svelte:component this={component} {...props}/></td>
					{:else}
						<td>{row[colCfg.data]}</td>
					{/if}
				{/each}
			</tr>
		{:else}
			<tr>
				<td colspan={cols2Render.length}>No data to display</td>
			</tr>
		{/each}
	</tbody>
</table>