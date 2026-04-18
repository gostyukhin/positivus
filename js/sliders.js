window.addEventListener('DOMContentLoaded', () => {
  const caseSlider = document.querySelectorAll('.case-swiper');
  const reviewsSlider = document.querySelectorAll('.reviews-swiper');

  if (caseSlider.length) {
    caseSlider.forEach((slider) => {
      new Swiper(slider, {
        spaceBetween: 20,
        speed: 800,
        breakpoints: {
          320: {
            slidesPerView: 1.2,
          },
          768: {
            slidesPerView: 2.2,
          },
        },
      });
    });
  }

  if (reviewsSlider.length) {
    reviewsSlider.forEach((slider) => {
      new Swiper(slider, {
        slidesPerView: 2,
        spaceBetween: 20,
        speed: 800,
        centeredSlides: true,
        centeredSlidesBounds: true,
        navigation: {
          nextEl: '.reviews-button-next',
          prevEl: '.reviews-button-prev',
        },
        pagination: {
          el: '.reviews-pagination',
          type: 'bullets',
          clickable: true,
        },
        breakpoints: {
          320: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
        },
      });
    });
  }
});
