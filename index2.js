const fs = require('fs');
const XLSX = require('xlsx');


const workbook = XLSX.readFile('dummysales.xlsx');

const firstSheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[firstSheetName];

const jsonData = XLSX.utils.sheet_to_json(worksheet);

const modifiedData = jsonData.map(row => ({
    ...row,
    productIdentifier: row["asin"],   
    sku: row["seller_sku"],      
    orderDate: row["purchase_date"],
    shippingDate: row["earliest_ship_date"],
    shippingCountry: row["shipping_address_country_code"],
  }));
  fs.writeFileSync('output.json', JSON.stringify(modifiedData, null, 2));

console.log('Excel فائل کو JSON میں کامیابی سے تبدیل کر دیا گیا!');