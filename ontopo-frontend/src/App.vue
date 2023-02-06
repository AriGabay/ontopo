<script>
import ArrowForwardSvg from "@/assets/svgs/arrow_forward.svg";
import ArrowBackSvg from "@/assets/svgs/arrow_back.svg";
import { getRequest } from "@/services/http-service.js";

export default {
  components: {
    ArrowForwardSvg,
    ArrowBackSvg,
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
  beforeUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
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
          width: '100%',
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
        <div class="carousel-card">
          <div
            :class="{
              'carousel-info': item.area === true,
              'carousel-info-withwout-btn': item.area === false,
            }"
          >
            <div class="carousel-title">
              {{
                langOption.lang === "english"
                  ? item.engCarouselTitle
                  : item.hebCarouselTitle
              }}
            </div>
            <div class="carousel-content">
              <button
                v-if="item.area === true && langOption.diraction === 'rtl'"
                class="carousel-btn"
              >
                כניסה למתחם
              </button>
              <button
                v-else-if="item.area === true && langOption.diraction === 'ltr'"
                class="carousel-btn"
              >
                Switch Market
              </button>
            </div>
          </div>
        </div>
        <div @click="onClickArrow(true)" class="arrows-container">
          <arrowBackSvg v-if="langOption.diraction === 'rtl'" class="arrows" />
          <arrowForwardSvg
            v-else-if="langOption.diraction === 'ltr'"
            class="arrows"
          />
        </div>
      </div>
    </div>
    <div class="dots">
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
.is-selected {
  color: white;
}
.is-not-selected {
  opacity: 0.2;
}
.carousel-item {
  display: flex;
  align-items: center;
  justify-content: center;
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
.carousel-card {
  width: 100%;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}
.carousel-content {
  width: 100%;
  display: flex;
  align-items: center;
}
.carousel-info {
  margin-top: 3.5rem;
}
.carousel-info-withwout-btn {
  margin-top: 0;
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
.arrows-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 5rem;
  cursor: pointer;
}

.arrows {
  width: 3.5rem;
  height: 3.5rem;
  color: white;
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
@media screen and (max-width: 985px) {
  .arrows {
    display: none;
  }
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
