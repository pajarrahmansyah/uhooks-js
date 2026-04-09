"use client";

import {
  useEffect,
  useState,
} from 'react';

import Link from 'next/link';

import { useDebounce } from 'uhooks-js';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 800);
  const debouncedInput = useDebounce(inputValue, 500);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [apiCallCount, setApiCallCount] = useState(0);

  // Simulate API call when debounced value changes
  useEffect(() => {
    if (debouncedSearch) {
      setApiCallCount((prev) => prev + 1);
      // Simulate API delay
      setTimeout(() => {
        setSearchResults([
          `Result 1 for "${debouncedSearch}"`,
          `Result 2 for "${debouncedSearch}"`,
          `Result 3 for "${debouncedSearch}"`,
        ]);
      }, 300);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearch]);

  return (
    <main style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ color: "#333" }}>🎣 uhooks-js Demo</h1>
      <Link href="https://github.com/pajarrahmansyah/uhooks-js">GitHub</Link>
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          marginBottom: "2rem",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>useDebounce Example</h2>

        <div style={{ marginBottom: "1.5rem" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "bold",
            }}
          >
            Search (800ms delay):
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type to search..."
            style={{
              width: "100%",
              padding: "0.75rem",
              fontSize: "1rem",
              border: "2px solid #ddd",
              borderRadius: "4px",
              boxSizing: "border-box",
            }}
          />
          <div
            style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#666" }}
          >
            <div>
              Current value: <code>{searchTerm || "(empty)"}</code>
            </div>
            <div>
              Debounced value: <code>{debouncedSearch || "(empty)"}</code>
            </div>
            <div>
              API calls made: <strong>{apiCallCount}</strong>
            </div>
          </div>
        </div>

        {searchResults.length > 0 && (
          <div
            style={{
              padding: "1rem",
              backgroundColor: "#f0f9ff",
              borderRadius: "4px",
              border: "1px solid #bfdbfe",
            }}
          >
            <strong>Search Results:</strong>
            <ul style={{ marginTop: "0.5rem", paddingLeft: "1.5rem" }}>
              {searchResults.map((result, i) => (
                <li key={i}>{result}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Live Character Counter (500ms delay)</h2>

        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type something here..."
          rows={5}
          style={{
            width: "100%",
            padding: "0.75rem",
            fontSize: "1rem",
            border: "2px solid #ddd",
            borderRadius: "4px",
            boxSizing: "border-box",
            fontFamily: "inherit",
            resize: "vertical",
          }}
        />

        <div style={{ marginTop: "1rem", display: "flex", gap: "2rem" }}>
          <div>
            <div style={{ fontSize: "0.875rem", color: "#666" }}>
              Real-time count:
            </div>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#dc2626",
              }}
            >
              {inputValue.length}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.875rem", color: "#666" }}>
              Debounced count:
            </div>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#16a34a",
              }}
            >
              {debouncedInput.length}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          backgroundColor: "#fffbeb",
          border: "1px solid #fde68a",
          borderRadius: "4px",
        }}
      >
        <strong>💡 Tips:</strong>
        <ul style={{ marginBottom: 0, paddingLeft: "1.5rem" }}>
          <li>
            Type in the search box and watch the debounced value update after
            800ms
          </li>
          <li>Notice how API calls only happen after you stop typing</li>
          <li>The character counter shows real-time vs debounced values</li>
        </ul>
      </div>
    </main>
  );
}
