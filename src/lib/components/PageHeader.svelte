<script lang="ts">
	import { enhance } from '$app/forms';
	import toast from 'svelte-french-toast';

	export let title;
</script>

<div class="d-flex justify-content-between">
	<slot name="left"><div></div></slot>
	<slot name="center"><h1>{title}</h1></slot>
	<slot><div></div></slot>
</div>
