import './app/features/websites-list/websites-list.js';

const template = document.createElement('template');

template.innerHTML = `
  <div>
    <websites-list></websites-list>
  </div>
`;

class App extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

window.customElements.define('my-app', App);
