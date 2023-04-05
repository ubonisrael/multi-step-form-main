//initialize step value
let step = 1;
//initial period value to month
let time = "Month";

//get form
const form = document.forms[0]

//has user reached the subscription confirmation step
let confirm = false;

//get all the section (steps)
const sections = document.querySelectorAll(".step");

//get p elements in naviagation
const navItems = document.querySelectorAll(".circled-number");

//get the next and go back buttons
const btnContainer = document.querySelector(".btn-container");
const nextBtn = document.querySelector(".next");
const backBtn = document.querySelector(".back");

//get all the primary pricing options
const options = document.querySelectorAll(".pricing_option");
let planPrice = {};

//get the monthly or yearly periods
const month_container = document.querySelectorAll(".month_container");
const year_container = document.querySelectorAll(".year_container");
const periods = document.querySelectorAll(".period");

//get error messages
const errorElem = document.querySelectorAll(".error_msg");
const planErr = document.querySelectorAll('.plan_error')

//get all input element  ===> user details (step one)
const userDetails = document.querySelectorAll(".user_details-input");

//add an event listener to remove error messages on change
userDetails.forEach((elem, i) =>
  elem.addEventListener("keydown", () => {
    elem.classList.remove("error");
    errorElem[i].classList.remove("active");
  })
);

//get the toggle input
const togglePeriod = document.querySelector(".switch_period");

//list of all add on options
const checkbox = document.querySelectorAll(".checkbox");
//list of add ons, init empty
let addOns = [];

const emailRegex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");

function validateUserDetails(username, email, phone) {
  //check if user has filled the name input
  if (!username.value.trim()) {
    alertError("name", username);
    return false;
  }

  //check if user has filled the email input and that the email is of the right format
  if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
    alertError("email", email);
    return false;
  }

  //check if user has filled the name input
  if (!phone.value.trim()) {
    alertError("phone", phone);
    return false;
  }

  return true;
}

function alertError(val, input) {
  if (val === "name") {
    input.classList.add("error");
    errorElem[0].classList.add("active");
  }
  if (val === "email") {
    input.classList.add("error");
    errorElem[1].classList.add("active");
  }
  if (val === "phone") {
    input.classList.add("error");
    errorElem[2].classList.add("active");
  }
  if (val === "plan") {
    input[0].classList.add("active");
    input[1].classList.add("active");
  }
}

//remove active from all other sections and add only to the current step
function activateSection() {
  sections.forEach((elem) => {
    elem.classList.remove("active");
  });

  sections[step - 1].classList.add("active");

  navItems.forEach((elem) => (elem.dataset.selected = "false"));

  navItems[step - 1].dataset.selected = "true";
}

//when next button gets clicked, get the next section
nextBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const username = document.querySelector("#name");
  const email = document.querySelector("#email");
  const phone = document.querySelector("#phone");

  const val = validateUserDetails(username, email, phone);

  if (!val) return;

  if (Object.keys(planPrice).length < 1 && step === 2) {
    alertError('plan', planErr)
    return;
  } else {
    planErr[0].classList.remove("active");
    planErr[1].classList.remove("active");
  }

  if (step < 4) {
    step++;
    nextBtn.innerHTML = "Next Step";
    activateSection();
  }

  if (step > 1 && !backBtn.classList.contains("active"))
    backBtn.classList.add("active");

  if (step === 4 && !confirm) {
    nextBtn.innerHTML = "Confirm";
    activateSection();
    confirmationStep();
    step++;
    return;
  }

  if (step > 4 && confirm) {
    form.innerHTML = `<section class="step thanks" data-id="step_five">
  <img src="/assets/images/icon-thank-you.svg" alt="thank you" />
  <h1>Thank you!</h1>
  <p>Thanks for confirming your subscription! We hope you have fun 
    using our platform. If you ever need support, please feel free 
    to email us at support@loremgaming.com.</p>
</section>`;
  }
});

//when back button gets clicked, get the prev section
backBtn.addEventListener("click", () => {
  //set confirm to false
  confirm = false;
  if (step > 1) step--;

  if (step < 4 ) nextBtn.innerHTML = 'Next Step'

  activateSection();

  if (step < 2 && backBtn.classList.contains("active"))
    backBtn.classList.remove("active");
});

//add an event listener for when it is checked
togglePeriod.addEventListener("click", () => {
  //if one of them (month) contains class active, remove from all of them and add to year collection
  if (month_container[0].classList.contains("active")) {
    month_container.forEach((elem) => {
      elem.classList.remove("active");
    });
    year_container.forEach((elem) => {
      elem.classList.add("active");
    });
  } else {
    // vice versa
    year_container.forEach((elem) => {
      elem.classList.remove("active");
    });
    month_container.forEach((elem) => {
      elem.classList.add("active");
    });
  }

  periods.forEach((element) => {
    if (element.classList.contains("active_period")) {
      element.classList.remove("active_period");
    } else {
      element.classList.add("active_period");
    }
  });

  //switch time to year if its month and vice versa
  if (time === "Month") {
    time = "Year";
  } else {
    time = "Month";
  }

  //reset the plan price and addons
  planPrice = {};
  addOns = [];
  // remove the selected class
  options.forEach((opt) => opt.classList.remove("selected"));
});

//for each option, add an event listener that adds selected and removes it from all other options
options.forEach((opt) => {
  opt.addEventListener("click", (e) => {
    options.forEach((elem) => elem.classList.remove("selected"));
    opt.classList.add("selected");
    planPrice = { [e.target.id]: e.target.dataset.price };
  });
});

//add event listeners to add and remove the options from the addon list
checkbox.forEach((box) =>
  box.addEventListener("click", (e) => {
    //check for possible index of option
    const index = addOns.findIndex(
      (elem) => elem[e.target.id] === e.target.value
    );
    if (index < 0) {
      //if option does not exist, add it
      addOns.push({ [e.target.id]: e.target.value });
      box.parentElement.classList.add('selected')
    } else {
      //if option already exists, remove it
      addOns.splice(index, 1);
      box.parentElement.classList.remove('selected')
    }
  })
);

function confirmationStep() {
  const per = time === "Month" ? "mo" : "yr";

  let total = Number(Object.values(planPrice)[0]);

  if (addOns.length > 0) {
    for (let index = 0; index < addOns.length; index++) {
      const val = Number(Object.values(addOns[index])[0]);
      total += val;
    }
  }

  const addOnsHtml = addOns.map((addon) => {
    const addonName =
      Object.keys(addon)[0] === "online_service"
        ? "Online Service"
        : Object.keys(addon)[0] === "larger_storage"
        ? "Larger Storage"
        : "Custom Profile";
    const addonVal = Object.values(addon)[0];
    return `<div>
      <p>${addonName}</p>
      <span class="text-blue fw-500">$${addonVal}/${per}</span>
      </div>`;
  });

  const confirmationStep = `
<article>
  <h1 class="personal-info fw-800 fs-700">Finishing up</h1>
  <p class="info-text">
    Double-check everything looks OK before confirming.
  </p>
</article>

<section class="summation">
  <div>
    <p class="plan_type text-blue fw-600">
      ${Object.keys(planPrice)[0]}
      <span class="fw-400 change">Change</span>
    </p>
    <span class="text-blue fw-600">$${Object.values(planPrice)[0]}/${per}</span>
  </div>
  <div class="underline"></div>
  ${addOns.length > 0 ? addOnsHtml.join("") : ""}
</section>

<article class="total">
  <p>Total (per ${time.toLocaleLowerCase()})</p>
  <span class="text-purple fs-500 fw-700">+$${total}/${per}</span>
</article>
`;

  const confirmationSection = document.querySelector(".confirmation");
  confirmationSection.innerHTML = confirmationStep;

  //get change btn
  const changeBtn = document.querySelector(".change");

  changeBtn.addEventListener("click", () => {
    step = 2;
    confirm = false;

    activateSection();
  });

  // set confirm to true
  confirm = true;
}
