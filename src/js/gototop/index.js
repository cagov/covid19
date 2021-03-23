// Load back-to-top button
document.body.onload = addBackToTopButon();


// Create back-to-top button
function addBackToTopButon() {
  // create a new back-to-top span element with class "return-top"
  const returnTop = document.createElement("span");
  returnTop.classList.add("return-top");
  returnTop.classList.add("button-blue");
  // this one does't need to be accessible, Screen Reader users have other options to get to the top
  returnTop.setAttribute("aria-hidden", "true");

  // add some text to the back-to-top button
  const returnContent = document.createTextNode("Top");

  // append text to the back-to-top span
  returnTop.appendChild(returnContent);

  // add the newly created element and its content into main tag
  var mainContent = document.querySelector("#main");
  mainContent.append(returnTop);

  // Add on-click event
  returnTop.addEventListener("click", goToTopFunction);

  function goToTopFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }

}



// If an user scrolls down the page for more than 400px activate back to top button
// othervise keep it invisible
var timer;
window.onscroll = function () {

  var returnTopButton = document.querySelector(".return-top");
  if (document.body.scrollTop >= 400 || document.documentElement.scrollTop >= 400) {
    // ass soon as user staarts scrolling back to top will appear
    if(timer != "undefined"){
      clearTimeout(timer);
    }
    returnTopButton.classList.add("is-visible");
    
    timer = setTimeout(function(){
      
      returnTopButton.classList.remove("is-visible");
  
    },2000) //Back to top removes itself after 2 sec of inactivity
  }
  else {
    returnTopButton.classList.remove("is-visible");
  }
};



