import templatize from './template.js';

class LearnMoreLinks extends window.HTMLElement {
    // console.log("learnmoredefined");
    connectedCallback() {
        // console.log("Learn more callback",this);
        // process the list...
        let innerHTML = '';
        this.querySelectorAll('a').forEach(function(a,i) {
            console.log("A:",a);
            let href = a.getAttribute('href');
            let title = a.innerText;
            innerHTML += templatize(href, title);
        });
        this.classList.remove('d-none');
        this.innerHTML = innerHTML;
    }
}
window.customElements.define('learn-more-links', LearnMoreLinks);
