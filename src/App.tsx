import { useEffect, useState } from "react";
import "./App.css";
import { searchMedicine } from "./services/fda_api";
import { useDebounce } from "./hooks/useDebounce";
import SearchBar from "./components/SearchBar";
import type { Medicine } from "./types/medicine";
import MedicineList from "./components/MedicineList";

function toList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }

  return [];
}

function formatListValue(value?: string[]) {
  if (!value || value.length === 0) return "N/A";
  return value.join(", ");
}

function extractText(medicine: Medicine, keys: string[]) {
  for (const key of keys) {
    const value = (medicine as Record<string, unknown>)[key];
    const list = toList(value);
    if (list.length > 0) {
      return list.join(" ");
    }
  }

  return "No detailed summary available for this medicine.";
}

function App() {
  const [query, setQuery] = useState("");
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const debouncedQuery = useDebounce(query.trim(), 600);

  const handleQueryChange = (value: string) => {
    const nextValue = value;
    setQuery(nextValue);

    if (!nextValue.trim()) {
      setMedicines([]);
      setSelectedMedicine(null);
      setError("");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!debouncedQuery) {
      return;
    }

    let isCancelled = false;

    const executeSearch = async () => {
      const controller = new AbortController();

      setLoading(true);
      setError("");
      setSelectedMedicine(null);

      try {
        const results = await searchMedicine(debouncedQuery, controller.signal);
        if (isCancelled || controller.signal.aborted) return;

        setMedicines(results);
        setSelectedMedicine(results[0] ?? null);
      } catch {
        if (isCancelled || controller.signal.aborted) return;

        setMedicines([]);
        setSelectedMedicine(null);
        setError("Failed to fetch medicines. Please try again.");
      } finally {
        if (!isCancelled && !controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void executeSearch();

    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery]);

  const selectedBrand = selectedMedicine?.openfda?.brand_name ?? [];
  const productType = formatListValue(selectedMedicine?.openfda?.product_type);
  const manufacturer = formatListValue(selectedMedicine?.openfda?.manufacturer_name);
  const genericName = formatListValue(selectedMedicine?.openfda?.generic_name);
  const route = formatListValue(selectedMedicine?.openfda?.route);
  const substance = formatListValue(selectedMedicine?.openfda?.substance_name);
  const application = formatListValue(selectedMedicine?.openfda?.application_number);

  const overviewText = selectedMedicine
    ? extractText(selectedMedicine, [
        "indications_and_usage",
        "purpose",
        "dosage_and_administration",
        "warnings",
        "active_ingredient",
      ])
    : "No detailed summary available for this medicine.";

  return (
    <main className="app">
      <div className="container">
        <header className="header">
          <h1>Medicine Search</h1>
          <p>Search medicines by brand name</p>
        </header>

        <SearchBar value={query} onChange={handleQueryChange} />

        <section className="results-section">
          {loading && (
            <div className="state-message loading">
              <p>Searching medicines...</p>
            </div>
          )}

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
            <>
              <div className="results-header">
                <p className="result-count">Results for "{debouncedQuery}"</p>
                <p className="result-total">
                  {medicines.length} medicine{medicines.length === 1 ? "" : "s"} found.
                </p>
              </div>

              {selectedMedicine && (
                <aside className="selected-medicine">
                  <div className="detail-hero">
                    <div className="medicine-visual" aria-hidden="true">
                      <div className="pill-bottle">
                        <div className="cap" />
                        <div className="bottle-body">
                          <span>RX</span>
                        </div>
                      </div>
                    </div>

                    <div className="selected-header">
                      <span className="selected-label">Selected medicine</span>
                      <h2>{formatListValue(selectedBrand)}</h2>
                    </div>
                  </div>

                  <div className="selected-grid">
                    <div>
                      <span>Generic name</span>
                      <strong>{genericName}</strong>
                    </div>
                    <div>
                      <span>Manufacturer</span>
                      <strong>{manufacturer}</strong>
                    </div>
                    <div>
                      <span>Route</span>
                      <strong>{route}</strong>
                    </div>
                    <div>
                      <span>Product type</span>
                      <strong>{productType}</strong>
                    </div>
                    <div>
                      <span>Substance</span>
                      <strong>{substance}</strong>
                    </div>
                    <div>
                      <span>Application</span>
                      <strong>{application}</strong>
                    </div>
                  </div>

                  <div className="detail-note">
                    <h3>Overview</h3>
                    <p>{overviewText}</p>
                  </div>

                  <div className="detail-section">
                    <div className="detail-block">
                      <h4>Clinical summary</h4>
                      <p>
                        {genericName} is associated with {manufacturer}. It is commonly classified as
                        a {productType.toLowerCase()} and is typically administered via {route.toLowerCase()}.
                      </p>
                    </div>

                    <div className="detail-block">
                      <h4>Key identifiers</h4>
                      <ul>
                        <li>
                          <strong>Active substance:</strong> {substance}
                        </li>
                        <li>
                          <strong>FDA application:</strong> {application}
                        </li>
                        <li>
                          <strong>Product route:</strong> {route}
                        </li>
                      </ul>
                    </div>
                  </div>
                </aside>
              )}

              <MedicineList
                medicines={medicines}
                onMedicineClick={setSelectedMedicine}
              />
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
