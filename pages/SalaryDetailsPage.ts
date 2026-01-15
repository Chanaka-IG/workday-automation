
import { Page, Locator, expect } from '@playwright/test';


export class SalaryDetaillsPage {

    private readonly page: Page;
    private readonly salaryDetailsSection: Locator;
    private readonly createDocument: Locator;
    private readonly annualBasic: Locator;
    private readonly nomina: Locator;
    private readonly empresa: Locator;
    private readonly regimen: Locator;

    constructor(page: Page) {
        this.page = page;
        this.salaryDetailsSection = page.getByRole('link', { name: 'Salary ' });
        this.createDocument = page.locator("#createDocumentButton")
        this.annualBasic = page.locator("//div[@class='flex-group salary_amount-container']//input").first();
        this.nomina = page.locator("(//label[contains(.,'Periodo de nómina*')]/following::input)[1]")
        this.empresa = page.locator("(//label[normalize-space(text())='Empresa RP']/following::input)[1]")
        this.regimen = page.locator("(//label[normalize-space(text())='Regimen fiscal']/following::input)[1]")

    }

    async salaryDetailsSectionValidation(excelValues: any): Promise<boolean> {
        let flag = true;
        let errors: any[] = []
        await this.salaryDetailsSection.click();
        await this.createDocument.waitFor({ state: 'visible', timeout: 4000 })

        const annualBasicSalary = (await this.annualBasic.inputValue()).replace(/,/g, '');


        if (annualBasicSalary !== excelValues.salario) {
            errors.push(`Annual basic salary mismatched. Actual ${await this.annualBasic.inputValue()}. Expected ${excelValues.salario}`)
        }
        if (await this.nomina.inputValue() !== "QUINCENAL") {
            errors.push(`Nomina mismatched. Actual ${await this.nomina.inputValue()}. Expected QUINCENAL`)
        }
        if (await this.empresa.inputValue() !== excelValues.patronol) {
            errors.push(`Empresa mismatched. Actual ${await this.empresa.inputValue()}. Expected ${excelValues.patronol}`)
        }
        if (await this.regimen.inputValue() !== excelValues.regimeanFiscal) {
            errors.push(`Regimen mismatched. Actual ${await this.regimen.inputValue()}. Expected ${excelValues.regimeanFiscal}`)
        }

        if (errors.length > 0) {
            console.log(errors)
            flag = false;
        }
         else{
            console.log("Salary Details Section data validation completed without any issue")
        }
        return flag;

    }
}
