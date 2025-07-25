import { describe, expect, it, vi } from "vitest";
import { searchShopifyDocs } from "./index.js";

// Mock shopifyDevFetch
vi.mock("./shopifyDevFetch.js", () => ({
  shopifyDevFetch: vi.fn(),
}));

import { shopifyDevFetch } from "./shopifyDevFetch.js";

describe("searchShopifyDocs pagination", () => {
  it("should add pagination metadata to array responses", async () => {
    const mockResults = [
      { id: 1, title: "Result 1" },
      { id: 2, title: "Result 2" },
      { id: 3, title: "Result 3" },
      { id: 4, title: "Result 4" },
      { id: 5, title: "Result 5" },
    ];

    vi.mocked(shopifyDevFetch).mockResolvedValueOnce(
      JSON.stringify(mockResults),
    );

    const result = await searchShopifyDocs("test query", {
      page: "1",
      per_page: "2",
    });

    expect(result.success).toBe(true);
    const parsed = JSON.parse(result.formattedText);

    expect(parsed.pagination).toEqual({
      page: 1,
      per_page: 2,
      total_results: 5,
      total_pages: 3,
      has_next_page: true,
      has_previous_page: false,
    });
    // Should only return first 2 results
    expect(parsed.results).toEqual([
      { id: 1, title: "Result 1" },
      { id: 2, title: "Result 2" },
    ]);
  });

  it("should add pagination metadata to object responses with results array", async () => {
    const mockResponse = {
      results: [
        { id: 1, title: "Result 1" },
        { id: 2, title: "Result 2" },
        { id: 3, title: "Result 3" },
        { id: 4, title: "Result 4" },
        { id: 5, title: "Result 5" },
      ],
      total_results: 10,
    };

    vi.mocked(shopifyDevFetch).mockResolvedValueOnce(
      JSON.stringify(mockResponse),
    );

    const result = await searchShopifyDocs("test query", {
      page: "2",
      per_page: "2",
    });

    expect(result.success).toBe(true);
    const parsed = JSON.parse(result.formattedText);

    expect(parsed.pagination).toEqual({
      page: 2,
      per_page: 2,
      total_results: 10,
      total_pages: 5,
      has_next_page: true,
      has_previous_page: true,
    });
    // Should only return results 3-4 (page 2, 2 per page)
    expect(parsed.results).toEqual([
      { id: 3, title: "Result 3" },
      { id: 4, title: "Result 4" },
    ]);
  });

  it("should handle responses that already have pagination", async () => {
    const mockResponse = {
      pagination: {
        page: 1,
        per_page: 10,
        total_results: 50,
        total_pages: 5,
      },
      results: [{ id: 1, title: "Result 1" }],
    };

    vi.mocked(shopifyDevFetch).mockResolvedValueOnce(
      JSON.stringify(mockResponse),
    );

    const result = await searchShopifyDocs("test query", {
      page: "1",
      per_page: "10",
    });

    expect(result.success).toBe(true);
    const parsed = JSON.parse(result.formattedText);

    // Should preserve existing pagination
    expect(parsed.pagination).toEqual(mockResponse.pagination);
  });

  it("should use default pagination values when not provided", async () => {
    const mockResults = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      title: `Result ${i + 1}`,
    }));

    vi.mocked(shopifyDevFetch).mockResolvedValueOnce(
      JSON.stringify(mockResults),
    );

    const result = await searchShopifyDocs("test query");

    expect(result.success).toBe(true);
    const parsed = JSON.parse(result.formattedText);

    expect(parsed.pagination).toEqual({
      page: 1,
      per_page: 10,
      total_results: 25,
      total_pages: 3,
      has_next_page: true,
      has_previous_page: false,
    });
    // Should only return first 10 results
    expect(parsed.results).toHaveLength(10);
    expect(parsed.results[0]).toEqual({ id: 1, title: "Result 1" });
    expect(parsed.results[9]).toEqual({ id: 10, title: "Result 10" });
  });

  it("should correctly paginate to page 2", async () => {
    const mockResults = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      title: `Result ${i + 1}`,
    }));

    vi.mocked(shopifyDevFetch).mockResolvedValueOnce(
      JSON.stringify(mockResults),
    );

    const result = await searchShopifyDocs("test query", {
      page: "2",
      per_page: "10",
    });

    expect(result.success).toBe(true);
    const parsed = JSON.parse(result.formattedText);

    expect(parsed.pagination).toEqual({
      page: 2,
      per_page: 10,
      total_results: 25,
      total_pages: 3,
      has_next_page: true,
      has_previous_page: true,
    });
    // Should return results 11-20
    expect(parsed.results).toHaveLength(10);
    expect(parsed.results[0]).toEqual({ id: 11, title: "Result 11" });
    expect(parsed.results[9]).toEqual({ id: 20, title: "Result 20" });
  });
});
