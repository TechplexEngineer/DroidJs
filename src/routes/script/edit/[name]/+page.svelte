<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1>Edit Script: <small>{$page.params.name}</small></h1>
