let ethnicityEmbed = /*html*/`<object class='tableauViz' width='100%' height='327px' style='display:none;'>
<param name='host_url' value='https%3A%2F%2Ftableau.cdt.ca.gov%2F' /> 
<param name='name' value='COVID-19Webversion2020-09-14Alameda&#47;Ethnicity' />
<param name='embed_code_version' value='3' /> 
<param name='site_root' value='' />
<param name='tabs' value='no' />
<param name='toolbar' value='yes' />
<param name='showAppBanner' value='false' />
</object>`;
let genderEmbed = /*html*/`<object class='tableauViz' width='100%' height='327px' style='display:none;'>
<param name='host_url' value='https%3A%2F%2Ftableau.cdt.ca.gov%2F' />  
<param name='name' value='COVID-19Webversion2020-09-14Alameda&#47;Gender' />
<param name='embed_code_version' value='3' /> 
<param name='site_root' value='' />
<param name='tabs' value='no' />
<param name='toolbar' value='yes' />
<param name='showAppBanner' value='false' />
</object>`;
let ageEmbed = /*html*/`<object class='tableauViz' width='100%' height='327px' style='display:none;'>
<param name='host_url' value='https%3A%2F%2Ftableau.cdt.ca.gov%2F' />  
<param name='name' value='COVID-19Webversion2020-09-14Alameda&#47;Age' />
<param name='embed_code_version' value='3' /> 
<param name='site_root' value='' />
<param name='tabs' value='no' />
<param name='toolbar' value='yes' />
<param name='showAppBanner' value='false' />
</object>`;

function resetToggles() {
  togglers.forEach(toggle => {
    toggle.classList.remove('toggle-active')  
  });
}

let toggleTarget = document.querySelector('.js-toggle-group-target')
let togglers = document.querySelectorAll('.js-toggle-group')
togglers.forEach(toggle => {
  toggle.addEventListener('click',function(event) {
    event.preventDefault();
    resetToggles();
    if(this.classList.contains('gender')) {
      toggleTarget.innerHTML = genderEmbed;
    }
    if(this.classList.contains('age')) {
      toggleTarget.innerHTML = ageEmbed;
    }
    if(this.classList.contains('ethnicity')) {
      toggleTarget.innerHTML = ethnicityEmbed;
    }
    this.classList.add('toggle-active');
  })
})
// listen for toggle clicks
// reset all active toggles
// set active on clicked toggle
// reset code to corresponding embed
