<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	export let data: PageData;

	// data contains a list of files and the directory they are store in
	// split the filename on / and group by prefix
	// SENT/SENT_001.mp3 => {'SENT': ['SENT_001.mp3']}
	// SOUND/SENT/SENT_001.mp3 => {'SOUND': {'SENT': ['SENT_001.mp3']}}

	const grouped = data.files.reduce(
		(acc, file) => {
			const parts = file.split('/');
			// console.log('parts', parts);
			if (parts.length == 1) {
				if (!acc['']) {
					acc[''] = [];
				}
				acc[''].push(parts[0]);
				return acc;
			} else {
				const [prefix, ...rest] = parts;
				if (!acc[prefix]) {
					acc[prefix] = [];
				}
				acc[prefix].push(rest.join('/'));
				return acc;
			}
		},
		{} as Record<string, string[]>
	);

	// console.log('grouped', grouped); //@todo Show audio files in groups
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
