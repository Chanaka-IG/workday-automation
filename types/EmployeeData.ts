/**
 * Employee data structure from Excel file
 * Represents all employee information imported from the test Excel file
 */
export interface EmployeeData {
  No: number;
  Nombre: string;
  ApellidoPaterno: string;
  ApellidoMaterno: string;
  EMPRESA: string;
  CALLE: string;
  noExterior: string;
  colonia: string;
  delegasionOMunicipio: string;
  Ciudad: string;
  postal: number | string;
  celular: number | string;
  ingreso: string | Date;
  centroDeCosto: string;
  puesto: string;
  salario: string | number;
  curp: string;
  rfc: string;
  regimeanFiscal: string;
  nss: number | string;
  cuentaHsbc: string | number;
  clabe: string | number;
  mail: string;
  edoCicil?: string;
  estadoCicil?: string;
  patronol: string;
  supervisorID: number | string;
  categoria: string;
  sexo: string;
  nacimento: string | Date;
  localiDAD: string;
}
