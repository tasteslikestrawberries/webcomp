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
    this.onLoading();
  }

  onLoading() {
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
      this.onLoading();
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
      companyItem.dataset.id = id;
      companyName.textContent = name;

      websitesList.classList.add(`website-list-${id}`);
      websitesList.dataset.id = id;
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

      const sectionList = this.findElement(
        ".section-list",
        websiteTemplateClone
      );
      sectionList.classList.add(`section-list-${id}`);
      sectionList.dataset.id = id;

      const sectionCaretIcon = this.findElement(
        ".icon-caret",
        websiteTemplateClone
      );
      sectionCaretIcon.classList.add(`icon-caret-${id}`);

      websiteItem.addEventListener("click", this.onToggleSections.bind(this));

      websiteItem.classList.add(`website-item-${id}`);
      websiteItem.dataset.id = id;
      websiteName.textContent = name;
      websiteSectionsCount.textContent = sections?.length ?? 0;

      const { label, color } = this.getStatus(status) ?? {};
      websiteStatus.textContent = label;

      websiteStatusIndicator.style.backgroundColor = color;
      if (color === "white") {
        websiteStatusIndicator.style.border = "1px solid #333333";
      }
      websitesList.appendChild(websiteTemplateClone);
    });
  }

  getStatus(status) {
    return {
      0: { label: "N/A", color: "white" },
      1: { label: "Operational", color: "#27AE60" },
      2: { label: "Not operational", color: "red" },
      3: { label: "Partial", color: "yellow" },
      4: { label: "Pending", color: "yellow" },
      5: { label: "Stopped", color: "#BDBDBD" },
    }[status];
  }

  renderSections(companyId, websiteId) {
    const sectionList = this.findElement(`.section-list-${websiteId}`);
    const sectionTemplate = this.findElement(".section-template");
    const caretIcon = this.findElement(`.icon-caret-${websiteId}`);

    if (sectionList.style.display === "block") {
      sectionList.style.display = "none";
      caretIcon.classList.remove("with-rotate");
      caretIcon.style.borderLeftColor = "#828282";
    } else {
      sectionList.style.display = "block";
      caretIcon.classList.add("with-rotate");
      caretIcon.style.borderLeftColor = "#2f80ed";
    }

    if (sectionList.children.length !== 0) {
      return;
    }

    const company = this.data.result.find(
      ({ id }) => companyId === id.toString()
    );
    const website = company.websites.find(
      ({ id }) => websiteId === id.toString()
    );

    website.sections.map(({ id, name, status }) => {
      const sectionTemplateClone = sectionTemplate.content.cloneNode(true);

      const sectionItem = this.findElement(
        ".section-item",
        sectionTemplateClone
      );

      const sectionName = this.findElement(
        ".section-item--name",
        sectionTemplateClone
      );

      const sectionStatusIndicator = this.findElement(
        ".section-item--status-indicator",
        sectionTemplateClone
      );

      const { label, color } = this.getStatus(status) ?? {};

      sectionStatusIndicator.style.backgroundColor = color;
      if (color === "white") {
        sectionStatusIndicator.style.border = "1px solid #333333";
      }

      const tooltipTextElement = this.findElement(
        ".tooltip-text",
        sectionTemplateClone
      );
      tooltipTextElement.textContent = label;
      sectionItem.classList.add(`section-item-${id}`);
      sectionItem.dataset.id = id;
      sectionName.textContent = name;

      sectionList.appendChild(sectionTemplateClone);
    });
  }

  onToggleSections(ev) {
    const websiteItem = ev.currentTarget;
    const websiteList = websiteItem.parentNode;
    this.renderSections(websiteList.dataset.id, websiteItem.dataset.id);
  }
}

customElements.define("app-company-list", CompanyList);
