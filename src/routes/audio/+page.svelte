<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<form method="POST" action="?/stop" use:enhance>
	<button type="submit" class="btn btn-danger">Stop</button>
</form>

{#each data.files as file}
	<ul>
		<li>
			<form method="POST" action="?/play" use:enhance>
				{file}
				<input type="hidden" name="filename" value={file} />
				<button type="submit" class="btn btn-outline-primary">Play</button>
			</form>
		</li>
	</ul>
{/each}
