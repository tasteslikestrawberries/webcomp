export class CompanyService {
  url = 'https://demo-api.dotmetrics.net/v1/public/organizations/list';
  constructor(dataService) {
    this.dataService = dataService;
  }

  getCompanies() {
    try {
      const companiesData = this.dataService.getData(this.url);
      return companiesData;
    } catch (err) {
      console.error(err);
    }
  }
}