
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var rowData = [];

  // Ensure headers are present, if not, add them
  if (headers.indexOf('Timestamp') === -1) {
    headers.push('Timestamp');
  }
  if (headers.indexOf('Nome') === -1) {
    headers.push('Nome');
  }
  if (headers.indexOf('Sobrenome') === -1) {
    headers.push('Sobrenome');
  }
  if (headers.indexOf('Email') === -1) {
    headers.push('Email');
  }

  // If the sheet is empty, add headers
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }

  // Populate rowData based on headers and incoming data
  for (var i = 0; i < headers.length; i++) {
    var header = headers[i];
    if (header === 'Timestamp') {
      rowData.push(new Date());
    } else if (header === 'Nome') {
      rowData.push(data.nome);
    } else if (header === 'Sobrenome') {
      rowData.push(data.sobrenome);
    } else if (header === 'Email') {
      rowData.push(data.email);
    } else {
      rowData.push(''); // Add empty string for any other header not in the form data
    }
  }

  sheet.appendRow(rowData);

  return ContentService.createTextOutput(JSON.stringify({"result": "success", "message": "Data received"}))
    .setMimeType(ContentService.MimeType.JSON);
}
