export default function (question, yes, no, commentPrompt, thanksFeedback, thanksComments, submit, requiredField) {
  return `<div class="feedback-form">
    <div class="feedback-form-grid">
				<div class="feedback-form-grid-col" id="yes-no">
          <div class="js-feedback-form">
            <label class="feedback-form-label font-size-1-5em" id="feedback-rating">Did you find what you were looking for?</label>
            <button class="button-white mr-2 js-feedback-yes" id="feedback-yes" aria-labelledby="feedback-rating">${yes}</button>
            <button class="button-white ml-3 js-feedback-no" id="feedback-no" aria-labelledby="feedback-rating">${no}</button>
          </div>
          <div class="feedback-form-thanks js-feedback-thanks" role="alert"><span class="font-size-1-5em bold mb-3">Good</span>
          <br><span class="text-300">If you have anything to add, <a href="https://ethn.io/85017" class="color-secondary color-orange-hover">take the survey.</a></span></div>
        </div>
        <div class="col-md-6 mx-auto d-none" id="feedback-form">
          <div class="feedback-form-add text-center">
            <label class="feedback-form-label font-size-1-5em for="add-feedback">What was the problem?</label>
            <div class="feedback-form-add-grid d-block">
              <textarea name="add-feedback" class="js-add-feedback feedback-form-textarea" id="add-feedback" rows="1"></textarea>
              <div class="feedback-form-error feedback-error color-yellow" role="alert">${requiredField}</div>
              <div class="feedback-form-error feedback-limit-error color-yellow" role="alert">You have reached your character limit.</div>
            </div>
            <button class="button-white mt-4 mx-auto js-feedback-submit" type="submit" id="feedback-submit">${submit}</button>
          </div>
          <div class="feedback-form-thanks feedback-thanks-add" role="alert">
            <span class="font-size-1-5em bold">Thank you for your feedback.</span>
            <p class="text-300  mt-3">If you have any other feedback about this website, <a href="https://ethn.io/77745" class="color-secondary color-orange-hover">take our survey.</a></p>
          </div>
				</div>
		  </div>
    </div>`
}