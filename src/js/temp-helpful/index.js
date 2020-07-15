import ratingsTemplate from './template.js'
import { info } from 'node-sass';

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
    // get the endpoint url from the this.dataset
    // add a listener to thumb icons and report result reportEvent('surveyDisplay');
    let html = ratingsTemplate(question, yes, no, commentPrompt, thanksFeedback, thanksComments, submit, requiredField);
    this.innerHTML = html;
    this.applyListeners();
  }

  // post to: fa-go-alph-d-001.azurewebsites.net/WasHelpful

  applyListeners() {
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
      this.querySelector('.feedback-thanks').style.display = 'block';
    });
    this.querySelector('.js-feedback-no').addEventListener('click', (event) => {
      this.querySelector('.js-feedback-form').style.display = 'none';
      this.querySelector('.js-feedback-thanks').style.display = 'block';
    });
    this.querySelector('.js-feedback-submit').addEventListener('click', (event) => {
      if(feedback.value.length !== 0) {
        this.querySelector('.feedback-form-add').style.display = 'none';
        this.querySelector('.feedback-thanks-add').style.display = 'block';
        this.querySelector('.feedback-error').removeAttribute("style");
      } else {
        this.querySelector('.feedback-error').style.display = 'block';
      }
    });
  }
}
window.customElements.define('cwds-pagerating', CWDSPageRating);


/*
// Example POST method implementation:
async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

postData('https://fa-go-alph-d-001.azurewebsites.net/WasHelpful', { url: 'https://covid19.ca.gov/whati-is-open-where', helpful: 'true', comments: 'what is up' })
  .then(data => {
    console.log(data); // JSON data parsed by `data.json()` call
  });
*/