<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let showAddHwModal = false;

	let hwTypeValue = '';
</script>

<svelte:head>
	<title>Config :: DroidJs</title>
	<meta name="description" content="Configure your Droid with DroidJs Droid Control Software" />
</svelte:head>

<div class="d-flex justify-content-between">
	<div></div>
	<h1>Hardware Config</h1>
	<div>
		<button class="btn btn-success" on:click={() => (showAddHwModal = !showAddHwModal)}
			>Add Hardware</button
		>
	</div>
</div>

<table class="table table-striped">
	<thead>
		<tr>
			<th>Name</th>
			<th>Type</th>
			<th>Summary</th>
			<th>Actions</th>
		</tr>
	</thead>
	<tbody>
		{#each data.hardware as item}
			<tr>
				<td>{item.name}</td>
				<td>{item.type}</td>
				<td>{JSON.stringify(item.config)}</td>
				<td>
					<button class="btn btn-primary">Edit</button>
					<button class="btn btn-danger">Delete</button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<Modal bind:show={showAddHwModal} title="Add Hardware">
	<form action="?/add" method="post">
		<div class="mb-3">
			<label for="name" class="form-label">Name</label>
			<input type="text" class="form-control" name="name" />
		</div>
		<div class="mb-3">
			<label for="type" class="form-label">Type</label>
			<select class="form-select" name="type" required bind:value={hwTypeValue}>
				<optgroup label="Select One"></optgroup>
				<optgroup label="I2C">
					<option value="i2c:PCA9685:16"> i2c: PCA9685: 16 Channel PWM Generator</option>
				</optgroup>
				<optgroup label="Joystick">
					<option value="js:logitech-f310">USB: Joystick: Logitech F-310</option>
					<option value="js:psmove-nav">USB: Joystick: Playstation Move Navigation</option>
				</optgroup>
			</select>
		</div>
		{#if hwTypeValue === 'i2c:PCA9685:16'}
			<fieldset>
				<legend>Config</legend>
				<p>
					Builders often use <a href="https://www.adafruit.com/product/815" target="_blank"
						>Adafruit 16-Channel 12-bit PWM/Servo Driver PCA9685</a
					> to control servos.
				</p>
				<div class="row">
					<div class="mb-3 col-md-6">
						<label for="i2cAddress" class="form-label">I2C Address</label>
						<input type="text" class="form-control" name="i2cAddress" value="0x40" />
					</div>
					<div class="mb-3 col-md-6">
						<label for="pwmFreq" class="form-label">Frequency</label>
						<input type="text" class="form-control" name="pwmFreq" value="50" />
					</div>
				</div>

				<h5>Pin Config</h5>
				<table class="table table-striped">
					<thead>
						<tr>
							<th>Name</th>
							<th>Type</th>
							<th>Config</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<input type="text" class="form-control" name="name" />
							</td>
							<td>
								<select class="form-select" name="type">
									<optgroup label="Select One"></optgroup>
									<option value="servo">Servo</option>
									<option value="motor">PWM Motor Controller / Continuous Servo</option>
								</select>
							</td>
						</tr>
					</tbody>
				</table>
			</fieldset>
		{/if}

		<!-- <div class="mb-3">
			<label for="config" class="form-label">Config</label>
			<textarea class="form-control" id="config"></textarea>
		</div> -->
	</form>
</Modal>
