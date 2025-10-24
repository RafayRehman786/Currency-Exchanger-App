const BASE_URL = "https://api.currencyapi.com/v3/latest";
const API_KEY = "cur_live_nZ3ygqRDldbew45EIQ8g3i8JGYUMwWjSccz5nY3f";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "PKR") {
      newOption.selected = true;
    }

    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
  let amountInput = document.querySelector(".amount input");
  let amtVal = amountInput.value;

  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amountInput.value = "1";
  }

  const base = fromCurr.value;
  const target = toCurr.value;

  const URL = `${BASE_URL}?apikey=${API_KEY}&base_currency=${base}&currencies=${target}`;

  try {
    let response = await fetch(URL);
    let data = await response.json();

    // Extract exchange rate
    let rate = data.data[target]?.value;

    if (!rate) {
      msg.innerText = `Could not fetch rate for ${base} to ${target}`;
      return;
    }

    let finalAmount = (amtVal * rate).toFixed(2);
    msg.innerText = `${amtVal} ${base} = ${finalAmount} ${target}`;
  } catch (error) {
    msg.innerText = "Error fetching exchange rate.";
    console.error(error);
  }
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode]; // Assuming countryList maps "USD" => "US", etc.
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  if (img) {
    img.src = newSrc;
  }
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
