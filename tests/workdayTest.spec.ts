import {test,expect} from '@playwright/test';
import { WorkdayPage } from '../pages/WorkdayPage';
import { PersonalDetailsPage } from '../pages/PersonalDetailsPage';
import { JobDetailsPage } from '../pages/JobDetailsPage';
import { SalaryDetaillsPage } from '../pages/SalaryDetailsPage';
import { ReportToPage } from '../pages/ReportToPage';
import ExcelJS from 'exceljs';
import { ReadExcel } from '../pages/ReadExcel';


test("Workday file read and validate in the system", async ({page})=>{

    const path = '/home/administrator/Documents/workdayfile/ReporteIngresosNewHire.xlsx';
    const sheet = 'Input';
    const workdayPage = new WorkdayPage(page);
    const personalTab = new PersonalDetailsPage(page);
    const jobTab = new JobDetailsPage(page);
    const salaryTab = new SalaryDetaillsPage(page);
    const reportToTab = new ReportToPage(page);
    const readexcel = new ReadExcel();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(path)
    const worksheet = workbook.getWorksheet(sheet)
    const excelValues = await readexcel.readExcel(worksheet);
    console.log('Excel Values:', excelValues);
    await page.goto('/');
    await workdayPage.loginAsAdmin()
    await workdayPage.navigateToEmployeeList();
    expect(await workdayPage.findTheEmployeeAndNavigate(excelValues.Nombre, excelValues.ApellidoPaterno, excelValues.ApellidoMaterno,excelValues.No)).toBeTruthy();
    await workdayPage.navigateToProfile(excelValues.Nombre);
    //await personalTab.personalDetailsSectionValidation(excelValues);
    //await jobTab.jobDetailsSectionValidation(excelValues);
    //await salaryTab.salaryDetailsSectionValidation(excelValues)
    await reportToTab.reportToDetailsSectionValidation(excelValues)
});