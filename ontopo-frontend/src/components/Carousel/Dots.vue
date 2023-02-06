<script>
import "@/assets/main.css";

export default {
  name: "dots-components",
  //   components: {},
  props: { dataCarousel: Array, elIdOnScreen: Number },
};
</script>

<template>
  <div v-if="this.dataCarousel.length" class="dots">
    <div
      v-for="(dot, index) in dataCarousel.length"
      :class="{
        'is-selected': index + 1 === elIdOnScreen,
        'is-not-selected': index + 1 !== elIdOnScreen,
      }"
      :key="dot"
    >
      .
    </div>
  </div>
</template>

<style scoped>
.is-selected {
  color: white;
}
.is-not-selected {
  opacity: 0.2;
}
.dots {
  color: white;
  font-size: 4rem;
  position: absolute;
  bottom: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
</style>
