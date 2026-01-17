import { EmployeeData } from '../types/EmployeeData';
import { Worksheet } from 'exceljs';

export class ReadExcel {

    async readExcel(worksheet: Worksheet, startRow = 2): Promise<EmployeeData[]> {

        const keys = [
            'No', 'Nombre', 'ApellidoPaterno', 'ApellidoMaterno', 'EMPRESA', 'CALLE',
            'noExterior', 'colonia', 'delegasionOMunicipio', 'Ciudad', 'postal', 'celular',
            'ingreso', 'centroDeCosto', 'puesto', 'salario', 'curp', 'rfc', 'regimeanFiscal',
            'nss', 'cuentaHsbc', 'clabe', 'mail', 'edoCicil', 'patronol',
            'supervisorID', 'categoria', 'sexo', 'nacimento', 'localiDAD'
        ];

        const ignoreIndexes = [
            7, 14, 16, 17, 19, 21, 22, 23, 32, 35, 36, 38, 39, 40,
            41, 42, 43, 44, 46, 47, 48, 49, 50, 51, 52, 53, 55, 56
        ];

        const results: any[] = [];

        // 🔁 Loop through all rows
        for (let rowNumber = 2; rowNumber <= worksheet.actualRowCount; rowNumber++) {
            const row:any = worksheet.getRow(rowNumber);

            if (!row || !row.values || row.values.length === 0) {
                continue; // skip empty rows
            }

            const values = row.values.slice(1); // 1-based index fix

            const filteredValues = values.filter(
                (_value: any, index: number) => !ignoreIndexes.includes(index)
            );

            const normalizedValues = filteredValues.map((value: any, index: number) => {

                // 1️⃣ Formula result
                if (value && typeof value === 'object' && 'result' in value) {
                    value = value.result;
                }

                // 2️⃣ Null safety
                if (value === undefined || value === null) {
                    return '';
                }

                // 3️⃣ Trim strings
                if (typeof value === 'string') {
                    value = value.trim();
                }

                // 4️⃣ Date cleanup
                if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
                    value = value.split('T')[0];
                }

                // 5️⃣ Numeric handling
                if (!isNaN(Number(value))) {
                    if (keys[index] === 'salario') {
                        value = Number(
                            typeof value === 'string'
                                ? value.replace(/,/g, '')
                                : value
                        ).toFixed(2);
                    } else {
                        value = Number(value);
                    }
                }

                return value;
            });

            const valueObj = Object.fromEntries(
                keys.map((key, i) => [key, normalizedValues[i]])
            );

            results.push(valueObj);
        }

        return results;
    }
}
