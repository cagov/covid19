export default function loadTwitterFeed() {
  if(window.innerWidth >= 1024 || window.innerHeight >= 1024) {
    let el = document.querySelector('.twitter-feed')
    el.innerHTML = `<a class="twitter-timeline" data-height="400" data-width="100%" href="https://twitter.com/CAPublicHealth?ref_src=twsrc%5Etfw">Tweets by CAPublicHealth</a>`;
    var newScript = document.createElement("script");
    newScript.src = "https://platform.twitter.com/widgets.js";
    document.head.appendChild(newScript);
  }
}
