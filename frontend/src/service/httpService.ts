/* eslint-disable @typescript-eslint/no-explicit-any */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';


interface ApiResponse<T = any> {
    success : boolean;
    message :string;
    data : T;
    meta ?: any;
}

interface RequestOptions {
    headers ?: Record<string, string> 
}

class HttpService {
  private getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private getHeader(auth: boolean = true): Record<string, string> {
    if (auth) {
      return this.getAuthHeader();
    }
    return { "Content-Type": "application/json" };
  }

  private async makeRequest<T = any>(
    endPoint: string,
    method: string,
    body?: any,
    auth: boolean = true,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${BASE_URL}/${endPoint}`;
      const headers = {
        ...this.getHeader(auth),
        ...options?.headers,
      };

      const config: RequestInit = {
        method,
        headers,
        ...(body && { body: JSON.stringify(body) }),
      };

      const response = await fetch(url, config);
      const data: ApiResponse<T> = await response.json();


      if (!response.ok) {
        throw new Error(
          data.message || `HTTP ${response.status} : ${response.statusText}`
        );
      }

      return data;
    } catch (err) {
      console.error(`Api Error [${method} ${endPoint}]`, err);
      throw err;
    }
  }

  async getWithAuth<T = any>(
    endPoint: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endPoint, "GET", null, true, options);
  }

  async postWithAuth<T = any>(
    endPoint: string,
    body: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endPoint, "POST", body, true, options);
  }

  async putWithAuth<T = any>(
    endPoint: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endPoint, "PUT", null, true, options);
  }

  async deleteWithAuth<T = any>(
    endPoint: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endPoint, "DELETE", null, true, options);
  }

  async getWithoutAuth<T = any>(
    endPoint: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endPoint, "GET", null, false, options);
  }

  async postWithoutAuth<T = any>(
    endPoint: string,
    body: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endPoint, "POST", body, false, options);
  }

  async putWithoutAuth<T = any>(
    endPoint: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endPoint, "PUT", null, false, options);
  }

  async deleteWithoutAuth<T = any>(
    endPoint: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endPoint, "DELETE", null, false, options);
  }
}


export const httpService = new HttpService();
export const getWithAuth = httpService.getWithAuth.bind(httpService);
export const postWithAuth = httpService.postWithAuth.bind(httpService);
export const putWithAuth = httpService.putWithAuth.bind(httpService);
export const deleteWithAuth = httpService.deleteWithAuth.bind(httpService);
export const getWithoutAuth = httpService.getWithoutAuth.bind(httpService);
export const postWithoutAuth = httpService.postWithoutAuth.bind(httpService);
export const putWithoutAuth = httpService.putWithoutAuth.bind(httpService);
export const deleteWithoutAuth = httpService.deleteWithoutAuth.bind(httpService);
