/**
 * Base function that adds authentication headers to a fetch request
 */
function addAuthHeaders(options: RequestInit = {}): RequestInit {
  const token = localStorage.getItem("auth_token");
  
  const headers = {
    "Content-Type": "application/json",
    "Authorization": token ? `Bearer ${token}` : "",
    ...options.headers,
  };
  
  return {
    ...options,
    headers,
  };
}

/**
 * Performs an authenticated GET request
 * @param url The URL to fetch from
 * @param queryParams Optional query parameters as an object
 * @param options Additional fetch options
 */
export async function fetchWithAuth_GET<T = unknown>(
  url: string, 
  queryParams: Record<string, string> = {}, 
  options: RequestInit = {}
): Promise<T> {
  const queryString = new URLSearchParams(queryParams).toString();
  const finalUrl = queryString ? `${url}?${queryString}` : url;
  
  
  try {
    const response = await fetch(finalUrl, addAuthHeaders({ 
      ...options,
      method: 'GET',
    }));
      
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response body:", errorText);
      throw new Error(`HTTP error ${response.status}: ${errorText}`);
    }
    
    return response.json();
  } catch (error) {  
    console.error("Request failed:", error);
    throw error;
  }
}

/**
 * Performs an authenticated POST request with JSON body
 * @param url The URL to post to
 * @param data The data to send in the request body
 * @param options Additional fetch options
 */
export async function fetchWithAuth_POST<T = unknown, D = unknown>(
  url: string, 
  data: D, 
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, addAuthHeaders({
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  }));
  
  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}: ${await response.text()}`);
  }
  
  return response.json();
}

/**
 * Performs an authenticated PUT request with JSON body
 * @param url The URL to put to
 * @param data The data to send in the request body
 * @param options Additional fetch options
 */
export async function fetchWithAuth_PUT<T = unknown, D = unknown>(
  url: string, 
  data: D, 
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, addAuthHeaders({
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  }));
  
  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}: ${await response.text()}`);
  }
  
  return response.json();
}

/**
 * Performs an authenticated DELETE request
 * @param url The URL to delete from
 * @param options Additional fetch options
 */
export async function fetchWithAuth_DELETE<T = unknown>(
  url: string, 
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, addAuthHeaders({
    ...options,
    method: 'DELETE',
  }));
  
  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}: ${await response.text()}`);
  }
  
  return response.json();
}

/**
 * Performs an authenticated PATCH request with JSON body
 * @param url The URL to patch
 * @param data The data to send in the request body
 * @param options Additional fetch options
 */
export async function fetchWithAuth_PATCH<T = unknown, D = unknown>(
  url: string, 
  data: D, 
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, addAuthHeaders({
    ...options,
    method: 'PATCH',
    body: JSON.stringify(data),
  }));
  
  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}: ${await response.text()}`);
  }
  
  return response.json();
}

/**
 * Specialized function for authenticated file uploads using FormData
 * @param url The URL to upload to
 * @param formData The FormData object containing the file and metadata
 * @param options Additional fetch options
 */
export async function fetchWithAuth_UPLOAD<T = unknown>(
  url: string, 
  formData: FormData,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("auth_token");
  
  const headers = {
    "Authorization": token ? `Bearer ${token}` : "",
    ...options.headers,
  };
  
  const response = await fetch(url, {
    ...options,
    method: 'POST', 
    headers,
    body: formData,
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Upload error response:", errorText);
    throw new Error(`Upload failed: ${response.status} ${errorText}`);
  }
  
  return response.json();
}

/**
 * Original general-purpose authenticated fetch function
 * (Kept for backward compatibility)
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  return fetch(url, addAuthHeaders(options));
}