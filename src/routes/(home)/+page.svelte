<script>
	import Counter from './Counter.svelte';
</script>

<svelte:head>
	<title>Home :: DroidJs</title>
	<meta name="description" content="Dashboard for DroidJs Droid Control Software" />
</svelte:head>

<section>
	<h1>
		<span class="welcome"> Welcome </span>

		to your new<br />SvelteKit app
	</h1>

	<Counter />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}
</style>
