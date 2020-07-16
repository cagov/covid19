import ratingsTemplate from './template.js'

class CWDSPageRating extends window.HTMLElement {
  connectedCallback () {
    let question = (this.dataset.question ? this.dataset.question : 'Is this page useful?');
    let yes = (this.dataset.yes ? this.dataset.yes : 'Yes');
    let no = (this.dataset.no ? this.dataset.no : 'No');
    let commentPrompt = (this.dataset.commentPrompt ? this.dataset.commentPrompt : 'Additional comments:');
    let thanksFeedback = (this.dataset.thanksFeedback ? this.dataset.thanksFeedback : 'Thank you for your feedback!');
    let thanksComments = (this.dataset.thanksComments ? this.dataset.thanksComments : 'Thank you for your comments!');
    let submit = (this.dataset.submit ? this.dataset.submit : 'Submit');
    let requiredField = (this.dataset.requiredField ? this.dataset.requiredField : 'This field required');
    this.endpointUrl = this.dataset.endpointUrl;
    let html = ratingsTemplate(question, yes, no, commentPrompt, thanksFeedback, thanksComments, submit, requiredField);
    this.innerHTML = html;
    this.applyListeners();
  }

  applyListeners() {
    this.wasHelpful = '';
    this.querySelector('.js-add-feedback').addEventListener('focus', (event) => {
      this.querySelector('.js-feedback-submit').style.display = 'block';
    });
    let feedback = this.querySelector(".js-add-feedback");
    feedback.addEventListener('keyup', function (event) {
      if(feedback.value.length > 15) {
        feedback.setAttribute('rows', '2');
      } else {
        feedback.setAttribute('rows', '1');
      }
    });
    feedback.addEventListener('blur', (event) => {
      if(feedback.value.length !== 0) {
        this.querySelector('.js-feedback-submit').style.display = 'block';
      }
    });
    this.querySelector('.js-feedback-yes').addEventListener('click', (event) => {
      this.querySelector('.js-feedback-form').style.display = 'none';
      this.querySelector('.js-feedback-thanks').style.display = 'block';
      this.wasHelpful = 'yes';
      this.dispatchEvent(new CustomEvent("ratedPage", {
        detail: this.wasHelpful
      }));
    });
    this.querySelector('.js-feedback-no').addEventListener('click', (event) => {
      this.querySelector('.js-feedback-form').style.display = 'none';
      this.querySelector('.js-feedback-thanks').style.display = 'block';
      this.wasHelpful = 'no';
      this.dispatchEvent(new CustomEvent("ratedPage", {
        detail: this.wasHelpful
      }));
    });
    this.querySelector('.js-feedback-submit').addEventListener('click', (event) => {
      if(feedback.value.length !== 0) {
        this.querySelector('.feedback-form-add').style.display = 'none';
        this.querySelector('.feedback-thanks-add').style.display = 'block';
        this.querySelector('.feedback-error').removeAttribute("style");

        let postData = {};
        postData.url = window.location.href;
        postData.helpful = this.wasHelpful;
        postData.comments = feedback.value;
        postData.userAgent = navigator.userAgent;
        console.log(this.endpointUrl)
        console.log(postData)

        fetch(this.endpointUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => console.log(data));

      } else {
        this.querySelector('.feedback-error').style.display = 'block';
      }
    });

  }
}
window.customElements.define('cwds-pagerating', CWDSPageRating);



/*
let postData = {};
postData.url = "http://localhost:8080/";
postData.helpful = "yes";
postData.comments = "dsafjkdlfjd";
postData.userAgent = navigator.userAgent;

fetch("https://fa-go-alph-d-001.azurewebsites.net/WasHelpful?", {
  method: 'POST',
  cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  headers: {
    'Content-Type': 'application/json'
  },
  redirect: 'follow', // manual, *follow, error
  body: JSON.stringify(postData)
})
.then(response => response.json())
.then(data => console.log(data));

7/15
Deployed some Spanish surveys, thanks @carter for helping me sort out the translation approach
Was this page helpful is now a web component that sends the Yes/No click to GA as an event named helpful and posts the full dataset to cosmos if there was a comment
Using our cool api.alpha.ca.gov domain is not working with a POST so I have to post to the function domain directly which is far less cool, bugging @chad about this
Need to
Get the domain issues figured out
publish this web component to npm
Create endpoints for data retrieval
*/
