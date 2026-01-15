
import { Page, Locator, expect } from '@playwright/test';

export class ReportToPage {

    private readonly page: Page
    private readonly salaryDetailsSection: Locator;
    private readonly supervisorSection: Locator;
    private readonly editIcon: Locator;
    private readonly idInSupervisor: Locator;

    constructor(page: Page) {
        this.page = page;
        this.salaryDetailsSection = page.getByRole('link', { name: 'Report-to' });
        this.supervisorSection = page.locator("//span[(text())='Assigned Supervisors']");
        this.editIcon = page.locator("//td[@class='edit_item tooltipped']");
        this.idInSupervisor = page.locator("#angucomplete-title-temp-id").nth(1);

    }

    async reportToDetailsSectionValidation(excelValues: any): Promise<void> {

        let errors: any[] = [];
        await this.salaryDetailsSection.click();
        await this.supervisorSection.waitFor({ state: 'visible', timeout: 5000 })
        await this.editIcon.click();
        await this.idInSupervisor.waitFor({ state: 'visible' })

        if (await this.idInSupervisor.textContent()!== excelValues.supervisorID) {
            errors.push(`Supervisor ID mismatched. Expected ${excelValues.supervisorID} Actual ${await this.idInSupervisor.textContent()}`)
        }

        if (errors.length > 0) {
            console.log(errors)
        }

    }
}