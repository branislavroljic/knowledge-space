import axiosClient, { headers } from "./axios";

export type PredefinedRequest = Omit<RequestInit, "method" | "body">;

export function get(url: string | URL) {
  return axiosClient.get(url.toString()).then((x) => x.data);
}

export function post(url: string | URL, body: string) {
  return axiosClient.post(url.toString(), body, {
    headers: headers(),
  });
}

export function put(url: string | URL, body: string) {
  return axiosClient.put(url.toString(), body, {
    headers: headers(),
  });
}

export function del(url: string | URL, params?: any) {
  return axiosClient.delete(url.toString(), {
    params: params,
  });
}

export function delById(baseUrl: string | URL, id: number) {
  return axiosClient.delete(new URL(id.toString(), baseUrl).toString());
}

export function appendFormDataFromObject(
  formData: FormData,
  obj: any
): FormData {
  for (const [key, value] of Object.entries(obj)) {
    if (value instanceof Date) {
      formData.append(key, value.toISOString());
    } else if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        formData.append(key, value[i]);
      }
    } else if (typeof value == "object") {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  }
  return formData;
}

export type InputFormDataSingle<T> = {
  image?: File;
  body?: T;
};

export type InputFormData<T> = {
  images?: File[];
  body?: T;
};

export function addPaginationParams(baseUrl: URL, ...filters: object[]): URL {
  const modifiedUrl = new URL(baseUrl);
  filters.forEach((f) => {
    for (const [k, v] of Object.entries(f)) {
      if (v != null && !(typeof v == "string" && v.trim().length == 0)) {
        modifiedUrl.searchParams.set(k, v);
      }
    }
  });
  return modifiedUrl;
}

export type Page<T> = {
  rows: T[];
  totalCount: number;
};

export type PageRequest = {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: string;
};

export type SelectInput = {
  id: number;
  name: string;
};

export type Status = "ACTIVE" | "DELETED";

export type ImageInfo = {
  imageBytes: Uint8Array;
  imageType: "png" | "jpeg";
  imageName: string;
};
