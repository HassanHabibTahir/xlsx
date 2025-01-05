const fs = require('fs');
const xlsx = require('xlsx');

// Function to convert XLSX to JSON
function xlsxToJson(filePath) {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Get the first sheet
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 }); // Read data as an array of arrays

    const jsonResult = {};

    // Skip the first row and get country names from the second row
    const countries = data[1].slice(9); // Assuming country names start from column J (index 9)

    // Iterate through each row starting from the third row (index 2)
    for (let i = 2; i < data.length; i++) {
        const row = data[i];

        // Create category combination by filtering out empty values
        const categories = row.slice(0, 9).filter(cat => cat).map(cat => cat.trim()); // Get categories from columns A to I
        const categoryCombination = categories.join('+'); // Join non-empty categories with '+'

        // Iterate through each country
        for (let j = 0; j < countries.length; j++) {
            const country = countries[j] ? countries[j].trim() : ''; // Check if country is defined
            const identifier = row[9 + j] ? row[9 + j].trim() : ''; // Get the identifier for the country

            if (!jsonResult[country]) {
                jsonResult[country] = { categories: {} };
            }

            if (identifier) {
                jsonResult[country].categories[categoryCombination] = {
                    identifier: identifier,
                    currency: "EUR" // Assuming currency is EUR for all entries
                };
            }
        }
    }

    return jsonResult;
}

// Path to the XLSX file
const xlsxFilePath = './data.xlsx';

// Convert XLSX to JSON
const jsonOutput = xlsxToJson(xlsxFilePath);

// Output the JSON
console.log(JSON.stringify(jsonOutput, null, 2));

// Optionally, write to a file
fs.writeFileSync('output.json', JSON.stringify(jsonOutput, null, 2));