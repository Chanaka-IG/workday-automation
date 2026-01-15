
export class ReadExcel {

    constructor() {

    }

    async readExcel(worksheet: any, targetRowNumber = 2): Promise<any> {

        const keys = [
            'No', 'Nombre', 'ApellidoPaterno', 'ApellidoMaterno', 'EMPRESA', 'CALLE',
            'noExterior', 'colonia', 'delegasionOMunicipio', 'Ciudad', 'postal', 'celular',
            'ingreso', 'centroDeCosto', 'puesto', 'salario', 'curp', 'rfc', 'regimeanFiscal',
            'nss', 'cuentaHsbc', 'clabe', 'mail', 'edoCicil', 'patronol',
            'supervisorID', 'categoria', 'sexo', 'nacimento', 'localiDAD'
        ];
        const row = worksheet.getRow(targetRowNumber);
        const filteredValues: any[] = [];
        const ignoreIndexes = [7, 14, 16, 17, 19, 21, 22, 23, 32, 35,36,38,39,40,41,42,43,44,46,47,48,49,50,51,52,53,55,56];

        if (!row || !row.values || row.values.length === 0) {
            console.warn(`Row ${targetRowNumber} is empty or not found.`);
            return;
        }

        const values = row.values.slice(1); // Adjust for 1-based index


        filteredValues.push(...values.filter(
            (_value: any, index: number) => !ignoreIndexes.includes(index)
        ));

        const normalizedValues = filteredValues.map((value, index) => {
            // 1️⃣ Take only formula result
            if (value && typeof value === 'object' && 'result' in value) {
                value = value.result;
            }

            // 2️⃣ Validate and transform
            if (value === undefined || value === null) {
                // Replace missing values with empty string or default
                return '';
            }

            if (typeof value === 'string') {
                value = value.trim(); // Remove extra spaces
            }

            // 3️⃣ Optional: Convert ISO date string to YYYY-MM-DD
            if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T/)) {
                value = value.split('T')[0];
            }

            // 4️⃣ Optional: Convert numeric strings to numbers
            if (!isNaN(Number(value))) {
                value = Number(value);
            }

            return value;
        });
        const valueObj = Object.fromEntries(
            keys.map((key, i) => [key, normalizedValues[i]])
        );

        return valueObj;
    }
}