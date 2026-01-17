import { test, expect } from '@playwright/test';
import path from 'path'
import { WorkdayPage } from '../pages/WorkdayPage';
import { PersonalDetailsPage } from '../pages/PersonalDetailsPage';
import { JobDetailsPage } from '../pages/JobDetailsPage';
import { SalaryDetailsPage } from '../pages/SalaryDetailsPage';
import { ReportToPage } from '../pages/ReportToPage';
import { ContactDetailsPage } from '../pages/ContactDetailsPage';
import { BankDetailsPage } from '../pages/BankDetailsPage';
import ExcelJS from 'exceljs';
import { ReadExcel } from '../pages/ReadExcel';
import { EmployeeData } from '../types/EmployeeData';

let excelValues: EmployeeData[] = [];

test.beforeAll("get the file values", async () => {
    const filePath = path.resolve(__dirname, '../test-files/ReporteIngresosNewHire.xlsx');
    const sheet = 'Input';
    const readexcel = new ReadExcel();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath)
    const worksheet = workbook.getWorksheet(sheet)
    if (!worksheet) {
        throw new Error(`Worksheet '${sheet}' not found in the workbook`);
    }
    const rowCount = worksheet.actualRowCount;
    excelValues = await readexcel.readExcel(worksheet, rowCount);
    console.log('Excel Values:', excelValues);
})

test("Workday file read and validate in the system", async ({ page }) => {

    for (const val of excelValues) {
        console.log('\n' + '='.repeat(70));
        console.log("Validate the data of Employee ID:" + val.No)
        const workdayTab = new WorkdayPage(page);
        const personalTab = new PersonalDetailsPage(page);
        const jobTab = new JobDetailsPage(page);
        const salaryTab = new SalaryDetailsPage(page);
        const reportToTab = new ReportToPage(page);
        const contactDetailsTab = new ContactDetailsPage(page);
        const bankDetailsTab = new BankDetailsPage(page)
        await page.goto('/');
        await workdayTab.loginAsAdmin()
        await workdayTab.navigateToEmployeeList();
        expect(await workdayTab.findTheEmployeeAndNavigate(val.Nombre, val.ApellidoPaterno, val.ApellidoMaterno, val.No)).toBeTruthy();
        await workdayTab.navigateToProfile(val.Nombre);
        expect(await personalTab.personalDetailsSectionValidation(val)).toBeTruthy();
        expect(await jobTab.jobDetailsSectionValidation(val)).toBeTruthy();
        expect(await salaryTab.salaryDetailsSectionValidation(val)).toBeTruthy()
        expect(await reportToTab.reportToDetailsSectionValidation(val)).toBeTruthy()
        expect(await contactDetailsTab.contactDetailsSectionValidation(val)).toBeTruthy()
        expect(await bankDetailsTab.bankDetailsSectionValidation(val)).toBeTruthy()
        await workdayTab.logout();
        console.log('\n' + '='.repeat(70));
    }

});