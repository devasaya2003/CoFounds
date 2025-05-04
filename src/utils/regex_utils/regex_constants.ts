/**
 * Regular expression constants for validation
 */

// Email validation - standard email format
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Indian phone number - 10 digits with optional country code
// Accepts: +91XXXXXXXXXX, 91XXXXXXXXXX, 0XXXXXXXXXX, XXXXXXXXXX
export const INDIAN_PHONE_REGEX = /^(?:\+91|91|0)?[6789]\d{9}$/;

// Indian telephone number with STD code
// Accepts formats like 011-XXXXXXXX or 0XX-XXXXXXX
export const INDIAN_TELEPHONE_REGEX = /^0\d{2,4}[-]\d{6,8}$/;

// Indian pincode - exactly 6 digits
export const INDIAN_PINCODE_REGEX = /^[1-9][0-9]{5}$/;

// Address - allows alphanumeric characters, spaces, and common punctuation
export const ADDRESS_REGEX = /^[a-zA-Z0-9\s,.'/()\-→&:#@+]{3,200}$/;

// State name - alphabets and spaces only
export const STATE_REGEX = /^[a-zA-Z\s]{2,50}$/;

// City name - alphabets and spaces only
export const CITY_REGEX = /^[a-zA-Z\s]{2,50}$/;

// District name - alphabets and spaces only
export const DISTRICT_REGEX = /^[a-zA-Z\s]{2,50}$/;

// Pincode - same as Indian pincode
export const PINCODE_REGEX = INDIAN_PINCODE_REGEX;

// Name - allows alphabets, spaces, and some special characters
export const NAME_REGEX = /^[a-zA-Z\s.']{2,50}$/;

// Username - lowercase alphanumeric (3-8 chars), with hyphens/underscores only in middle
export const USERNAME_REGEX = /^[a-z0-9][a-z0-9_-]{1,6}[a-z0-9]$/;

// GST Number - updated as per new format
export const GST_REGEX = /^[0-9]{2}[A-Z]{10}[0-9]{1}[A-Z]{1}[0-9]{1}[A-Z]{1}$/;

// HSN Code - 4 to 8 digits
export const HSN_CODE_REGEX = /^[0-9]{4,8}$/;

// Bank Account Number - 9 to 18 digits
export const BANK_ACCOUNT_REGEX = /^\d{9,18}$/;

// IFSC Code - Indian Financial System Code
export const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

// Aadhaar Number - 12 digits
export const AADHAAR_REGEX = /^\d{12}$/;
// Alternative format with spaces
export const AADHAAR_FORMATTED_REGEX = /^\d{4}\s\d{4}\s\d{4}$/;

// PF Number - updated format
export const PF_REGEX = /^[A-Z]{3}\/?\d{7,10}\/?\d{0,3}$/;

// ESI Number - updated format
export const ESI_REGEX = /^\d{2}-?\d{2}-?\d{6}-?\d{3}-?\d{4}$/;

// ESI Number without hyphens (17 digits total)
export const ESI_WITHOUT_HYPHENS_REGEX = /^\d{17}$/;

// ESI Basic (salary)
export const ESI_BASIC_REGEX = /^\d{1,6}(\.\d{2})?$/;

// Product related regexes
export const PRODUCT_CODE_REGEX = /^[A-Za-z0-9]{5,}$/;
export const SECTION_GROUP_NAME_REGEX = /^[A-Za-z0-9]{5,}$/;
export const SECTION_GROUP_CODE_REGEX = /^[A-Za-z0-9]{5,}$/;
export const SECTION_NAME_REGEX = /^[A-Za-z0-9]{5,}$/;
export const SECTION_CODE_REGEX = /^[A-Za-z0-9]{5,}$/;
export const PRODUCT_GROUP_NAME_REGEX = /^[A-Za-z0-9]{5,}$/;
export const PRODUCT_SIZE_NAME_REGEX = /^[A-Za-z0-9]{5,}$/;
export const PRODUCT_SIZE_VALUE_REGEX = /^[A-Za-z0-9]{5,}$/;
export const UNIT_NAME_REGEX = /^[A-Za-z0-9]{5,}$/;
export const UNIT_VALUE_REGEX = /^[A-Za-z0-9]{5,}$/;

// ID and Code regexes
export const BARCODE_ID_REGEX = /^[A-Za-z0-9]{5,}$/;
export const EMPLOYEE_CODE_REGEX = /^[A-Za-z0-9]{5,}$/;
export const TRANSPORT_CODE_REGEX = /^[A-Za-z0-9]{5,}$/;
export const STATUS_TYPE_REGEX = /^[A-Za-z0-9]{5,}$/;
export const STATUS_VALUE_REGEX = /^[A-Za-z0-9]{5,}$/;
export const STOCK_LOCATION_NAME_REGEX = /^[A-Za-z0-9]{5,}$/;
export const STOCK_LOCATION_CODE_REGEX = /^[A-Za-z0-9]{5,}$/;
export const COUNTER_TYPE_NAME_REGEX = /^[A-Za-z0-9]{5,}$/;
export const REFERENCE_NUMBER_REGEX = /^[A-Za-z0-9]{5,}$/;
export const EMPLOYEE_ID_REGEX = /^[A-Za-z0-9]{5,}$/;

/**
 * Error messages for validation failures
 */
export const VALIDATION_MESSAGES = {
  EMAIL: "Please enter a valid email address",
  PHONE: "Please enter a valid 10-digit Indian phone number",
  TELEPHONE: "Please enter a valid Indian telephone number with STD code",
  PINCODE: "Please enter a valid 6-digit Indian pincode",
  ADDRESS: "Please enter a valid address",
  STATE: "Please enter a valid state name",
  CITY: "Please enter a valid city name",
  DISTRICT: "Please enter a valid district name",
  NAME: "Please enter a valid name",
  USERNAME: "Username must be 3-8 characters, lowercase letters and numbers only, with hyphens or underscores only in the middle",
  GST: "Please enter a valid GST number",
  HSN: "Please enter a valid HSN code (4-8 digits)",
  BANK_ACCOUNT: "Please enter a valid bank account number (9-18 digits)",
  IFSC: "Please enter a valid IFSC code (e.g., SBIN0000123)",
  AADHAAR: "Please enter a valid 12-digit Aadhaar number",
  PF: "Please enter a valid PF number",
  ESI: "Please enter a valid ESI number",
  ESI_BASIC: "Please enter a valid ESI basic salary (up to 6 digits with optional 2 decimal places)",
  PRODUCT_CODE: "Product code must be at least 5 alphanumeric characters",
  SECTION_GROUP_NAME: "Section group name must be at least 5 alphanumeric characters",
  SECTION_GROUP_CODE: "Section group code must be at least 5 alphanumeric characters",
  SECTION_NAME: "Section name must be at least 5 alphanumeric characters",
  SECTION_CODE: "Section code must be at least 5 alphanumeric characters",
  PRODUCT_GROUP_NAME: "Product group name must be at least 5 alphanumeric characters",
  PRODUCT_SIZE_NAME: "Product size name must be at least 5 alphanumeric characters",
  PRODUCT_SIZE_VALUE: "Product size value must be at least 5 alphanumeric characters",
  UNIT_NAME: "Unit name must be at least 5 alphanumeric characters",
  UNIT_VALUE: "Unit value must be at least 5 alphanumeric characters",
  BARCODE_ID: "Barcode ID must be at least 5 alphanumeric characters",
  EMPLOYEE_CODE: "Employee code must be at least 5 alphanumeric characters",
  TRANSPORT_CODE: "Transport code must be at least 5 alphanumeric characters",
  STATUS_TYPE: "Status type must be at least 5 alphanumeric characters",
  STATUS_VALUE: "Status value must be at least 5 alphanumeric characters",
  STOCK_LOCATION_NAME: "Stock location name must be at least 5 alphanumeric characters",
  STOCK_LOCATION_CODE: "Stock location code must be at least 5 alphanumeric characters",
  COUNTER_TYPE_NAME: "Counter type name must be at least 5 alphanumeric characters",
  REFERENCE_NUMBER: "Reference number must be at least 5 alphanumeric characters",
  EMPLOYEE_ID: "Employee ID must be at least 5 alphanumeric characters"
};