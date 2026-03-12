<script>
  import Threlte from "./Threlte.svelte";
  import { onMount } from "svelte";

  let pointer = $state({ x: 0, y: 0 });

  const updatePointer = (event) => {
    pointer = {
      x: event.pageX,
      y: event.pageY,
    };
  };

  onMount(() => {
    document.addEventListener("mousemove", updatePointer, { passive: true });

    return {
      destroy() {
        element.removeEventListener("mousemove", updatePointer);
      },
    };
  })
</script>

<Threlte pointerPosition={pointer} />