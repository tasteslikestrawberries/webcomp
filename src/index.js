//import './app/features/test-component/test-component.js';
import "./app/features/company-list/company-list.js";
import "./app/components/LoadingSpinner/LoadingSpinner";

const template = document.createElement("template");

template.innerHTML = `
    <app-company-list></app-company-list>
`;

class App extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

window.customElements.define("app-root", App);
