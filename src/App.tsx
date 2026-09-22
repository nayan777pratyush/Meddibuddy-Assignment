import { useEffect, useState } from "react";
import { searchMedicine } from "./services/fda_api";
import { useDebounce } from "./hooks/useDebounce";
import SearchBar from "./components/SearchBar";
import type { Medicine } from "./types/medicine";
import MedicineList from "./components/MedicineList";

function App() {
  const [query, setQuery] = useState("");
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const debouncedQuery = useDebounce(query.trim(), 500);

  useEffect(() => {
    if (!debouncedQuery) {
      setMedicines([]);
      setError("");
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    // abortControllerRef.current?.abort();
    // abortControllerRef.current = controller;

    setLoading(true);
    setError("");

    searchMedicine(debouncedQuery, controller.signal)
      .then((results) => {
        if (controller.signal.aborted) return;
        setMedicines(results);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        console.log("Medicine search error:", err)
        setMedicines([]);
        setError("Failed to fetch medicines. Please try again.");
      })
      .finally(() => {
        if (controller.signal.aborted) return;
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [debouncedQuery]);

  return (
    <main className="app">
      <div className="container">
        <header className="header">
          <h1>Medicine Search</h1>
          <p>Search medicines by brand name</p>
        </header>

        <SearchBar value={query} onChange={setQuery} />

        <section className="results-section">
          {loading && <p>Searching medicines...</p>}

          {!loading && error && (
            <div className="state-message error">
              <p>{error}</p>
              <p>Please try again.</p>
            </div>
          )}

          {!loading && !error && debouncedQuery && medicines.length === 0 && (
            <div className="state-message">
              <p>No medicines found.</p>
              <p>Try searching with a different brand name.</p>
            </div>
          )}

          {!loading && !error && medicines.length > 0 && (
            <div>
              <p className="result-count">
                results for "{debouncedQuery}"
              </p>
              <p className="result-total">
                {medicines.length} medicines found.
              </p>
              <MedicineList 
                medicines={medicines} 
                onMedicineClick={(medicine, index) => {
                  console.log("Selected medicine:", medicine);
                  console.log("Medicine index:", index);
                }}
                />
            </div>

          )}

          {!loading && medicines.length > 0 && (
            <div>
              <p>Results for "{debouncedQuery}".</p>
              <p>{medicines.length} medicines found.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );  
}

export default App;
