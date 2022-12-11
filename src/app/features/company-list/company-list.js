import styles from "./company-list.css";
import html from "./company-list.html";
import { CompanyService } from "../../services/company-service";
import { DataService } from "../../services/data-service";

class CompanyList extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = html;

    styles.use({ target: shadowRoot });

    const dataService = new DataService();
    this.companyService = new CompanyService(dataService);
  }

  connectedCallback() {
    this.fetchCompaniesAndDisplayData();
    this.render();
  }

  render() {
    if (this.isLoading) {
      const loadingSpinner = document.createElement("loading-spinner");
      this.shadowRoot.appendChild(loadingSpinner);
    } else {
      const loadingSpinner = this.shadowRoot.querySelector("loading-spinner");
      this.shadowRoot.removeChild(loadingSpinner);
    }
  }

  async fetchCompaniesAndDisplayData() {
    this.isLoading = true;
    this.companyService.getCompanies().then((data) => {
      this.renderCompanyList(data);
      this.isLoading = false;
      this.render();
      this.data = data;
    });
  }

  renderCompanyWebsites(id) {
    const companyItem = this.shadowRoot.querySelector(`.company-item-${id}`);
    const websitesList = companyItem.querySelector(".website-list");

    const websiteTemplate = this.shadowRoot.querySelector(".website-template");
    const websiteTemplateClone = websiteTemplate.content.cloneNode(true);

    const websiteName = websiteTemplateClone.querySelector( ".website-item--name");
    websiteName.textContent = this.data.find((company) => id === company.id);
  }

  onToggleCompany(e) {
    e.currentTarget.dataset.isExpanded = !e.currentTarget.dataset.isExpanded;
    this.renderCompanyWebsites(e.currentTarget.dataset.id);
  }

  renderCompanyList(data) {
    const ulElement = this.shadowRoot.querySelector(".company-list");
    const companyTemplate = this.shadowRoot.querySelector(".company-template");

    data.result.map(({ name, id }) => {
      const companyTemplateClone = companyTemplate.content.cloneNode(true);

      const companyItem = companyTemplateClone.querySelector(".company-item");
      const companyName = companyTemplateClone.querySelector(
        ".company-item--name"
      );

      const toggleCompanyBtn = companyTemplateClone.querySelector(
        ".btn--toggleCompany"
      );
      toggleCompanyBtn.addEventListener(
        "click",
        this.onToggleCompany.bind(this)
      );

      companyItem.classList.add(`company-item-${id}`);
      companyItem.dataset.isExpanded = false;

      toggleCompanyBtn.dataset.id = id;
      companyName.textContent = name;

      ulElement.appendChild(companyTemplateClone);
    });
  }
}

customElements.define("app-company-list", CompanyList);
