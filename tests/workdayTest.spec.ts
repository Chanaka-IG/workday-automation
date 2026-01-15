import { test, expect } from '@playwright/test';
import path from 'path'
import { WorkdayPage } from '../pages/WorkdayPage';
import { PersonalDetailsPage } from '../pages/PersonalDetailsPage';
import { JobDetailsPage } from '../pages/JobDetailsPage';
import { SalaryDetaillsPage } from '../pages/SalaryDetailsPage';
import { ReportToPage } from '../pages/ReportToPage';
import { ContactDetailsPage } from '../pages/ContactDetailsPage';
import { BankDetailsPage } from '../pages/BankDetailsPage';
import ExcelJS from 'exceljs';
import { ReadExcel } from '../pages/ReadExcel';

let excelValues: any = [];

test.beforeAll("get the file values", async () => {
    const filePath = path.resolve(__dirname, '../test-files/ReporteIngresosNewHire.xlsx');
    const sheet = 'Input';
    const readexcel = new ReadExcel();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath)
    const worksheet = workbook.getWorksheet(sheet)
    const rowCount = worksheet?.actualRowCount;
    excelValues = await readexcel.readExcel(worksheet, rowCount);
    console.log('Excel Values:', excelValues);
})

test("Workday file read and validate in the system", async ({ page }) => {

    for (const val of excelValues) {
        console.log('\n' + '='.repeat(70));
        console.log("Validate the data of Employee ID:" + val.No)
        const workdayPage = new WorkdayPage(page);
        const personalTab = new PersonalDetailsPage(page);
        const jobTab = new JobDetailsPage(page);
        const salaryTab = new SalaryDetaillsPage(page);
        const reportToTab = new ReportToPage(page);
        const contactDetailsTab = new ContactDetailsPage(page);
        const bankDetailsTab = new BankDetailsPage(page)
        await page.goto('/');
        await workdayPage.loginAsAdmin()
        await workdayPage.navigateToEmployeeList();
        expect(await workdayPage.findTheEmployeeAndNavigate(val.Nombre, val.ApellidoPaterno, val.ApellidoMaterno, val.No)).toBeTruthy();
        await workdayPage.navigateToProfile(val.Nombre);
        expect(await personalTab.personalDetailsSectionValidation(val)).toBeTruthy();
        expect(await jobTab.jobDetailsSectionValidation(val)).toBeTruthy();
        expect(await salaryTab.salaryDetailsSectionValidation(val)).toBeTruthy()
        expect(await reportToTab.reportToDetailsSectionValidation(val)).toBeTruthy()
        expect(await contactDetailsTab.contactDetailsSectionValidation(val)).toBeTruthy()
        expect(await bankDetailsTab.bankDetailsSectionValidation(val)).toBeTruthy()
        await workdayPage.logout();
        console.log('\n' + '='.repeat(70));
    }

});