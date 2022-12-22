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
      const loadingSpinner = this.findElement("loading-spinner");
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

  findElement(className, templateClone) {
    if (templateClone) {
      return templateClone.querySelector(className);
    }
    return this.shadowRoot.querySelector(className);
  }

  renderCompanyList(data) {
    const ulElement = this.findElement(".company-list");
    const companyTemplate = this.findElement(".company-template");

    data.result.map(({ name, id }) => {
      const companyTemplateClone = companyTemplate.content.cloneNode(true);

      const companyItem = this.findElement(
        ".company-item",
        companyTemplateClone
      );
      const websitesList = this.findElement(
        ".website-list",
        companyTemplateClone
      );
      const companyName = this.findElement(
        ".company-item--name",
        companyTemplateClone
      );
      const caretIcon = this.findElement(".icon-caret", companyTemplateClone);

      companyItem.addEventListener("click", this.onToggleCompany.bind(this));

      companyItem.classList.add(`company-item-${id}`);
      companyItem.dataset.isExpanded = false;

      companyItem.dataset.id = id;
      companyName.textContent = name;

      websitesList.classList.add(`website-list-${id}`);
      caretIcon.classList.add(`icon-caret-${id}`);
      websitesList.id = `website-list-${id}`;

      ulElement.appendChild(companyTemplateClone);
    });
  }

  onToggleCompany(ev) {
    this.renderCompanyWebsites(ev.currentTarget.dataset.id);
  }

  renderCompanyWebsites(id) {
    const websitesList = this.findElement(`.website-list-${id}`);
    const caretIcon = this.findElement(`.icon-caret-${id}`);
    if (websitesList.style.display === "block") {
      websitesList.style.display = "none";
      caretIcon.classList.remove("with-rotate");
      caretIcon.style.borderLeftColor = "#828282";
    } else {
      websitesList.style.display = "block";
      caretIcon.classList.add("with-rotate");
      caretIcon.style.borderLeftColor = "#2f80ed";
    }

    if (websitesList.children.length !== 0) {
      return;
    }

    const websiteTemplate = this.findElement(".website-template");

    const company = this.data.result.find(
      (company) => id === company.id.toString()
    );

    company.websites.forEach(({ id, name, sections, status }) => {
      const websiteTemplateClone = websiteTemplate.content.cloneNode(true);
      const websiteItem = this.findElement(
        ".website-item",
        websiteTemplateClone
      );
      const websiteName = this.findElement(
        ".website-item--name",
        websiteTemplateClone
      );
      const websiteSectionsCount = this.findElement(
        ".website-item--sections-count",
        websiteTemplateClone
      );
      const websiteStatus = this.findElement(
        ".website-item--status",
        websiteTemplateClone
      );
      const websiteStatusIndicator = this.findElement(
        ".website-item--status-indicator",
        websiteTemplateClone
      );

      websiteItem.classList.add(`website-item-${id}`);
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
}

customElements.define("app-company-list", CompanyList);
