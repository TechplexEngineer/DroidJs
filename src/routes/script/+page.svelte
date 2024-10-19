<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Scripts :: DroidJs</title>
	<meta
		name="description"
		content="Scripts to animate your droids motion with DroidJs Droid Control Software"
	/>
</svelte:head>
<h1>Script Library</h1>

{#each data.files as file}
	<ul>
		<li>
			<form method="POST" action="?/run" use:enhance>
				{file}
				<input type="hidden" name="filename" value={file} />
				<button type="submit" class="btn btn-outline-primary">Run</button>
			</form>
		</li>
	</ul>
{/each}