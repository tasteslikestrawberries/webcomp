import './app/features/websites-list/websites-list.js';
import './app/features/test-component/test-component.js';

const template = document.createElement('template');

template.innerHTML = `
    <test-component></test-component>
    <websites-list></websites-list>
`;

class App extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

window.customElements.define('my-app', App);
