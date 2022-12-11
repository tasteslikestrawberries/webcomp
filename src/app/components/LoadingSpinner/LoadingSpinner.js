import styles from "./LoadingSpinner.css";
const template = document.createElement('template');

template.innerHTML = "<div><span class='loader'></span></div>";

export class LoadingSpinner extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(template.content.cloneNode(true));
    styles.use({ target: shadowRoot });
  }
}

customElements.define("loading-spinner", LoadingSpinner);
