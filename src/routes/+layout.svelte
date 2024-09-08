<script>
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import '../app.css';
	import '../app.scss';
	// import './styles.css';

	import Header from './Header.svelte';

	onMount(async () => {
		if (!browser) return;

		// this is enough for most components
		await import('bootstrap');

		// some components require a bootstrap instance, to fulfil their job. In that case, use this:
		// const bootstrap = await import("bootstrap");
		// sample usage:
		// const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
	});
</script>

<div class="app">
	<Header />

	<main>
		<slot />
	</main>

	<footer>
		<p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
