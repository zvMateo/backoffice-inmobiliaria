"use client";

import { useMapProperties } from "../_hooks/useMapProperties";

export function DebugInfo() {
  const { properties, loading, error, filters } = useMapProperties();

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">🐛 Debug Info</h3>
      <div className="space-y-1">
        <div>Loading: {loading ? "✅" : "❌"}</div>
        <div>Error: {error || "None"}</div>
        <div>Properties: {properties.length}</div>
        <div>Filters: {JSON.stringify(filters, null, 2)}</div>
        {properties.length > 0 && (
          <div>
            <div>First property:</div>
            <pre className="text-xs overflow-auto max-h-20">
              {JSON.stringify(properties[0], null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
