import styles from "./test-component.css";
import html from "./test-component.html";

class TestFeature extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = html;

    styles.use({ target: shadowRoot });
  }

  connectedCallback() {
    this.render();
  }

  render() {}
}

customElements.define("test-feature", TestFeature);
