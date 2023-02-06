<script>
import "@/assets/main.css";

export default {
  name: "carousel-card",
  components: {},
  props: { item: Object, langOption: Object },
};
</script>

<template>
  <div v-if="item && Object.keys(this.item).length > 0" class="carousel-card">
    <div
      :class="{
        'carousel-info': this.item.area === true,
        'carousel-info-withwout-btn': this.item.area === false,
      }"
    >
      <div class="carousel-title">
        {{
          langOption.lang === "english"
            ? this.item.engCarouselTitle
            : this.item.hebCarouselTitle
        }}
      </div>
      <div class="carousel-content">
        <button
          v-if="this.item.area === true && langOption.diraction === 'rtl'"
          class="carousel-btn"
        >
          כניסה למתחם
        </button>
        <button
          v-else-if="this.item.area === true && langOption.diraction === 'ltr'"
          class="carousel-btn"
        >
          Switch Market
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.carousel-card {
  width: 100%;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}
.carousel-info {
  margin-top: 3.5rem;
  width: 100%;
}
.carousel-info-withwout-btn {
  margin-top: 0;
  width: 100%;
}
.carousel-title {
  width: 100%;
  font-size: 3.5rem;
  font-weight: 700;
  white-space: nowrap;
  font-family: Almoni-bold;
  z-index: 100;
  box-sizing: border-box;
  cursor: pointer;
}
.carousel-content {
  width: 100%;
  display: flex;
  align-items: center;
}

.carousel-btn {
  z-index: 100;
  display: block;
  font-size: 20px;
  border-radius: 28px;
  background: 0 0;
  color: white;
  padding: 1rem 4px;
  border: 1.5px solid white;
  text-align: center;
  min-width: 10rem;
  cursor: pointer;
  width: auto;
}
@media screen and (max-width: 950px) {
  .carousel-btn {
    padding: 4px 16px;
    font-size: 14px;
    line-height: 1;
    font-weight: 500;
    height: 100%;
  }
}
</style>
