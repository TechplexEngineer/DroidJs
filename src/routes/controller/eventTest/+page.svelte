<!-- <script lang="ts">
  // src/routes/+page.svelte
  import { source } from 'sveltekit-sse'
  const value = source('/joystick/js0').select('message')

  let messages: string[] = [];

  const appendValue = (value: string) => {
    if (messages.length > 25) {
      messages = messages.slice(1);
    }
    messages = [...messages, value];
  }


  $: appendValue($value);
</script>

{messages} -->
