function doPost(e) {
  try {
    // Check if the email parameter is present and not empty
    const email = e.parameter.email?.trim()
    const name = e.parameter.name?.trim()

    if (!email || email.length === 0) {
      return ContentService
        .createTextOutput(JSON.stringify({
          status: "error",
          message: "Email is required", // Customize the error message
          code: 400 // Use a 400 Bad Request code
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    // Access the "subscribers" sheet
    const subscribers = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("subscribers");

     // Get all existing emails from column 1 (email column)
    const existingEmails = subscribers.getRange("A2:A" + subscribers.getLastRow()).getValues().flat();
    
    // Check if the email already exists
    if (existingEmails.includes(email)) {
      return ContentService
        .createTextOutput(JSON.stringify({
          status: "error",
          message: "Email already subscribed",
          code: 409 // Conflict
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Insert a new row before row 2
    subscribers.insertRowBefore(2);

    // Set values in the new row
    subscribers.getRange(2, 1).setValue(email);
    subscribers.getRange(2, 2).setValue(name || ""); // Ensure name is set, or leave empty

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok", code:200 }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Handle any errors that occur
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: error.message,
        code: 500
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e){
  try {
    // Check if the email parameter is present and not empty
    const email = e.parameter.email?.trim()
    
    if (!email || email.length === 0) {
      return ContentService
        .createTextOutput(JSON.stringify({
          status: "error",
          message: "Email is required", // Customize the error message
          code: 400 // Use a 400 Bad Request code
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    // Access the "subscribers" sheet
    const subscribers = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("subscribers");

     // Get all existing emails from column 1 (email column)
    const existingEmails = subscribers.getRange("A2:A" + subscribers.getLastRow()).getValues().flat();

    // Check if the email already exists
    const emailIndex = existingEmails.indexOf(email);
    if (emailIndex !== -1) {
      // Email found, delete the corresponding row
      const rowToDelete = emailIndex + 2; // Adding 2 to account for header and zero-based index
      subscribers.deleteRow(rowToDelete);
      // Return success response
      return ContentService
      .createTextOutput(JSON.stringify({ status: "ok", code:200 }))
      .setMimeType(ContentService.MimeType.JSON);

    }

    // Return success response
    return ContentService
        .createTextOutput(JSON.stringify({
          status: "error",
          message: "Email not found", // Customize the error message
          code: 400 // Use a 400 Bad Request code
        }))
        .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Handle any errors that occur
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: error.message,
        code: 500
      }))
      .setMimeType(ContentService.MimeType.JSON);
    }
  }

