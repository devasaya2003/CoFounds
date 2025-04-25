import {
    EMAIL_REGEX,
    INDIAN_PHONE_REGEX,
    INDIAN_TELEPHONE_REGEX,
    INDIAN_PINCODE_REGEX,
    ADDRESS_REGEX,
    STATE_REGEX,
    CITY_REGEX,
    DISTRICT_REGEX,
    NAME_REGEX,
    USERNAME_REGEX,
    GST_REGEX,
    HSN_CODE_REGEX,
    BANK_ACCOUNT_REGEX,
    IFSC_REGEX,
    AADHAAR_REGEX,
    AADHAAR_FORMATTED_REGEX,
    PF_REGEX,
    ESI_REGEX,
    ESI_WITHOUT_HYPHENS_REGEX,
    ESI_BASIC_REGEX,
    PRODUCT_CODE_REGEX,
    SECTION_GROUP_NAME_REGEX,
    SECTION_GROUP_CODE_REGEX,
    SECTION_NAME_REGEX,
    SECTION_CODE_REGEX,
    PRODUCT_GROUP_NAME_REGEX,
    PRODUCT_SIZE_NAME_REGEX,
    PRODUCT_SIZE_VALUE_REGEX,
    UNIT_NAME_REGEX,
    UNIT_VALUE_REGEX,
    BARCODE_ID_REGEX,
    EMPLOYEE_CODE_REGEX,
    TRANSPORT_CODE_REGEX,
    STATUS_TYPE_REGEX,
    STATUS_VALUE_REGEX,
    STOCK_LOCATION_NAME_REGEX,
    STOCK_LOCATION_CODE_REGEX,
    COUNTER_TYPE_NAME_REGEX,
    REFERENCE_NUMBER_REGEX,
    EMPLOYEE_ID_REGEX,
    VALIDATION_MESSAGES
  } from './regex_constants';
  
  /**
   * Validates an email address
   * @example VALIDATE_EMAIL('test@example.com') // returns true
   * @example VALIDATE_EMAIL('invalid-email') // returns false
   */
  export const VALIDATE_EMAIL = (email: string): boolean => {
    return EMAIL_REGEX.test(email);
  };
  
  /**
   * Validates an Indian phone number (with or without country code)
   * @example VALIDATE_INDIAN_PHONE('9876543210') // returns true
   * @example VALIDATE_INDIAN_PHONE('123456789') // returns false (invalid first digit)
   */
  export const VALIDATE_INDIAN_PHONE = (phone: string): boolean => {
    return INDIAN_PHONE_REGEX.test(phone);
  };
  
  /**
   * Validates an Indian telephone number with STD code
   * @example VALIDATE_INDIAN_TELEPHONE('011-23456789') // returns true
   * @example VALIDATE_INDIAN_TELEPHONE('12345678') // returns false (missing STD code)
   */
  export const VALIDATE_INDIAN_TELEPHONE = (telephone: string): boolean => {
    return INDIAN_TELEPHONE_REGEX.test(telephone);
  };
  
  /**
   * Validates an Indian pincode (6 digits)
   * @example VALIDATE_PINCODE('110001') // returns true
   * @example VALIDATE_PINCODE('1100') // returns false (invalid length)
   */
  export const VALIDATE_PINCODE = (pincode: string): boolean => {
    return INDIAN_PINCODE_REGEX.test(pincode);
  };
  
  /**
   * Validates an address with alphanumeric characters, spaces, and common punctuation
   * @example VALIDATE_ADDRESS('123 Main St, Apt 4B') // returns true
   * @example VALIDATE_ADDRESS('$#@^&') // returns false (invalid characters)
   */
  export const VALIDATE_ADDRESS = (address: string): boolean => {
    return ADDRESS_REGEX.test(address);
  };
  
  /**
   * Validates a state name (alphabets and spaces only)
   * @example VALIDATE_STATE('Karnataka') // returns true
   * @example VALIDATE_STATE('123') // returns false (contains numbers)
   */
  export const VALIDATE_STATE = (state: string): boolean => {
    return STATE_REGEX.test(state);
  };
  
  /**
   * Validates a city name (alphabets and spaces only)
   * @example VALIDATE_CITY('New Delhi') // returns true
   * @example VALIDATE_CITY('Delhi123') // returns false (contains numbers)
   */
  export const VALIDATE_CITY = (city: string): boolean => {
    return CITY_REGEX.test(city);
  };
  
  /**
   * Validates a district name (alphabets and spaces only)
   * @example VALIDATE_DISTRICT('South Delhi') // returns true
   * @example VALIDATE_DISTRICT('South Delhi123') // returns false (contains numbers)
   */
  export const VALIDATE_DISTRICT = (district: string): boolean => {
    return DISTRICT_REGEX.test(district);
  };
  
  /**
   * Validates a name (alphabets, spaces, and some special characters)
   * @example VALIDATE_NAME('John O\'Connor') // returns true
   * @example VALIDATE_NAME('John123') // returns false (contains numbers)
   */
  export const VALIDATE_NAME = (name: string): boolean => {
    return NAME_REGEX.test(name);
  };
  
  /**
   * Validates a username (alphanumeric with underscore and dot, 3-30 characters)
   * @example VALIDATE_USERNAME('john_doe123') // returns true
   * @example VALIDATE_USERNAME('j$') // returns false (invalid characters and too short)
   */
  export const VALIDATE_USERNAME = (username: string): boolean => {
    return USERNAME_REGEX.test(username);
  };
  
  /**
   * Validates an Indian GST number
   * @example VALIDATE_GST('29ABCDE1234F1Z5') // returns true
   * @example VALIDATE_GST('INVALID123456') // returns false (invalid format)
   */
  export const VALIDATE_GST = (gst: string): boolean => {
    return GST_REGEX.test(gst);
  };
  
  /**
   * Validates an HSN code (4-8 digits)
   * @example VALIDATE_HSN_CODE('1234') // returns true
   * @example VALIDATE_HSN_CODE('123') // returns false (too short)
   */
  export const VALIDATE_HSN_CODE = (hsnCode: string): boolean => {
    return HSN_CODE_REGEX.test(hsnCode);
  };
  
  /**
   * Validates an Indian bank account number (9-18 digits)
   * @example VALIDATE_BANK_ACCOUNT('123456789') // returns true
   * @example VALIDATE_BANK_ACCOUNT('12345678') // returns false (too short)
   */
  export const VALIDATE_BANK_ACCOUNT = (accountNumber: string): boolean => {
    return BANK_ACCOUNT_REGEX.test(accountNumber);
  };
  
  /**
   * Validates an Indian IFSC code (format: AAAA0XXXXXX)
   * @example VALIDATE_IFSC('SBIN0123456') // returns true
   * @example VALIDATE_IFSC('SBIN123456') // returns false (missing 0 at 5th position)
   */
  export const VALIDATE_IFSC = (ifsc: string): boolean => {
    return IFSC_REGEX.test(ifsc);
  };
  
  /**
   * Validates an Aadhaar number (12 digits)
   * @example VALIDATE_AADHAAR('123456789012') // returns true
   * @example VALIDATE_AADHAAR('12345678901') // returns false (too short)
   */
  export const VALIDATE_AADHAAR = (aadhaar: string): boolean => {
    return AADHAAR_REGEX.test(aadhaar) || AADHAAR_FORMATTED_REGEX.test(aadhaar);
  };
  
  /**
   * Validates a PF (Provident Fund) number (format: XX/XXX/XXXXXXX/XXX)
   * @example VALIDATE_PF('AB/123/1234567/123') // returns true
   * @example VALIDATE_PF('AB-123-1234567-123') // returns false (wrong format)
   */
  export const VALIDATE_PF = (pf: string): boolean => {
    return PF_REGEX.test(pf);
  };
  
  /**
   * Validates an ESI (Employee State Insurance) number
   * @example VALIDATE_ESI('11-11-111-1111111-111') // returns true
   * @example VALIDATE_ESI('11111111111111111') // returns true (without hyphens)
   * @example VALIDATE_ESI('11-11-111') // returns false (incomplete)
   */
  export const VALIDATE_ESI = (esi: string): boolean => {
    return ESI_REGEX.test(esi) || ESI_WITHOUT_HYPHENS_REGEX.test(esi);
  };
  
  /**
   * Validates ESI basic salary (up to 6 digits with optional 2 decimal places)
   * @example VALIDATE_ESI_BASIC('12345.67') // returns true
   * @example VALIDATE_ESI_BASIC('1234567.89') // returns false (too many digits)
   */
  export const VALIDATE_ESI_BASIC = (value: string): boolean => {
    return ESI_BASIC_REGEX.test(value);
  };
  
  /**
   * Validates a product code (at least 5 alphanumeric characters)
   * @example VALIDATE_PRODUCT_CODE('ABC123') // returns true
   * @example VALIDATE_PRODUCT_CODE('AB12') // returns false (too short)
   */
  export const VALIDATE_PRODUCT_CODE = (code: string): boolean => {
    return PRODUCT_CODE_REGEX.test(code);
  };
  
  /**
   * Validates a section group name (at least 5 alphanumeric characters)
   * @example VALIDATE_SECTION_GROUP_NAME('Group123') // returns true
   * @example VALIDATE_SECTION_GROUP_NAME('Grp') // returns false (too short)
   */
  export const VALIDATE_SECTION_GROUP_NAME = (name: string): boolean => {
    return SECTION_GROUP_NAME_REGEX.test(name);
  };
  
  /**
   * Validates a section group code (at least 5 alphanumeric characters)
   * @example VALIDATE_SECTION_GROUP_CODE('GRP123') // returns true
   * @example VALIDATE_SECTION_GROUP_CODE('GR12') // returns false (too short)
   */
  export const VALIDATE_SECTION_GROUP_CODE = (code: string): boolean => {
    return SECTION_GROUP_CODE_REGEX.test(code);
  };
  
  /**
   * Validates a section name (at least 5 alphanumeric characters)
   * @example VALIDATE_SECTION_NAME('Section1') // returns true
   * @example VALIDATE_SECTION_NAME('Sec1') // returns false (too short)
   */
  export const VALIDATE_SECTION_NAME = (name: string): boolean => {
    return SECTION_NAME_REGEX.test(name);
  };
  
  /**
   * Validates a section code (at least 5 alphanumeric characters)
   * @example VALIDATE_SECTION_CODE('SEC123') // returns true
   * @example VALIDATE_SECTION_CODE('SEC1') // returns false (too short)
   */
  export const VALIDATE_SECTION_CODE = (code: string): boolean => {
    return SECTION_CODE_REGEX.test(code);
  };
  
  /**
   * Validates a product group name (at least 5 alphanumeric characters)
   * @example VALIDATE_PRODUCT_GROUP_NAME('Group123') // returns true
   * @example VALIDATE_PRODUCT_GROUP_NAME('Grp1') // returns false (too short)
   */
  export const VALIDATE_PRODUCT_GROUP_NAME = (name: string): boolean => {
    return PRODUCT_GROUP_NAME_REGEX.test(name);
  };
  
  /**
   * Validates a product size name (at least 5 alphanumeric characters)
   * @example VALIDATE_PRODUCT_SIZE_NAME('Large12') // returns true
   * @example VALIDATE_PRODUCT_SIZE_NAME('XL') // returns false (too short)
   */
  export const VALIDATE_PRODUCT_SIZE_NAME = (name: string): boolean => {
    return PRODUCT_SIZE_NAME_REGEX.test(name);
  };
  
  /**
   * Validates a product size value (at least 5 alphanumeric characters)
   * @example VALIDATE_PRODUCT_SIZE_VALUE('Value1') // returns true
   * @example VALIDATE_PRODUCT_SIZE_VALUE('Val') // returns false (too short)
   */
  export const VALIDATE_PRODUCT_SIZE_VALUE = (value: string): boolean => {
    return PRODUCT_SIZE_VALUE_REGEX.test(value);
  };
  
  /**
   * Validates a unit name (at least 5 alphanumeric characters)
   * @example VALIDATE_UNIT_NAME('Dozen12') // returns true
   * @example VALIDATE_UNIT_NAME('KG') // returns false (too short)
   */
  export const VALIDATE_UNIT_NAME = (name: string): boolean => {
    return UNIT_NAME_REGEX.test(name);
  };
  
  /**
   * Validates a unit value (at least 5 alphanumeric characters)
   * @example VALIDATE_UNIT_VALUE('Unit12') // returns true
   * @example VALIDATE_UNIT_VALUE('U12') // returns false (too short)
   */
  export const VALIDATE_UNIT_VALUE = (value: string): boolean => {
    return UNIT_VALUE_REGEX.test(value);
  };
  
  /**
   * Validates a barcode ID (at least 5 alphanumeric characters)
   * @example VALIDATE_BARCODE_ID('BAR123') // returns true
   * @example VALIDATE_BARCODE_ID('B123') // returns false (too short)
   */
  export const VALIDATE_BARCODE_ID = (id: string): boolean => {
    return BARCODE_ID_REGEX.test(id);
  };
  
  /**
   * Validates an employee code (at least 5 alphanumeric characters)
   * @example VALIDATE_EMPLOYEE_CODE('EMP123') // returns true
   * @example VALIDATE_EMPLOYEE_CODE('E123') // returns false (too short)
   */
  export const VALIDATE_EMPLOYEE_CODE = (code: string): boolean => {
    return EMPLOYEE_CODE_REGEX.test(code);
  };
  
  /**
   * Validates a transport code (at least 5 alphanumeric characters)
   * @example VALIDATE_TRANSPORT_CODE('TRN123') // returns true
   * @example VALIDATE_TRANSPORT_CODE('TR12') // returns false (too short)
   */
  export const VALIDATE_TRANSPORT_CODE = (code: string): boolean => {
    return TRANSPORT_CODE_REGEX.test(code);
  };
  
  /**
   * Validates a status type (at least 5 alphanumeric characters)
   * @example VALIDATE_STATUS_TYPE('Status1') // returns true
   * @example VALIDATE_STATUS_TYPE('Stat') // returns false (too short)
   */
  export const VALIDATE_STATUS_TYPE = (type: string): boolean => {
    return STATUS_TYPE_REGEX.test(type);
  };
  
  /**
   * Validates a status value (at least 5 alphanumeric characters)
   * @example VALIDATE_STATUS_VALUE('Active1') // returns true
   * @example VALIDATE_STATUS_VALUE('Act') // returns false (too short)
   */
  export const VALIDATE_STATUS_VALUE = (value: string): boolean => {
    return STATUS_VALUE_REGEX.test(value);
  };
  
  /**
   * Validates a stock location name (at least 5 alphanumeric characters)
   * @example VALIDATE_STOCK_LOCATION_NAME('Warehouse1') // returns true
   * @example VALIDATE_STOCK_LOCATION_NAME('WH1') // returns false (too short)
   */
  export const VALIDATE_STOCK_LOCATION_NAME = (name: string): boolean => {
    return STOCK_LOCATION_NAME_REGEX.test(name);
  };
  
  /**
   * Validates a stock location code (at least 5 alphanumeric characters)
   * @example VALIDATE_STOCK_LOCATION_CODE('LOC123') // returns true
   * @example VALIDATE_STOCK_LOCATION_CODE('L123') // returns false (too short)
   */
  export const VALIDATE_STOCK_LOCATION_CODE = (code: string): boolean => {
    return STOCK_LOCATION_CODE_REGEX.test(code);
  };
  
  /**
   * Validates a counter type name (at least 5 alphanumeric characters)
   * @example VALIDATE_COUNTER_TYPE_NAME('Counter1') // returns true
   * @example VALIDATE_COUNTER_TYPE_NAME('Cntr') // returns false (too short)
   */
  export const VALIDATE_COUNTER_TYPE_NAME = (name: string): boolean => {
    return COUNTER_TYPE_NAME_REGEX.test(name);
  };
  
  /**
   * Validates a reference number (at least 5 alphanumeric characters)
   * @example VALIDATE_REFERENCE_NUMBER('REF123') // returns true
   * @example VALIDATE_REFERENCE_NUMBER('R123') // returns false (too short)
   */
  export const VALIDATE_REFERENCE_NUMBER = (ref: string): boolean => {
    return REFERENCE_NUMBER_REGEX.test(ref);
  };
  
  /**
   * Validates an employee ID (at least 5 alphanumeric characters)
   * @example VALIDATE_EMPLOYEE_ID('EMP123') // returns true
   * @example VALIDATE_EMPLOYEE_ID('E123') // returns false (too short)
   */
  export const VALIDATE_EMPLOYEE_ID = (id: string): boolean => {
    return EMPLOYEE_ID_REGEX.test(id);
  };
  
  /**
   * Generic validation function that accepts a value and a regex pattern
   * @example VALIDATE('test@example.com', EMAIL_REGEX) // returns true
   * @example VALIDATE('test', EMAIL_REGEX) // returns false
   */
  export const VALIDATE = (value: string, pattern: RegExp): boolean => {
    return pattern.test(value);
  };
  
  /**
   * Returns appropriate error message for a failed validation
   * @example GET_ERROR_MESSAGE('EMAIL') // returns "Please enter a valid email address"
   */
  export const GET_ERROR_MESSAGE = (type: keyof typeof VALIDATION_MESSAGES): string => {
    return VALIDATION_MESSAGES[type] || 'Invalid input';
  };