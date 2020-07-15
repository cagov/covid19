export default function (question, yes, no, commentPrompt, thanksFeedback, thanksComments, submit, requiredField) {
  return `<div class="container-fluid bg-primary ">
    <div class="container text-white pt-3 pb-3">
      <div class="row">
        <div class="col-md-5">

          <div class="js-feedback-form">
            <label>${question}</label>
            <button class="ml-4 btn btn-sm btn-outline-light underline js-feedback-yes" id="feedback-yes">${yes}</button>
            <button class="ml-4 btn btn-sm btn-outline-light underline js-feedback-no" id="feedback-no">${no}</button>
          </div>
          
          <div class="feedback-thanks d-none">${thanksFeedback}</div>
        
        </div>
        
        <div class="col-md-7">

          <div class="feedback-form-add">
              <label for="add-feedback">${commentPrompt}</label>
              <textarea name="add-feedback" class="w-90 js-add-feedback" id="add-feedback" rows="1"></textarea>
              <div class="feedback-error d-none small-text mt-0 mb-3">${requiredField}</div>
              <button class="btn d-none btn-outline-light js-feedback-submit" type="submit" id="feedback-submit">${submit}</button>
          </div>
          
          <div class="feedback-thanks-add d-none">${thanksComments}</div>
        
        </div>
      </div>
    </div>
    </div>`
}