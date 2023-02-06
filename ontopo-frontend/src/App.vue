<script>
import ArrowForwardSvg from "@/assets/svgs/arrow_forward.svg";
import ArrowBackSvg from "@/assets/svgs/arrow_back.svg";
import { getRequest } from "@/services/http-service.js";
import CarouselCard from "@/components/Carousel/CarouselCard.vue";
import Dots from "@/components/Carousel/Dots.vue";

export default {
  components: {
    ArrowForwardSvg,
    ArrowBackSvg,
    "carousel-card": CarouselCard,
    "dots-component": Dots,
  },
  data() {
    return {
      langOption: { lang: "hebrew", diraction: "rtl" },
      cursorPos: [],
      mouseOn: false,
      intervalId: null,
      isDragging: false,
      elIdOnScreen: 1,
      dataCarousel: [],
      carouselTimer: 1000,
    };
  },
  async mounted() {
    const dataCarousel = await getRequest();
    this.dataCarousel = [...dataCarousel];
    document.getElementById("app").style.direction = this.langOption.diraction;
    this.intervalId = setInterval(() => {
      if (this.mouseOn == false) {
        this.setNextDivScroller();
        const elCarousel = this.$refs.carousel;
        this.elIdOnScreen =
          Math.abs(elCarousel.scrollLeft) / elCarousel.clientWidth + 1;
      }
    }, this.carouselTimer);
  },
  unmounted() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.$refs.carousel.removeEventListener("pointermove", this.onMouseHold);
  },
  methods: {
    onSelectLang({ target }) {
      const { value } = target;
      if (value === "english") {
        this.langOption = { lang: "english", diraction: "ltr" };
      } else if (value === "hebrew") {
        this.langOption = { lang: "hebrew", diraction: "rtl" };
      }
      document.getElementById("app").style.direction =
        this.langOption.diraction;
    },
    currentSectionScrollCalc(currentSection) {
      const sectionLocation = this.$refs.carousel.clientWidth * currentSection;
      return sectionLocation;
    },
    setNextDivScroller() {
      const carouselEl = this.$refs.carousel;
      if (this.langOption.diraction === "rtl") {
        if (
          carouselEl.clientWidth * (this.dataCarousel.length - 1) * -1 ===
          carouselEl.scrollLeft
        ) {
          carouselEl.scrollLeft = 0;
        } else {
          carouselEl.scrollLeft -= carouselEl.clientWidth;
        }
      } else {
        if (
          carouselEl.clientWidth * (this.dataCarousel.length - 1) ===
          carouselEl.scrollLeft
        ) {
          carouselEl.scrollLeft = 0;
        } else {
          carouselEl.scrollLeft += carouselEl.clientWidth;
        }
      }
    },
    onMouseUp() {
      this.isDragging = false;
      this.$refs.carousel.removeEventListener("pointermove", this.onMouseHold);
    },
    onMouseDown(event) {
      this.isDragging = true;
      this.cursorPos = [event.pageX, event.pageY];
      this.$refs.carousel.addEventListener("pointermove", this.onMouseHold);
    },
    imageUrlByDir(item) {
      if (this.langOption.diraction === "ltr") return item.ltrImageUrl;
      return item.imageUrl;
    },
    onMouseHold(event) {
      event.preventDefault();
      const delta = [
        event.pageX - this.cursorPos[0],
        event.pageY - this.cursorPos[1],
      ];
      this.cursorPos = [event.pageX, event.pageY];
      if (!this.$refs.carousel) return;
      this.$refs.carousel.scrollBy({
        left: -delta[0],
        top: -delta[1],
      });
      if (
        this.$refs.carousel.scrollLeft ===
        this.$refs.carousel.clientWidth * this.dataCarousel.length * -1
      ) {
        this.$refs.carousel.scrollLeft -= this.currentSectionScrollCalc(1);
      }
    },
    onClickArrow(isNext) {
      const step = this.currentSectionScrollCalc(1);
      const elCarousel = this.$refs.carousel;
      if (isNext === false) {
        if (this.langOption.diraction === "ltr") {
          if (elCarousel.scrollLeft === 0) {
            elCarousel.scrollLeft -=
              -1 * this.currentSectionScrollCalc(this.dataCarousel.length);
          } else {
            elCarousel.scrollLeft -= step;
          }
        } else {
          if (elCarousel.scrollLeft === 0) {
            elCarousel.scrollLeft +=
              -1 * this.currentSectionScrollCalc(this.dataCarousel.length);
          } else {
            elCarousel.scrollLeft += step;
          }
        }
      } else {
        if (
          elCarousel.scrollLeft ===
            step * (this.dataCarousel.length - 1) * -1 ||
          elCarousel.scrollLeft === step * (this.dataCarousel.length - 1)
        ) {
          elCarousel.scrollLeft = 0;
        } else {
          if (this.langOption.diraction === "ltr") {
            elCarousel.scrollLeft += step;
          } else {
            elCarousel.scrollLeft -= step;
          }
        }
      }
    },
  },
};
</script>

<template>
  <select style="margin-bottom: 1.875rem" @change="onSelectLang">
    <option value="hebrew">עברית</option>
    <option value="english">English</option>
  </select>
  <div>
    <div>
      <div
        id="carousel"
        @pointerup="onMouseUp"
        @pointercancel="onMouseUp"
        @pointerleave="onMouseUp"
        @pointerdown="onMouseDown"
        class="carousel"
        ref="carousel"
      >
        <div
          v-if:="dataCarousel.length"
          v-for="item in dataCarousel"
          :key="{ item }"
          :class="{
            'active-diraction': langOption.diraction === 'ltr',
          }"
          :style="{
            'background-image': `url(${imageUrlByDir(item)})`,
          }"
          class="carousel-item"
          @mouseenter="mouseOn = true"
          @mouseleave="mouseOn = false"
          :data-id="item.id"
        >
          <div class="arrows-container" @click="onClickArrow(false)">
            <arrowForwardSvg
              v-if="langOption.diraction === 'rtl'"
              class="arrows"
            />
            <arrowBackSvg
              v-else-if="langOption.diraction === 'ltr'"
              class="arrows"
            />
          </div>
          <carousel-card
            v-if="Object.keys(item).length > 0"
            :item="item"
            :langOption="langOption"
          />
          <div @click="onClickArrow(true)" class="arrows-container">
            <arrowBackSvg
              v-if="langOption.diraction === 'rtl'"
              class="arrows"
            />
            <arrowForwardSvg
              v-else-if="langOption.diraction === 'ltr'"
              class="arrows"
            />
          </div>
        </div>
      </div>
    </div>
    <dots-component :elIdOnScreen="elIdOnScreen" :dataCarousel="dataCarousel" />
  </div>
</template>
<style scoped>
.carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}
.carousel::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.carousel > .carousel-item {
  scroll-snap-align: start;
  flex-shrink: 0;
  transform-origin: center center;
  transform: scale(1);
  transition: transform 0.5s;
}
.carousel-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background-size: cover;
  height: 30rem;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 20px;
}
.carousel-item-diraction {
  flex-direction: row-reverse;
}
.arrows-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 5rem;
  cursor: pointer;
}
.background-image {
  width: 100%;
}

.arrows {
  width: 3.5rem;
  height: 3.5rem;
  color: white;
}

@media screen and (max-width: 985px) {
  .arrows {
    display: none;
  }
}
</style>
