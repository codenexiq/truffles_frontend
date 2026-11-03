// ============================================
// Shared library utilities and helpers
// ============================================

/**
 * Fetch wrapper with error handling
 */
export async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
  const url = endpoint.startsWith("/") ? `${baseUrl}${endpoint}` : endpoint;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

/**
 * Generate metadata helper for pages
 */
export function generatePageMetadata({
  title,
  description,
  image,
}: {
  title: string;
  description?: string;
  image?: string;
}) {
  const siteName = "Truffles Cafe Restaurant";
  const defaultDescription =
    "Experience exquisite dining at Truffles Cafe Restaurant.";

  return {
    title: `${title} | ${siteName}`,
    description: description || defaultDescription,
    openGraph: {
      title: `${title} | ${siteName}`,
      description: description || defaultDescription,
      images: image ? [{ url: image }] : [],
      siteName,
    },
  };
}

