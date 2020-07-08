// On focus event
document
    .querySelector('#add-feedback')
    .addEventListener('focus', function (event) {
      
      document.querySelector('#feedback-submit').style.display = 'block';
      
    });



    // On blur event 
    var feedback = document.getElementById("add-feedback");

    feedback.addEventListener('blur', function (event) {

      if(feedback.value.length !== 0) {
        // not empty
          document.querySelector('#feedback-submit').style.display = 'block';
      }
      // empty
      else {
        // document.querySelector('#feedback-submit').removeAttribute("style");
      }
      
      
      
    });


// on yes click event
    document
    .querySelector('#feedback-yes')
    .addEventListener('click', function (event) {
      
      document.querySelector('.feedback-form').style.display = 'none';
      document.querySelector('.feedback-thanks').style.display = 'block';
    });


    // on no click event
    document
    .querySelector('#feedback-no')
    .addEventListener('click', function (event) {
      document.getElementById("add-feedback").focus();
    });


    // on submit click event
    document
    .querySelector('#feedback-submit')
    .addEventListener('click', function (event) {

      var feedback = document.getElementById("add-feedback");
      
      if(feedback.value.length !== 0) {
        // not empty
        document.querySelector('.feedback-form').style.display = 'none';
        document.querySelector('.feedback-thanks').style.display = 'block';
        document.querySelector('.feedback-error').removeAttribute("style");
      }
      // empty
      else {
        document.querySelector('.feedback-error').style.display = 'block';
      }
    });