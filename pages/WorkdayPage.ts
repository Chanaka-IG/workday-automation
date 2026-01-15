import { Page, Locator, expect } from '@playwright/test';
import { ENV } from '../config/env';
import { time } from 'node:console';


export class WorkdayPage {
    private readonly page: Page;
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly employeeMenu: Locator;
    private readonly employeeSearchInput: Locator;
    private readonly searchDropdown: Locator;
    private readonly employeeListCard: Locator;
    private readonly logoutBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.getByPlaceholder('Username');
        this.passwordInput = page.getByPlaceholder('Password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.employeeMenu = page.getByRole('link', { name: 'Employee List ' })
        this.employeeSearchInput = page.locator('#employee_name_quick_filter_employee_list_value');
        this.searchDropdown = page.locator('#employee_name_quick_filter_employee_list_dropdown');
        this.employeeListCard = page.locator('#employeeListTable');
        this.logoutBtn = page.getByRole('link', {name : 'Log Out'});
    }

    async loginAsAdmin() {
        await this.usernameInput.fill(ENV.adminUsername);
        await this.passwordInput.fill(ENV.adminPassword);
        await this.loginButton.click();
    }

        async logout() {
        await this.logoutBtn.click();
    }

    async navigateToEmployeeList() {
        this.employeeMenu.click();
        await this.employeeListCard.waitFor({ state: 'visible'});

    }

    async findTheEmployeeAndNavigate(firstName: string, lastName: string, middleName: string, empNo: number): Promise<any> {
        let flag = false;

        try {
            await this.employeeSearchInput.pressSequentially(firstName + ' ' + lastName + ' ' + middleName);
            await this.searchDropdown.first().click();
            await expect(
                this.page
                    .locator('//tbody//tr//td//a[@class="table-cell-link"]')
                    .nth(1)
            ).toHaveText(empNo.toString());

            const employeeID = await this.page.locator('//tbody//tr//td//a[@class="table-cell-link"]').nth(1).textContent();

            if (employeeID?.includes(empNo.toString())) {
                console.log(`Successfully navigated to the profile of ${firstName} ${lastName}.`);
                flag = true;
            } else {
                console.error(`Failed to navigate to the profile of ${firstName} ${lastName}.`);
                console.log(`Expected Employee ID: ${empNo}, but found: ${employeeID}`);
                flag = false;
            }

            return flag;
        }
        catch (error) {
            console.error('Error in findTheEmployeeAndNavigate:', error);
        }

    }

    async navigateToProfile(employeeID: string) {
        await this.page.getByRole('link', { name: employeeID }).first().click();
        await this.page.waitForTimeout(8000);
    }

}