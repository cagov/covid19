/**
 * Animates the placeholder attribute so text appars as if it is being typed for you.
 */
// site.animateSearchPlacholder = function(){
//   var string   = window.innerWidth < 1024 ? "SEARCH" : "What are you looking for?";
//   var interval = 50;
//   var letters  = string.split("");
//   var index    = 0;

//   $("#header-search-site").attr("placeholder", "");

//   site.placeholderInterval = window.setInterval(function(){
//     current = $("#header-search-site").attr("placeholder");

//     if(letters[index]){
//       $("#header-search-site").attr("placeholder", current + letters[index]);
//       index += 1;
//     } else {
//       clearInterval(site.placeholderInterval);
//     }

//   }, interval);
// };


// // Add a class when the search fields are focused
// $("body").on("focus", "#header-search-site, .header-search-button, .header-search-label", function(){
//   $(".header-search").addClass("focused");
// });
// $("body").on("focus", ".expanded-menu-search-label, .expanded-menu-search-field, .expanded-menu-search-button", function(){
//   $(".expanded-menu-search").addClass("focused");
// });

// // Remove a class when the search fields are blurred
// $("body").on("blur", "#header-search-site, .header-search-button, .header-search-label", function(){
//   $(".header-search").removeClass("focused");
// });
// $("body").on("blur", "expanded-menu-search-label, .expanded-menu-search-field, .expanded-menu-search-button", function(){
//   $(".expanded-menu-search").removeClass("focused");
// });  

/**
   * DO THIS ON PAGE LOAD
   */
  // site.animateSearchPlacholder();

