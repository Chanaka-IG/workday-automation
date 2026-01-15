import { Page, Locator, expect } from '@playwright/test';


export class JobDetailsPage {
    private readonly page: Page;
    private readonly jobDetailsSection: Locator;
    private readonly jobTitleInput: Locator;
    private readonly employmentStatusInput: Locator;
    private readonly subUnitInput: Locator;
    private readonly costCenterInput: Locator;
    private readonly locationInput: Locator;
    private readonly joinedDateInput: Locator;

    constructor(page: Page) {
        this.page = page;
        this.jobDetailsSection = page.getByRole('link', { name: 'Job ' });
        this.jobTitleInput = page.locator('#job_title_id input');
        this.employmentStatusInput = page.locator('#employment_status_id input');
        this.subUnitInput = page.locator('#subunit_id input');
        this.costCenterInput = page.locator('#costCentre_value');
        this.locationInput = page.locator('#location_id input');
        this.joinedDateInput = page.locator('#joined_date');
    }

    async jobDetailsSectionValidation(excelValues: any): Promise<boolean> {
        let flag = true;
        const errors: string[] = [];
        await this.jobDetailsSection.click();
        if (await this.jobTitleInput.inputValue() !== excelValues.puesto) {
            errors.push(`Job Title mismatch: Expected ${excelValues.puesto}, Found ${await this.jobTitleInput.inputValue()}`);
        }

        if (await this.employmentStatusInput.inputValue() !== 'CONTRATO INDETERMINADO') {
            errors.push(`Employment Status mismatch: Expected CONTRATO INDETERMINADO, Found ${await this.employmentStatusInput.inputValue()}`);
        }

        if (await this.subUnitInput.inputValue() !== excelValues.centroDeCosto) {
            errors.push(`Sub Unit mismatch: Expected ${excelValues.centroDeCosto}, Found ${await this.subUnitInput.inputValue()}`);
        }

        const costCenterValue = await this.costCenterInput.inputValue();
        const formattedCostCenter = costCenterValue.replace(/^\d+\s*-\s*/, '').trim();

        if (formattedCostCenter !== excelValues.centroDeCosto) {
            errors.push(`Cost Center mismatch: Expected ${excelValues.centroDeCosto}, Found ${formattedCostCenter}`);
        }

        if (await this.locationInput.inputValue() !== excelValues.localiDAD) {
            errors.push(`Location mismatch: Expected ${excelValues.localiDAD}, Found ${await this.locationInput.inputValue()}`);
        }
        const formattedJoinDate = new Date(excelValues.ingreso).toISOString().split('T')[0]; 

        if (await this.joinedDateInput.inputValue() !== formattedJoinDate) {
            errors.push(`Joined Date mismatch: Expected ${formattedJoinDate}, Found ${await this.joinedDateInput.inputValue()}`);
        }

        if (errors.length > 0) {
            const errorMessage = errors.join('\n');
            throw new Error(`Job Details Validation Failed:\n${errorMessage}`);
            flag = false
        }
        else{
            console.log("Job Details Section data validation completed without any issue")
        }
        return flag;
    }
}    