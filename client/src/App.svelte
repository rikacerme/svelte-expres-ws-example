<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  export let count = writable(0);

  let ws;

  onMount(() => {
    ws = new WebSocket("ws://localhost:3000");

    ws.onopen = () => {
      console.log("WebSocket connection established.");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "count") {
        count.set(data.value);
      }
    };

    const interval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send("increment");
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      ws.close();
    };
  });
</script>

<style>
  h1 {
    font-size: 2rem;
    color: #333;
  }
</style>

<main>
  <h1>WebSocket Count: {$count}</h1>
</main>
