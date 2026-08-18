import { API_SERVICE_KEY, getAuthHeaders } from ".";

export async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
  
    const authHeaders = getAuthHeaders();
    const headers: Record<string, string> = {};
  
    if (authHeaders.Authorization) {
      headers['Authorization'] = authHeaders.Authorization;
    }
  
    const res = await fetch(`${API_SERVICE_KEY}/api/file`, {
      method: 'POST',
      headers: headers, 
      body: formData,
    });
  
    return res.json();
  }