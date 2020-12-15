export default function (question, yes, no, commentPrompt, thanksFeedback, thanksComments, submit, requiredField) {
  return `<div class="feedback-form">
    <div class="feedback-form-grid">
				<div class="feedback-form-grid-col" id="yes-no">
          <div class="js-feedback-form">
            <label class="feedback-form-label" id="feedback-rating">Did you find what you were looking for?</label>
            <button class="feedback-form-button js-feedback-yes" id="feedback-yes" aria-labelledby="feedback-rating">${yes}</button>
            <button class="feedback-form-button js-feedback-no" id="feedback-no" aria-labelledby="feedback-rating">${no}</button>
          </div>
          <div class="feedback-form-thanks js-feedback-thanks" role="alert"><span class="emphasized bold">Good</span>
          <br><span class="text-300">If you have anything to add, <a href="#" class="text-white color-yellow-hover">take the survey.</a></span></div>
        </div>
        <div class="feedback-form-grid-col d-none" id="feedback-form">
          <div class="feedback-form-add text-center">
            <label class="feedback-form-label" for="add-feedback">What was the problem?</label>
            <div class="feedback-form-add-grid d-block">
              <textarea name="add-feedback" class="js-add-feedback feedback-form-textarea" id="add-feedback" rows="1"></textarea>
              <div class="feedback-form-error feedback-error" role="alert">${requiredField}</div>
            </div>
            <button class="feedback-form-button js-feedback-submit" type="submit" id="feedback-submit">${submit}</button>
          </div>
          <div class="feedback-form-thanks feedback-thanks-add" role="alert">
            <span class="emphasized bold">Thank you for your feedback.</span>
            <br><span class="text-300">If you have any other feedback about this website, <a href="#" class="text-white color-yellow-hover">take our survey.</a></span>
          </div>
				</div>
		  </div>
    </div>`
}