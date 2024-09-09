<script lang="ts">
	export let show = false;
	export let title = '';
	export let callback = () => {};

	function save() {
		callback();
		show = false;
	}
</script>

<div class="modal modal-xl fade" class:show class:d-block={show} tabindex="-1">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				{#if title}
					<h1 class="modal-title fs-5">{title}</h1>
				{/if}
				<button type="button" class="btn-close" on:click={() => (show = !show)}></button>
			</div>
			<div class="modal-body">
				<slot />
			</div>
			<div class="modal-footer">
				<slot name="footer">
					<button type="button" class="btn btn-secondary" on:click={() => (show = !show)}
						>Close</button
					>
					<button type="button" class="btn btn-primary" on:click={() => save()}>Save changes</button
					>
				</slot>
			</div>
		</div>
	</div>
</div>
{#if show}
	<div class="modal-backdrop fade show"></div>
{/if}
