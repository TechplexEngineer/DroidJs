<script lang="ts">
	export let show = false;
	export let title = '';
	export let callback = (success: boolean) => {
		show = !show;
	};

	$: console.log('show', show);
</script>

<div class="modal modal-xl fade" class:show class:d-block={show} tabindex="-1">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				{#if title}
					<h1 class="modal-title fs-2">{title}</h1>
				{/if}
				<button type="button" class="btn-close" on:click={() => callback(false)}></button>
			</div>
			<div class="modal-body">
				<slot />
			</div>
			<div class="modal-footer">
				<slot name="footer">
					<button type="button" class="btn btn-secondary" on:click={() => callback(false)}
						>Close</button
					>
					<button type="submit" class="btn btn-primary" on:click={() => callback(true)}
						>Save changes</button
					>
				</slot>
			</div>
		</div>
	</div>
</div>
{#if show}
	<div class="modal-backdrop fade show"></div>
{/if}
