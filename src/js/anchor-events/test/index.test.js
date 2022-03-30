import { expect } from '@esm-bundle/chai';
import { html, fixture } from '@open-wc/testing';

import '../src/index.js';
import '@cagov/accordion';

function resolveAfter2Seconds() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved');
    }, 500);
  });
}

describe('accordion exists', () => {
  it('has a default title', async () => {
    const el = await fixture(html`<div>
      <style>
      cagov-accordion.prog-enhanced .card-container {
        height: 0px;
      }
      cagov-accordion .card-container {
        display: block;
        overflow: hidden;
      }
      </style>

      <a id="clicktest" href="#communications">auto anchor link</a>

      <cagov-accordion>
        <details>
          <summary>Accordion title</summary>
          <div class="accordion-body">
            accordion content
          </div>
        </details>
      </cagov-accordion>
    <cagov-anchor-events />
    </div>`);

    expect(el.querySelector('.card-container').style.height).to.not.have.string('px'); // this is null unless accordion expands
    el.querySelector('#clicktest').click();

    expect(el.querySelector('h4').innerHTML).to.have.string('Communication');
    expect(el.querySelector('.card-container').style.height).to.have.string('px'); // this is null unless accordion expands

  });
});