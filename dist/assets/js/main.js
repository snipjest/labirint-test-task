"use strict";

new Swiper('.swiper', {
  navigation: {
    nextEl: '.btn-next',
    prevEl: '.btn-prev'
  },
  breakpoints: {
    0: {
      slidesPerView: 2,
      slidesPerGroup: 2,
      spaceBetween: 20
    },
    768: {
      slidesPerView: 4,
      slidesPerGroup: 4,
      spaceBetween: 24
    },
    1280: {
      slidesPerView: 6,
      slidesPerGroup: 6,
      spaceBetween: 24
    }
  }
});
var favourites = document.querySelectorAll('.favourites');
favourites.forEach(function (element) {
  element.addEventListener('click', function () {
    this.classList.toggle('active');
  });
});