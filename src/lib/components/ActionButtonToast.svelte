<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionResult, SubmitFunction } from '@sveltejs/kit';
	
	import { actionEnhance, type ValOrFn } from './actionEnhance';

	export let action; //"?/stop"
	export let loading: string = 'In Progress...';
	export let success: ValOrFn = 'Success!';
	export let error: ValOrFn = 'Failed :(';
	export let actionLabel = '';
	export let btnClass = 'btn-primary';
	export let title = '';
	let classname = '';
	export { classname as class };

	

	
</script>

<form {action} method="POST" class={classname} use:actionEnhance={({loading, success, error})}>
	<button class="btn {btnClass}" type="submit" {title}>{actionLabel}</button>

	<!-- a way to add additional form fields -->
	<slot></slot>
</form>
