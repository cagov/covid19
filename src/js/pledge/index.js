import serialize from "./serialize.js";

if (document.querySelector(".js-submit-pledge")) {
  document
    .querySelector(".js-submit-pledge")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      let serializedForm = serialize(this);
      document.querySelector(".js-submit-button").innerHTML = "Thank you";
      setTimeout(function () {
        document.querySelector(".js-submit-pledge").classList.add("d-none");
        document.querySelector(".submit-response").classList.remove("d-none");
      }, 300);
      fetch("https://api.alpha.ca.gov/Pledge?" + serializedForm, {
        method: "GET",
        redirect: "follow",
      });
    });
}
