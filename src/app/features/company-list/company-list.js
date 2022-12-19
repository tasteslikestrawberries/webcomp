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
    const websitesList = this.shadowRoot.querySelector(`.website-list-${id}`);
    websitesList.style.display =
      websitesList.style.display === "block" ? "none" : "block";

    if (websitesList.children.length !== 0) {
      return;
    }

    const websiteTemplate = this.shadowRoot.querySelector(".website-template");

    const company = this.data.result.find(
      (company) => id === company.id.toString()
    );
    company.websites.forEach(({ id, name, sections, status }) => {
      const websiteTemplateClone = websiteTemplate.content.cloneNode(true);
      const websiteItem = websiteTemplateClone.querySelector(".website-item");
      const websiteName = websiteTemplateClone.querySelector(
        ".website-item--name"
      );
      const websiteSectionsCount = websiteTemplateClone.querySelector(
        ".website-item--sections-count"
      );
      const websiteStatus = websiteTemplateClone.querySelector(
        ".website-item--status"
      );
      const websiteStatusIndicator = websiteTemplateClone.querySelector(
        ".website-item--status-indicator"
      );
      websiteItem.classList.add(`website-item-${id}`);
      websiteName.textContent = name;
      websiteSectionsCount.textContent = sections?.length ?? 0;
      const { label, color } = this.getWebsiteStatus(status) ?? {};
      websiteStatus.textContent = label;
      websiteStatusIndicator.style.backgroundColor = color;
      if (color === "white") {
        websiteStatusIndicator.style.border = "1px solid #333333";
      }
      websitesList.appendChild(websiteItem);
    });
  }

  onToggleCompany(e) {
    this.renderCompanyWebsites(e.currentTarget.dataset.id);
  }

  getWebsiteStatus(status) {
    return {
      0: { label: "N/A", color: "white" },
      1: { label: "Operational", color: "#27AE60" },
      2: { label: "Not operational", color: "red" },
      3: { label: "Partial", color: "yellow" },
      4: { label: "Pending", color: "yellow" },
      5: { label: "Stopped", color: "#BDBDBD" },
    }[status];
  }

  renderCompanyList(data) {
    const ulElement = this.shadowRoot.querySelector(".company-list");
    const companyTemplate = this.shadowRoot.querySelector(".company-template");

    data.result.map(({ name, id }) => {
      const companyTemplateClone = companyTemplate.content.cloneNode(true);

      const companyItem = companyTemplateClone.querySelector(".company-item");
      const websitesList = companyTemplateClone.querySelector(".website-list");
      const companyName = companyTemplateClone.querySelector(
        ".company-item--name"
      );

      companyItem.addEventListener("click", this.onToggleCompany.bind(this));

      companyItem.classList.add(`company-item-${id}`);
      companyItem.dataset.isExpanded = false;

      companyItem.dataset.id = id;
      companyName.textContent = name;

      websitesList.classList.add(`website-list-${id}`);
      websitesList.id = `website-list-${id}`;

      ulElement.appendChild(companyTemplateClone);
    });
  }
}

customElements.define("app-company-list", CompanyList);
