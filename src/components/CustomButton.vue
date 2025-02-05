<template>
    <button class="rounded-lg">
        <slot/>
    </button>
</template>
<style scoped>
button {
  padding: 0.6em 1.2em !important;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #646cff;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}
</style>