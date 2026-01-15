
import { Page, Locator, expect } from '@playwright/test';

export class BankDetailsPage {

    private readonly page: Page;
    private readonly bancoTab: Locator;
    private readonly moreTab: Locator;
    private readonly bancoInput: Locator;
    private readonly cuentaInput: Locator;
    private readonly clabeInput: Locator;


    constructor(page: Page) {
        this.page = page;
        this.bancoTab = page.getByRole('link', { name: 'Datos Bancarios ' });
        this.moreTab = page.getByRole('link', { name: 'More ' });
        this.bancoInput = page.locator("//div[@class='select-wrapper initialized']//input");
        this.cuentaInput = page.locator("(//label[normalize-space(text())='Banco Deposito']/following::input)[1]");
        this.clabeInput = page.locator("//label[normalize-space(text())='Cuenta Deposito Fiscal']/following::input");
    }

    async bankDetailsSectionValidation(excelValues: any): Promise<boolean> {

        const bankName = "HSBC"
        let flag = true;
        let errors: any[] = []


        
        if (await this.bancoTab.isVisible()) {
            await this.bancoTab.click();
        }
        else {
            await this.moreTab.click();
            await this.bancoTab.click();
        }

        await this.page.waitForTimeout(3000)
        if (await this.bancoInput.inputValue() !== bankName) {
            errors.push(`Bank mismatched. Actual ${await this.bancoInput.inputValue()} Expected ${bankName}`)

        }


        if (await this.cuentaInput.inputValue() !== excelValues.cuentaHsbc.toString()) {
            errors.push(`Bank mismatched. Actual ${await this.cuentaInput.inputValue()} Expected ${excelValues.cuentaHsbc}`)

        }


        if (await this.clabeInput.inputValue() !== excelValues.clabe.toString()) {
            errors.push(`Bank mismatched. Actual ${await this.clabeInput.inputValue()} Expected ${excelValues.clabe}`)

        }

        if (errors.length > 0) {
            console.log(errors);
            flag = false;
        }
        else {
            console.log("Bank details Section data validation completed without any issue")
        }


        return flag;

    }
}
