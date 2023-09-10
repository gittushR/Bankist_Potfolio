'use strict';
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

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
//button scroll
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

//page navigation
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  //matching strategy
  if (e.target.classList.contains('nav__link')) {
    let id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//playing with tabs

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
tabsContainer.addEventListener('click', function (e) {
  const clickedButton = e.target.closest('.operations__tab');
  if (!clickedButton) return;
  tabs.forEach(function (t) {
    t.classList.remove('operations__tab--active');
  });
  tabsContent.forEach(function (t) {
    t.classList.remove('operations__content--active');
  });

  //activate tab
  clickedButton.classList.add('operations__tab--active');

  //activating content area
  document
    .querySelector(
      `.operations__content--${clickedButton.getAttribute('data-tab')}`
    )
    .classList.add('operations__content--active');
});

//menu fade animation
const nav = document.querySelector('.nav');
function hoverNav(e, opacityVal) {
  if (e.target.classList.contains('nav__link')) {
    const clickedLink = e.target;
    const siblings = clickedLink.closest('.nav').querySelectorAll('.nav__link');
    const logo = clickedLink.closest('.nav').querySelector('.nav__logo');
    siblings.forEach(function (el) {
      if (el != clickedLink) {
        el.style.opacity = opacityVal;
      }
    });
    logo.style.opacity = opacityVal;
  }
}
nav.addEventListener('mouseover', function (e) {
  hoverNav(e, 0.5);
});
nav.addEventListener('mouseout', function (e) {
  hoverNav(e, 1);
});

//sticky navigation bar
// const initialCoordinates = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   if (this.window.scrollY > initialCoordinates.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

//intersection observation api

//tut

// const observerCallback = function (entries, observer) {
//   //entries are an array of threshold values
//   entries.forEach(function (entry) {
//     console.log(entry);
//   });
// }; /**The observer function will be called each time when the observed element i.e the target element is intersecting the root element at the threshold we defined */
// const observerOptions = {
//   root: null, //element that the target is intersecting(target element is section 1 and root element is the element we want to intersect)/*NULL MEANS THAT WE ARE INTERSECTING THE ENTIRE VIEWPORT THAT MEANS JAB BHI WO ELEMENT VIEW PORT ME AAEGA THEN CALLBACK FUNCTION TRIGGERED */
//   threshold: 0.1, //percentage of intersection at which the observer callback will be called  ALSO PERCENTAGE OF TARGET THAT WE WANT TO HAVE VISIBLE IN OUR ROOT(her viewport)
// };

// const observer = new IntersectionObserver(observerCallback, observerOptions); //(callback,options)
// observer.observe(section1); //the element to be observed
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const observerCallback = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const observerOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};
const headerObserver = new IntersectionObserver(
  observerCallback,
  observerOptions
);
headerObserver.observe(header);

const signUp = document.querySelector('.section--sign-up');
const signUpCallback = function (entries) {
  const [entry] = entries;
  if (entry.isIntersecting) nav.classList.remove('sticky');
  else nav.classList.add('sticky');
};
const signUpObserver = new IntersectionObserver(observerCallback, {
  root: null,
  threshold: 0,
});
signUpObserver.observe(signUp);

//revealing sections
const allSection = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return; //if entry is not intersecting simply return
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target); //observer in this function is ued to unobserve the class once after the effect has taken place
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSection.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

//lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]'); //selects all images with data-src as one of its attributes

let revealImage = function (entries, observer) {
  const [entry] = entries; //only one threshold so only one entry
  if (!entry.isIntersecting) return;
  //replace src with data-src
  entry.target.src = entry.target.dataset.src;

  //whenever we change the path of image a load event is fired and we should remove the blur filter only when the loading o image is completed or else we will see the lower resolution image
  //therefore
  entry.target.addEventListener('load', function (e) {
    entry.target.classList.remove('lazy-img');
  });
  //at the end stop observing the images
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(revealImage, {
  root: null,
  threshold: 0,
});
imgTargets.forEach(function (image) {
  imgObserver.observe(image);
});

//carousel OR slider component
//make all the images in the slider visible
const carousel = function () {
  let slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  let currSlide = 0;
  let maxSlide = slides.length;

  // let slider = document.querySelector('.slider');
  // slider.style.transform = 'scale(0.3)';
  // slider.style.overflow = 'visible';

  // slides.forEach(function (s, ind) {
  //   s.style.transform = `translateX(${100 * ind}%)`;
  //   //0,100,200,300
  // });

  // btnRight.addEventListener('click', function (e) {
  //   if (currSlide === maxSlide - 1) {
  //     currSlide = 0;
  //   } else currSlide++;

  //   slides.forEach(function (s, ind) {
  //     s.style.transform = `translateX(${100 * (ind - currSlide)}%)`;
  //     //-100, 0 ,100,200
  //   });
  // });

  //the above can be done by creating a gotoSlide function that accepts the index of the slide we have to head to

  const gotoSlide = function (slide) {
    slides.forEach(function (s, ind) {
      s.style.transform = `translateX(${100 * (ind - slide)}%)`;
      //-100, 0 ,100,200
    });
  };

  gotoSlide(0); //makes sure that the slider is showing the first slide when we reload the page

  btnRight.addEventListener('click', function (e) {
    if (currSlide === maxSlide - 1) {
      currSlide = 0;
    } else currSlide++;

    gotoSlide(currSlide);
    activateDot(currSlide);
  });
  btnLeft.addEventListener('click', function () {
    if (currSlide === 0) {
      currSlide = maxSlide - 1;
    } else currSlide--;
    gotoSlide(currSlide);
    activateDot(currSlide);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') {
      if (currSlide === 0) {
        currSlide = maxSlide - 1;
      } else currSlide--;
      gotoSlide(currSlide);
      activateDot(currSlide);
    } else if (e.key === 'ArrowRight') {
      if (currSlide === maxSlide - 1) {
        currSlide = 0;
      } else currSlide++;
      gotoSlide(currSlide);
      activateDot(currSlide);
    }
  });

  // slider dots

  let dotContainer = document.querySelector('.dots');
  function createDots() {
    for (let ind = 0; ind < slides.length; ind++) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${ind}"></button>`
      );
    }
  }
  createDots();
  const activateDot = function (currSlide) {
    document.querySelectorAll('.dots__dot').forEach(function (dot) {
      dot.classList.remove('dots__dot--active');
    });
    document
      .querySelector(`.dots__dot[data-slide="${currSlide}"]`)
      .classList.add('dots__dot--active');
  };
  activateDot(0);
  //activate the slide by clicking on the dost
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide;
      gotoSlide(slide);
      activateDot(slide);
    }
  });
};
carousel();

//tut
//DOM Lifecycle events

// Fired when the entire html and css of the webpage has been loaded( not the js files)
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('Page fully loaded');
});
//fired when the entire webpage is loaded
window.addEventListener('load', function (e) {
  console.log('Page fully loaded');
});
//fired when thw user presses the exit button
window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  console.log(e);
  e.returnValue = '';
});
