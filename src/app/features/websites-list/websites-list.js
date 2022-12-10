import styles from "./websites-list.css";
import html from "./websites-list.html";

class WebsitesList extends HTMLElement {
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

customElements.define("websites-list", WebsitesList);
