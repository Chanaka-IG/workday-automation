import { Page, Locator, expect } from '@playwright/test';
import { ENV } from '../config/env';

export class PersonalDetailsPage {
    private readonly page: Page;
    private readonly personalDetailsSection: Locator;
    private readonly firstNameInput: Locator;
    private readonly lastNameInput: Locator;
    private readonly middleNameInput: Locator;
    private readonly employeeIdInput: Locator;
    private readonly otherIdInput: Locator;
    private readonly rfcInput: Locator;
    private readonly sinInput: Locator;
    private readonly dobInput: Locator;
    private readonly maritalStatusInput: Locator;
    private readonly genderInput: Locator;
    private readonly placeOfBirthInput: Locator;

    constructor(page: Page) {
        this.page = page;
        this.personalDetailsSection = page.getByRole('link', { name: 'Personal Details ' });
        this.firstNameInput = page.locator('#firstName');
        this.lastNameInput = page.locator('#lastName');
        this.middleNameInput = page.locator('#middleName');
        this.employeeIdInput = page.locator('#employeeId');
        this.otherIdInput = page.locator('#otherId');
        this.rfcInput = page.locator('#ssn');
        this.sinInput = page.locator('#sin');
        this.dobInput = page.locator('#emp_birthday');
        this.maritalStatusInput = page.locator('//div[@id=\'emp_marital_status_inputfileddiv\']//input');
        this.genderInput = page.locator('//div[@id=\'emp_gender_inputfileddiv\']//input');
        this.placeOfBirthInput = page.locator("//div[@class='input-field col s12 m12 l6']//input");
    }

    async personalDetailsSectionValidation(excelValues: any): Promise<void> {
        const errors: string[] = [];
        const excelValueforGender: Record<string, string> = {
            F: 'Female',
            M: 'Male'
        };
        const maritalMap: Record<string, string> = {
            'soltero(a)': 'Single',
            'casado(a)': 'Married',
        };


        let formattedDate = '';
        try {
            const natal = excelValues.nacimento;
            if (natal instanceof Date) {
                formattedDate = natal.toISOString().split('T')[0];
            } else if (typeof natal === 'string') {
                if (natal.includes('/')) {
                    const [day, month, year] = natal.split('/');
                    formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                } else {
                    formattedDate = natal.split('T')[0];
                }
            } else if (typeof natal === 'number') {
                formattedDate = String(natal);
            } else {
                formattedDate = String(natal ?? '');
            }
        } catch (e) {
            console.warn('Error parsing birth date:', e);
            formattedDate = String(excelValues.nacimento ?? '');
        }

        await this.personalDetailsSection.click();

        if (await this.firstNameInput.inputValue() !== excelValues.Nombre) {
            errors.push(`First Name mismatch: Expected ${excelValues.Nombre}, Found ${await this.firstNameInput.inputValue()}`);
        }

        if (await this.middleNameInput.inputValue() !== excelValues.ApellidoPaterno) {
            errors.push(`Middle Name mismatch: Expected ${excelValues.ApellidoPaterno}, Found ${await this.middleNameInput.inputValue()}`);
        }

        if (await this.lastNameInput.inputValue() !== excelValues.ApellidoMaterno) {
            errors.push(`Last Name mismatch: Expected ${excelValues.ApellidoMaterno}, Found ${await this.lastNameInput.inputValue()}`);
        }

        if ((await this.employeeIdInput.inputValue()).trim() !== String(excelValues.No).trim()) {
            errors.push(`Employee ID mismatch: Expected ${excelValues.No}, Found ${await this.employeeIdInput.inputValue()}`);
        }

        if (await this.otherIdInput.inputValue() !== excelValues.curp) {
            errors.push(`Other ID mismatch: Expected ${excelValues.curp}, Found ${await this.otherIdInput.inputValue()}`);
        }

        if (await this.rfcInput.inputValue() !== excelValues.rfc) {
            errors.push(`RFC mismatch: Expected ${excelValues.rfc}, Found ${await this.rfcInput.inputValue()}`);
        }

        if (await this.sinInput.inputValue() !== excelValues.nss.toString()) {
            errors.push(`SIN mismatch: Expected ${excelValues.nss}, Found ${await this.sinInput.inputValue()}`);
        }

        if (await this.dobInput.inputValue() !== formattedDate) {
            errors.push(`Date of Birth mismatch: Expected ${formattedDate}, Found ${await this.dobInput.inputValue()}`);
        }

        const normalizeMarital = (value: string) =>
            maritalMap[value.trim().toLowerCase()] ?? value.trim();

        const maritalExpectedRaw =
            excelValues.estadoCicil ?? excelValues.edoCicil ?? '';

        const expected = normalizeMarital(maritalExpectedRaw);
        const actual = normalizeMarital(
            await this.maritalStatusInput.inputValue()
        );

        if (expected !== actual) {
            errors.push(
                `Marital Status mismatch: Expected ${expected}, Found ${actual}`
            );
        }


        const excelGenderValue = excelValueforGender[excelValues.sexo] ?? excelValues.sexo;
        const uiGender = await this.genderInput.inputValue();

        if (excelGenderValue !== uiGender) {
            errors.push(
                `Gender mismatch: Expected ${excelGenderValue}, Found ${uiGender}`
            );
        }


        const placeExpected = excelValues.Ciudad ?? excelValues.placeOfBirth ?? '';
        if (await this.placeOfBirthInput.inputValue() !== placeExpected) {
            errors.push(`Place of Birth mismatch: Expected ${placeExpected}, Found ${await this.placeOfBirthInput.inputValue()}`);
        }


        if (errors.length > 0) {
            const errorMessage = errors.join('\n');
            throw new Error(`Personal Details Validation Failed:\n${errorMessage}`);

        }
    }

}