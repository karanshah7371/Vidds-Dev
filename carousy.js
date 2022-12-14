/**
 * Generic QuerySelector
 * @param { String } str Any valid CSS selector
 * @param { Boolean } bool Does "querySelectorAll()" if true else "querySelector()"
 * @returns DOM Node/ NodeList
 */
function $(str, bool) {
  return bool ? document.querySelectorAll(str) : document.querySelector(str);
}
/**
 * @function Creates a DOM Element with any attributes passed
 * @param {String} tag HTML Tag to create
 * @param {{}} attrs Attributes to assign to the new Element
 * @param {{}} style Stylings to apply on the new Element
 * @return {HTMLElement} Created DOM Element.
 */
function createDomElement(tag, attrs = {}) {
  try {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    return el;
  } catch (err) {
    return console.error(err);
  }
}

function defaultCarousyStyle() {
  const styling = `
    #d_c_container {
        position:relative;
    }
    #d_c_container #d_c {
        gap: 40px;
        padding: 8px;
    }
    
    #d_c_container #d_c [data-carousy-el="card"] {
        width: 122px;
        aspect-ratio: 4/3;
        background-color: #eee;
        border-radius: 8px;
        border: 1px solid #bfbfbf;
    }
    #d_c_container #d_c [data-carousy-el="card-title"] {
        margin-top: 9px;
    }
    #d_c_navigation {
        display: none;
        position: absolute;
        top: 50%;
        left: 0;
        transform: translate(0, -50%);
        pointer-events: none;
    }

    #d_c_navigation > button {
        pointer-events: all;
    }

    @media only screen and (min-width: 768px) {
        #d_c_container #d_c [data-carousy-el="card"]  {
            width: 180px;
        }
        #d_c_navigation {
            display: block;
        }
    }}`;

  return styling;
}

/**
 * Create a carousal
 * @param {String} el Any valid CSS selector
 */
export default function Carousy(el, config = {}) {
  // START
  // input check
  if (typeof el !== "string") {
    throw Error(`TypeError: Expected type "string". Got ${typeof el}`);
  }

  const {
    defaultStyles = 0,
    slidesToScroll: step = 3,
    navPosition = "c-center",
    addNavBtns = 0,
    navButtons = false,
  } = config;

  const CC = this;
  // properties

  CC.carousal;
  CC.container = createDomElement("div", { id: "d_c_container" });
  CC.btnPrev = createDomElement("button", { id: "d_c_prev" });
  CC.btnNext = createDomElement("button", { id: "d_c_next" });
  CC.navBtns = createDomElement("div", { id: "d_c_navigation" });

  CC.btnPrev.innerHTML = "<span>Prev</span>";
  CC.btnNext.innerHTML = "<span>Next</span>";
  CC.navBtns.append(CC.btnPrev, CC.btnNext);

  // constructor area

  this.initStyles(); // Required styles
  if (defaultStyles) this.applyDefaultStyles();

  CC.carousal = $(el);

  const cParent = CC.carousal.parentElement;

  CC.carousal.remove(); // remove carousal

  CC.container.appendChild(CC.carousal); // insert new carousal

  // Add Navigaton buttons
  if (addNavBtns) {
    CC.container.appendChild(CC.navBtns);

    if (navPosition === "c-center") {
      const card1 = this.carousal.firstElementChild;
      const { height } = card1.getBoundingClientRect();

      Object.assign(CC.navBtns.style, { top: height / 2 + "px" });
    }
  }

  CC.carousal.setAttribute("id", "d_c");
  cParent.insertAdjacentElement("afterbegin", CC.container);

  // Custom Navigation Buttons
  if (navButtons) {
    const navs = CC.container.nextElementSibling;

    CC.btnPrev = navs.querySelector("[data-carousy-btn='prev']");
    CC.btnNext = navs.querySelector("[data-carousy-btn='next']");
  }

  CC.btnPrev.addEventListener("click", () => CC.prev(step));
  CC.btnNext.addEventListener("click", () => CC.next(step));
  // END

  return this.elementReferences();
}

Carousy.prototype = {
  initStyles() {
    const dep_styles = createDomElement("style", { id: "d_c_dep_styles" });
    dep_styles.innerHTML = `
        #d_c_container #d_c {
            display: grid;
            grid-auto-flow: column;
            overflow: auto;
            scroll-behavior: smooth;
        }
        #d_c_container #d_c::-webkit-scrollbar {
            height: 0;
        }`;

    $("#d_c_dep_styles")?.remove();
    $("head").appendChild(dep_styles);
  },
  next(N = 2) {
    const card1 = this.carousal.firstElementChild;
    const { width: c_width } = card1.getBoundingClientRect();
    this.carousal.scrollLeft += N * c_width + 16;
  },
  prev(N = 2) {
    const card1 = this.carousal.firstElementChild;
    const { width: c_width } = card1.getBoundingClientRect();
    this.carousal.scrollLeft -= N * c_width + 16;
  },
  elementReferences() {
    return {
      carousal: this.carousal,
      carousalContainer: this.container,
      navContainer: this.navBtns,
      btnPrev: this.btnPrev,
      btnNext: this.btnNext,
    };
  },
};

Carousy.prototype.applyDefaultStyles = function () {
  const carousy_default_styles = createDomElement("style", {
    id: "d_c_default_styles",
  });

  carousy_default_styles.innerHTML = defaultCarousyStyle();
  // Add styles to <head/>
  $("head").appendChild(carousy_default_styles);

  Carousy.prototype.removeDefaultStyles = function () {
    carousy_default_styles.remove();
  };
};
