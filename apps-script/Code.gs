// ============================================
// LEAD INTAKE AUTOMATION - Google Apps Script
// Runs automatically when a new form is submitted
// ============================================

// This function fires every time someone submits the form
// Google calls it automatically via a trigger we set up below
function onFormSubmit(e) {
  
  // Get the active spreadsheet and the Form Responses sheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet()
                            .getSheetByName("Form Responses 1");
  
  // Get the last row that has data - this is the new submission
  var lastRow = sheet.getLastRow();
  
  // ---- READ THE RAW DATA FROM THE NEW ROW ----
  // Column B = Full Name (column 2)
  var fullName = sheet.getRange(lastRow, 2).getValue();
  
  // Column C = Email (column 3)
  var email = sheet.getRange(lastRow, 3).getValue();
  
  // Column D = Company (column 4)
  var company = sheet.getRange(lastRow, 4).getValue();
  
  // ---- CLEAN THE DATA ----
  
  // Trim removes extra spaces before and after text
  // "  maria santos  " becomes "maria santos"
  fullName = fullName.toString().trim();
  email = email.toString().trim();
  company = company.toString().trim();
  
  // Convert email to lowercase
  // "MARIA@COMPANY.COM" becomes "maria@company.com"
  email = email.toLowerCase();
  
  // Capitalize the first letter of each word in the name
  // "maria santos" becomes "Maria Santos"
  fullName = fullName.replace(/\b\w/g, function(char) {
    return char.toUpperCase();
  });
  
  // Capitalize the first letter of the company name
  // "acme corp" becomes "Acme Corp"
  company = company.replace(/\b\w/g, function(char) {
    return char.toUpperCase();
  });
  
  // ---- WRITE CLEANED DATA BACK TO THE SHEET ----
  sheet.getRange(lastRow, 2).setValue(fullName);  // Column B
  sheet.getRange(lastRow, 3).setValue(email);      // Column C
  sheet.getRange(lastRow, 4).setValue(company);    // Column D
  
  // ---- SET STATUS TO READY ----
  // This is the signal that tells n8n this row is ready to process
  // Column F = Status (column 6)
  sheet.getRange(lastRow, 6).setValue("READY");
  
  // ---- LOG WHAT HAPPENED ----
  // This writes to the Apps Script logs so you can debug later
  Logger.log("Processed new lead: " + fullName + " | " + email + " | Status: READY");
}


// ============================================
// TRIGGER SETUP FUNCTION
// Run this ONCE manually to connect the script to form submissions
// You never need to run this again after the first time
// ============================================
function createTrigger() {
  
  // Remove any existing triggers first to avoid duplicates
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  
  // Create a new trigger that fires onFormSubmit
  // every time the form receives a new submission
  ScriptApp.newTrigger("onFormSubmit")
           .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
           .onFormSubmit()
           .create();
  
  Logger.log("Trigger created successfully.");
}