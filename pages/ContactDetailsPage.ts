import { Page, Locator, expect } from '@playwright/test';


export class ContactDetailsPage {

    private readonly page: Page;
    private readonly contactDetailsSection: Locator;
    private readonly address1: Locator;
    private readonly address2: Locator;
    private readonly city: Locator;
    private readonly state: Locator;
    private readonly zip: Locator;
    private readonly mobile: Locator;
    private readonly district: Locator;

    constructor(page: Page) {
        this.page = page;
        this.address1 = page.locator("#street1");
        this.address2 = page.locator("#street2");
        this.city = page.locator("#city");
        this.state = page.locator("#province");
        this.zip = page.locator("#emp_zipcode");
        this.mobile = page.locator("#emp_mobile");
        this.district = page.locator("//label[normalize-space(text())='Other Email']/following::input");
        this.contactDetailsSection = page.getByRole('link', { name: 'Contact Details ' });
    }

    async contactDetailsSectionValidation(excelValues: any): Promise<boolean> {

        let flag = true;
        let errors: any[] = [];

        await this.contactDetailsSection.click();

        if (await this.address1.inputValue() !== excelValues.CALLE) {
            errors.push(`Address street 1 mismatched. Actual ${await this.address1.inputValue()} Expected ${excelValues.CALLE}`)
        }

        if (await this.address2.inputValue() !== excelValues.noExterior) {
            errors.push(`Address street 2 mismatched. Actual ${await this.address2.inputValue()} Expected ${excelValues.noExterior}`)
        }

        if (await this.city.inputValue() !== excelValues.delegasionOMunicipio) {
            errors.push(`City mismatched. Actual ${await this.city.inputValue()} Expected ${excelValues.delegasionOMunicipio}`)
        }

        if (await this.state.inputValue() !== excelValues.Ciudad) {
            errors.push(`State mismatched. Actual ${await this.state.inputValue()} Expected ${excelValues.Ciudad}`)
        }

        if (await this.zip.inputValue() !== excelValues.postal.toString()) {
            errors.push(`Zip Postal mismatched. Actual ${await this.zip.inputValue()} Expected ${excelValues.postal}`)
        }

        if (await this.mobile.inputValue() !== excelValues.celular.toString()) {
            errors.push(`Mobile mismatched. Actual ${await this.mobile.inputValue()} Expected ${excelValues.celular}`)
        }

        if (await this.district.inputValue() !== excelValues.colonia) {
            errors.push(`District mismatched. Actual ${await this.district.inputValue()} Expected ${excelValues.colonia}`)
        }

        if (errors.length > 0){
            console.log(errors);
            flag = false;
        }
         else{
            console.log("Contact details Section data validation completed without any issue")
        }


        return flag;

    }
}
