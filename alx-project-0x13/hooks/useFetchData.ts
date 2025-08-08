import { useState } from "react";
import { ImageProps } from "@/interfaces";

/**
 * Custom hook for making POST requests and tracking generated images.
 * T: The shape of the expected response.
 * R: The shape of the request body — must include a 'prompt' field.
 */
const useFetchData = <T, R extends { prompt: string }>() => {
  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<ImageProps[]>([]);

  const fetchData = async (endpoint: string, body: R) => {
    setIsLoading(true);
    setError(null);

    try {
      const resp = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!resp.ok) {
        const errorText = await resp.text();
        throw new Error(`Fetch error: ${resp.status} - ${errorText}`);
      }

      const result: T = await resp.json();
      setResponseData(result);

      // Add to generated images list using result + prompt
      setGeneratedImages((prev) => [
        ...prev,
        {
          imageUrl: (result as any).imageUrl, // adjust if your response shape is different
          prompt: body.prompt,
        },
      ]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    responseData,
    error,
    fetchData,
    generatedImages,
  };
};

export default useFetchData;
