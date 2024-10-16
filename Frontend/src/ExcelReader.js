import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';

const ExcelReader = () => {
  const [excelData, setExcelData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(jsonData);
    };

    reader.readAsBinaryString(file);
  };

  const handleSubmit = () => {
    if (excelData.length === 0) {
      alert("No data found in the Excel sheet.");
      return;
    }

    axios.post('http://localhost:5000/api/generate-videos-from-excel', { excelData })
      .then((response) => {
        alert(response.data.message);
      })
      .catch((error) => {
        console.error('Error uploading Excel data:', error);
        alert('Error uploading Excel data');
      });
  };

  return (
    <div>
      <h2>Upload Excel File</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      <button onClick={handleSubmit}>Submit Excel Data</button>
    </div>
  );
};

export default ExcelReader;
