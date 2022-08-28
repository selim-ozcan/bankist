'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");

btnScrollTo.addEventListener("click", function (e) {
  const { left, top } = section1.getBoundingClientRect();

  window.scrollTo({
    left: left + window.scrollX,
    top: top + window.scrollY,
    behavior: 'smooth'
  })
});

const linkContainer = document.querySelector(".nav__links");
linkContainer.addEventListener("click", e => {
  if (e.target.classList.contains("nav__link")) {
    e.preventDefault();
    const id = e.target.getAttribute('href');
    document.getElementById(id.slice(1)).scrollIntoView({ behavior: 'smooth' });
  }
});

const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContents = document.querySelectorAll(".operations__content");

tabsContainer.addEventListener("click", (event) => {
  const clicked = event.target.closest(".operations__tab");

  if (!clicked) return;

  tabs.forEach(tab => {
    tab.classList.remove("operations__tab--active")
  })
  clicked.classList.add("operations__tab--active");

  tabsContents.forEach(content => {
    content.classList.remove("operations__content--active");
    if (content.classList.contains(`operations__content--${clicked.dataset.tab}`)) {
      content.classList.add("operations__content--active");
    }
  })
});

const nav = document.querySelector(".nav");
const handleHover = function (op, event) {
  if (event.target.classList.contains("nav__link")) {
    const link = event.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach(sibling => {
      if (sibling !== link && !sibling.classList.contains("nav__link--btn"))
        sibling.style.opacity = op;
    })

    logo.style.opacity = op;
  }

}

nav.addEventListener("mouseover", handleHover.bind(null, .5));
nav.addEventListener("mouseout", handleHover.bind(null, 1));

const { height } = nav.getBoundingClientRect();

const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${height}px`
};

const obsCallback = function (entries, observer) {
  const [entry] = entries;
  entry.isIntersecting ? nav.classList.remove("sticky") : nav.classList.add("sticky")
}

const header = document.querySelector(".header");
const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(header);

// reveal sections
const sections = document.querySelectorAll(".section");

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return
  entry.target.classList.remove("section--hidden");

  observer.unobserve(entry.target);
};

const sectionObsOptions = {
  root: null,
  threshold: 0.15
};

const sectionObserver = new IntersectionObserver(revealSection, sectionObsOptions);

sections.forEach(section => {
  section.classList.add("section--hidden");
  sectionObserver.observe(section);
});

// lazy loading images

const lazyImages = document.querySelectorAll("img[data-src]");
const imgObserver = new IntersectionObserver(function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.src = 'http://127.0.0.1:5500/' + entry.target.dataset['src'];


  entry.target.addEventListener('load', () => entry.target.classList.remove("lazy-img"));
}, {
  root: null,
  threshold: .15
});

lazyImages.forEach(image => imgObserver.observe(image));

const slider = document.querySelector(".slider");
const slides = document.querySelectorAll(".slide");

const [sliderBtnLeft, sliderBtnRight] = document.querySelectorAll(".slider__btn");

let currentSlide = 0;
const maxSlide = slides.length;

const goToSlide = function (slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - currentSlide)}%)`
  });
}

goToSlide(0);

sliderBtnRight.addEventListener('click', function () {
  if (currentSlide === maxSlide - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;;
  }

  goToSlide(currentSlide);
});

sliderBtnLeft.addEventListener('click', function () {
  if (currentSlide === 0) {
    currentSlide = maxSlide - 1;
  } else {
    currentSlide--;
  }

  goToSlide(currentSlide);
});