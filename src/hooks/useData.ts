/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR, { Arguments, mutate } from "swr";
import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite";

import { toUrlEncoded } from "@/utils/token";

// Fetcher function that includes the Authorization token
export const fetchWithToken = (endpoint: string, fullUrl?: boolean) => {
  const token = localStorage.getItem("access_token");

  return fetch(`${!fullUrl ? import.meta.env.VITE_BASE_URL : ''}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(async (res) => {
    if (!res.ok) throw new Error("Error fetching data");
    const result = await res.json();
    return result.data;
  });
};

// POST function with cache update using mutate
export const postWithToken = async (
  endpoint: string,
  data: Record<string, any>,
  contentType: string = "application/json"
): Promise<any> => {
  const token = localStorage.getItem("access_token");

  // Set up headers, conditionally adding Authorization
  const headers: HeadersInit = {
    "Content-Type": contentType,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  // Convert data based on content type
  const body =
    contentType === "application/x-www-form-urlencoded"
      ? toUrlEncoded(data)
      : JSON.stringify(data);

  const response = await fetch(`${import.meta.env.VITE_BASE_URL}${endpoint}`, {
    method: "POST",
    headers,
    body,
  });

  if (!response.ok) throw new Error("Failed to post data");

  const result = await response.json();

  // Optimistically update the cache for the endpoint
  mutate(
    endpoint,
    async (currentData: any) => {
      return [...(currentData || []), result];
    },
    false
  );

  // Revalidate cache to ensure consistency with the server
  mutate(endpoint);

  return result;
};

// POST function with cache update using mutate
export const uploadWithToken = async (
  endpoint: string,
  body: FormData,
): Promise<any> => {
  const token = localStorage.getItem("access_token");

  // Set up headers, conditionally adding Authorization
  const headers: HeadersInit = {
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(`${import.meta.env.VITE_BASE_URL}${endpoint}`, {
    method: "POST",
    headers,
    body,
  });

  if (!response.ok) throw new Error("Failed to post data");

  const result = await response.json();

  // Optimistically update the cache for the endpoint
  mutate(
    endpoint,
    async (currentData: any) => {
      return [...(currentData || []), result];
    },
    false
  );

  // Revalidate cache to ensure consistency with the server
  mutate(endpoint);

  return result;
};

export const useData = (endpoint: string | null) => useSWR(endpoint, fetchWithToken);

export const useInfinite = (
  getKey: SWRInfiniteKeyLoader<any, Arguments>,
  initialSize: number
) =>
  useSWRInfinite(
    getKey,
    fetchWithToken,
    { initialSize } // Start with no pages loaded
  );

export default useData;
