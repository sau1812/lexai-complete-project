/**
 * Run this once to create sample Excel file:
 * node data/createSampleExcel.js
 */

const XLSX = require('xlsx');
const path = require('path');

const sampleData = [
  {
    aadhaar_number: '1234 5678 9012',
    name: 'Rahul Sharma',
    dob: '15/08/1990',
    gender: 'Male',
    mobile: '9876543210',
    address: '123, MG Road, Pune, Maharashtra - 411001',
    pincode: '411001',
    state: 'Maharashtra',
  },
  {
    aadhaar_number: '2345 6789 0123',
    name: 'Priya Patel',
    dob: '22/03/1995',
    gender: 'Female',
    mobile: '9123456780',
    address: '45, Nehru Nagar, Ahmedabad, Gujarat - 380001',
    pincode: '380001',
    state: 'Gujarat',
  },
  {
    aadhaar_number: '3456 7890 1234',
    name: 'Amit Kumar',
    dob: '10/11/1988',
    gender: 'Male',
    mobile: '9988776655',
    address: '78, Lajpat Nagar, New Delhi - 110024',
    pincode: '110024',
    state: 'Delhi',
  },
  {
    aadhaar_number: '4567 8901 2345',
    name: 'Sunita Devi',
    dob: '05/07/1992',
    gender: 'Female',
    mobile: '8877665544',
    address: '12, Anna Nagar, Chennai, Tamil Nadu - 600040',
    pincode: '600040',
    state: 'Tamil Nadu',
  },
  {
    aadhaar_number: '5678 9012 3456',
    name: 'Vijay Reddy',
    dob: '30/01/1985',
    gender: 'Male',
    mobile: '7766554433',
    address: '56, Banjara Hills, Hyderabad, Telangana - 500034',
    pincode: '500034',
    state: 'Telangana',
  },
];

// Create workbook
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(sampleData);

// Set column widths
ws['!cols'] = [
  { wch: 18 }, // aadhaar_number
  { wch: 20 }, // name
  { wch: 12 }, // dob
  { wch: 8 },  // gender
  { wch: 12 }, // mobile
  { wch: 45 }, // address
  { wch: 10 }, // pincode
  { wch: 15 }, // state
];

XLSX.utils.book_append_sheet(wb, ws, 'Aadhaar Records');

const filePath = path.join(__dirname, 'aadhaar_database.xlsx');
XLSX.writeFile(wb, filePath);

console.log(`✅ Excel file created: ${filePath}`);
console.log(`📊 ${sampleData.length} records added`);
console.log('\nSample Aadhaar numbers for testing:');
sampleData.forEach(d => console.log(`  ${d.aadhaar_number} — ${d.name}`));