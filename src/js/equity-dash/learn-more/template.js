import css from './index.scss';

export default function template(href, title) {
  return /*html*/`
<article class="faq-item trigger">    
<a class="faq-item-link cwdsarrow-parent" href="` + href + `">
<h4 class="faq-item-headline">` + title + `</h4>
<cwds-arrow data-class-prefix="faq" data-class-list="cwdsarrow-size-sm cwdsarrow-idle-orange cwdsarrow-hover-darkblue cwdsarrow-focus-darkblue"></cwds-arrow>
</a>
</article>
`
}