import Carousy from "./carousy.js";

/*
 * Variables & Constants : will be used in code
 */
const //
  menu_toggle = select(".vidds_header .ham"),
  sidebar = select("aside"),
  sidebar_overlay = select(".aside-overlay"),
  //
  btn_profile = select("span.avatar"), // 1st dropdown toggler
  dpd_profile = select("div.dpd_profile"), // 1st dropdown
  //
  btn_create_video = select("button.create_video"), // 2nd dropdown toggler
  dpd_create_video = select("div.dpd_create_video"), // 2nd dropdown
  //
  btn_custom_video = select("button.btn_custom_video"), // 3rd dropdown toggler
  dpd_custom_video = select("div.dpd_custom_video"), // 3rd dropdown
  //
  btn_brandkit = select("button.btn_create_brandkit"),
  brandkit_overlay = select("div.brandkit_modal_overlay"),
  brandkit_modal = select("div.brandkit_container"),
  //
  routePaths = select("aside li", true),
  mainView = select("section.vidds_main_container"),
  expand_accordian = select(".expand_accordian"),
  // color_pickers
  color_pickers = select("div.set_color > span", true),
  //
  bottom_checkboxes_dpd = select("div.bottom_checkboxes");

// Making an Elemnt a Carousal with new Carousay()
const carousy_config = {
  slidesToScroll: 2,
  navButtons: true,
};
const carousy1 = new Carousy(".carousy1", carousy_config); // dashboard carousal 1
const carousy2 = new Carousy(".carousy2", carousy_config); // dashboard carousal 2
const carousy3 = new Carousy(".carousy3", carousy_config); // my vidds carousal
const carousy4 = new Carousy(".carousy4", carousy_config); // tutorials carousal
const carousy5 = new Carousy(".carousy5", carousy_config); // brand kits carousal

/*
 * Functions Called() in main code section
 */

// document.querySelector() : retruns array of elements if 2nd parameter is truthy.
function select(str, bool) {
  return bool ? document.querySelectorAll(str) : document.querySelector(str);
}

// handle Screen size change
function updateDropdownPositions() {
  mainView.addEventListener("scroll", setDropdownPositions);
  window.addEventListener("resize", setDropdownPositions);
}

// Assign Click handlers
function listenToClickOnElements(handlers) {
  for (const [element, handler] of handlers[Symbol.iterator]()) {
    try {
      element.addEventListener("click", handler);
    } catch (e) {
      element.forEach((el) => el.addEventListener("click", handler));
    }
  }
}

// set dropdowns(DPD) to their positions
function setDropdownPositions() {
  const screen_is_small = window.innerWidth < 576;

  const dropdowns = new Map([
    // [ toggler, dropdown ] Pairs
    [btn_profile, dpd_profile],
    [btn_create_video, dpd_create_video],
    [btn_custom_video, dpd_custom_video],
  ]);

  for (const [btn_toggle, dropdown] of dropdowns[Symbol.iterator]()) {
    const { bottom, right } = btn_toggle.getBoundingClientRect();
    var dropdown_position = {
      top: bottom + "px",
      left: right + "px",
    };
    if (screen_is_small && dropdown == dpd_create_video)
      dropdown_position = {
        top: "unset",
        left: 0,
        bottom: 0,
      };

    Object.assign(dropdown.style, dropdown_position);
  }
}

// Sidebar in-out
function handleMenuToggle() {
  const prevAttr = sidebar_overlay.getAttribute("data-maximized");
  sidebar_overlay.setAttribute("data-maximized", prevAttr !== "true");
}

// Dropdowns Togglers : dpd
function toggleProfileDPD() {
  setDropdownPositions();
  const prevAttr = dpd_profile.getAttribute("data-modal-hidden");
  dpd_profile.setAttribute("data-modal-hidden", prevAttr !== "true");
}
// dpd
function toggleCreateVidDPD() {
  setDropdownPositions();
  const prevAttr = dpd_create_video.getAttribute("data-modal-hidden");
  dpd_create_video.setAttribute("data-modal-hidden", prevAttr !== "true");
}
// dpd
function toggleCustomVidDPD() {
  setDropdownPositions();
  const prevAttr = dpd_custom_video.getAttribute("data-modal-hidden");
  dpd_custom_video.setAttribute("data-modal-hidden", prevAttr !== "true");
}
// Brandkit Modal Handler
function handleBrandkitModal() {
  const prevAttr = brandkit_overlay.getAttribute("data-modal-hidden");
  brandkit_overlay.setAttribute("data-modal-hidden", prevAttr !== "true");
}
// close create video dropdown
function close_dpd_create_video() {
  dpd_create_video.setAttribute("data-modal-hidden", true);
}
// Click on sidebar tabs
function handleRouteClick() {
  const link = this;
  const path = this.getAttribute("data-path");
  const link_is_not_active = !this.hasAttribute("active");

  if (link_is_not_active) {
    // remove active from prev. active link
    sidebar.querySelector("li[active]").removeAttribute("active");

    // set active to current clicked link
    link.setAttribute("active", "");

    // open clicked view in main section.
    openInMainView(path);
  }

  if (window.innerWidth > 992) return;
  handleMenuToggle();
}
// Update main view
function openInMainView(route) {
  const prevActive = mainView.querySelector("div[active-route]");
  const currActive = mainView.querySelector(`div[data-route="${route}"]`);

  prevActive.removeAttribute("active-route");
  currActive.setAttribute("active-route", "");
}

// Expand like accordian
function handleExpand(e) {
  const expandDiv = e.target.parentElement.nextElementSibling;

  if (!expandDiv.classList.contains("expand-active")) {
    expandDiv.style.maxHeight = expandDiv.scrollHeight + "px";
    expandDiv.classList.add("expand-active");
  } else {
    expandDiv.style.maxHeight = "0px";
    expandDiv.classList.remove("expand-active");
  }
}

// Opens pallete to choose color.
function attachColorPicker(el) {
  const pickr = Pickr.create({
    el,
    theme: "nano",
    useAsButton: true,
    lockOpacity: true,

    components: {
      preview: true,
      hue: true,

      // Input / output Options
      interaction: {
        hex: true,
        rgba: true,
        input: true,
        save: true,
      },
    },
  });

  pickr.on("save", (color, instance) => {
    const el = instance.options.el;
    color = color.toHEXA().toString();

    el.style.setProperty("--color", color);
  });
}

// the button at bottom with zap icon
function handleProgressPopup() {
  const isOpen = bottom_checkboxes_dpd.getAttribute("data-progress-show");
  bottom_checkboxes_dpd.setAttribute("data-progress-show", isOpen !== "true");
}

/*---------------------------- MAIN  -----------------------------*/

setDropdownPositions(); // when first loaded
updateDropdownPositions(); // like on screen-resize

/* new Map() of Elements and their Click-Handlers */
const element_clickHandler_list = new Map([
  [menu_toggle, handleMenuToggle], // hamburger
  [sidebar_overlay, handleMenuToggle], // sidebar
  [sidebar, (e) => e.stopPropagation()],
  [btn_profile, toggleProfileDPD], // profile avatar
  [btn_create_video, toggleCreateVidDPD],
  [select(".btn_create_video_close"), close_dpd_create_video],
  [btn_custom_video, toggleCustomVidDPD],
  [brandkit_overlay, handleBrandkitModal],
  [btn_brandkit, handleBrandkitModal],
  [brandkit_modal, (e) => e.stopPropagation()],
  [select("div.brandkit_close"), handleBrandkitModal],
  [routePaths, handleRouteClick], // sidebar links/tabs
  [expand_accordian, handleExpand],
  [select(".progress_counter .button"), handleProgressPopup],
  [select(".checkboxes_container .close"), handleProgressPopup],
]);

// Assign Click handlers. P.S: to keep code clean
listenToClickOnElements(element_clickHandler_list);

// Attach Color picker on brandkit color picker
color_pickers.forEach((span) => attachColorPicker(span));
