import ratingsTemplate from "./template.js";

class CAGOVPageFeedback extends window.HTMLElement {
  connectedCallback() {
    let question = this.dataset.question
      ? this.dataset.question
      : "Did you find what you were looking for?";
    let yes = this.dataset.yes ? this.dataset.yes : "Yes";
    let no = this.dataset.no ? this.dataset.no : "No";
    let commentPrompt = this.dataset.commentPrompt
      ? this.dataset.commentPrompt
      : "What was the problem?";
    let thanksFeedback = this.dataset.thanksFeedback
      ? this.dataset.thanksFeedback
      : "Thank you for your feedback!";
    let thanksComments = this.dataset.thanksComments
      ? this.dataset.thanksComments
      : "Thank you for your comments!";
    let submit = this.dataset.submit ? this.dataset.submit : "Submit";
    let requiredField = this.dataset.requiredField
      ? this.dataset.requiredField
      : "This field is required";
    let characterLimit = this.dataset.characterLimit
      ? this.dataset.characterLimit
      : "You have reached your character limit."
    let anythingToAdd = this.dataset.anythingToAdd
      ? this.dataset.anythingToAdd
      : "If you have anything to add,"
    let positiveSurveyUrl = this.dataset.positiveSurveyUrl
      ? this.dataset.positiveSurveyUrl
      : "https://ethn.io/85017"
    let takeTheSurvey = this.dataset.takeTheSurvey
      ? this.dataset.takeTheSurvey
      : "take the survey"
    let anyOtherFeedback = this.dataset.anyOtherFeedback
      ? this.dataset.anyOtherFeedback
      : "If you have any other feedback about this website,"
    let negativeSurveyUrl = this.dataset.negativeSurveyUrl
      ? this.dataset.negativeSurveyUrl
      : "https://ethn.io/77745"
    let takeOurSurvey = this.dataset.takeOurSurvey
      ? this.dataset.takeOurSurvey
      : "take our survey"

    this.endpointUrl = this.dataset.endpointUrl;
    let html = ratingsTemplate(
      question,
      yes,
      no,
      commentPrompt,
      thanksFeedback,
      thanksComments,
      submit,
      requiredField,
      characterLimit,
      anythingToAdd,
      positiveSurveyUrl,
      takeTheSurvey,
      anyOtherFeedback,
      negativeSurveyUrl,
      takeOurSurvey
    );
    this.innerHTML = html;
    this.applyListeners();
  }

  applyListeners() {
    this.wasHelpful = "";
    this.querySelector(".js-add-feedback").addEventListener(
      "focus",
      (event) => {
        this.querySelector(".js-feedback-submit").style.display = "block";
      }
    );
    let feedback = this.querySelector(".js-add-feedback");
    feedback.addEventListener("keyup", function (event) {
      if (feedback.value.length > 15) {
        feedback.setAttribute("rows", "3");
      } else {
        feedback.setAttribute("rows", "1");
      }
    });

    feedback.addEventListener("keydown", function (event) {
      if (feedback.value.length > 600) {
        document.querySelector(".feedback-limit-error").style.display = "block";
      } else {
        document
          .querySelector(".feedback-limit-error")
          .removeAttribute("style");
      }
    });

    feedback.addEventListener("blur", (event) => {
      if (feedback.value.length !== 0) {
        this.querySelector(".js-feedback-submit").style.display = "block";
      }
    });
    this.querySelector(".js-feedback-yes").addEventListener(
      "click",
      (event) => {
        this.querySelector(".js-feedback-form").style.display = "none";
        this.querySelector(".js-feedback-thanks").style.display = "block";
        this.wasHelpful = "yes";
        this.dispatchEvent(
          new CustomEvent("ratedPage", {
            detail: this.wasHelpful,
          })
        );
      }
    );
    this.querySelector(".js-feedback-no").addEventListener("click", (event) => {
      this.querySelector("#feedback-form").classList.remove("d-none");
      this.querySelector("#yes-no").classList.add("d-none");
      this.querySelector(".js-feedback-form").style.display = "none";
      this.querySelector(".js-feedback-thanks").style.display = "block";
      this.wasHelpful = "no";
      this.dispatchEvent(
        new CustomEvent("ratedPage", {
          detail: this.wasHelpful,
        })
      );
    });
    this.querySelector(".js-feedback-submit").addEventListener(
      "click",
      (event) => {
        if (feedback.value.length > 600) {
          document.querySelector(".feedback-limit-error").style.display =
            "block";
        }
        else {
          this.querySelector(".feedback-form-add").style.display = "none";
          this.querySelector(".feedback-thanks-add").style.display = "block";
          // this.querySelector('.feedback-error').removeAttribute("style");
          document
            .querySelector(".feedback-limit-error")
            .removeAttribute("style");

          let postData = {};
          postData.url = window.location.href;
          postData.helpful = this.wasHelpful;
          postData.comments = feedback.value;
          postData.userAgent = navigator.userAgent;

          fetch(this.endpointUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(postData),
          })
            .then((response) => response.json())
            .then((data) => console.log(data));
        }
      }
    );
  }
}
window.customElements.define("cagov-pagefeedback", CAGOVPageFeedback);
