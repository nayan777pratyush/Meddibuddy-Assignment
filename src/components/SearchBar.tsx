interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="search-bar-wrap">
      <div className="search-bar">
        <label className="sr-only" htmlFor="medicine-search">
          Search medicine
        </label>
        <input
          id="medicine-search"
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search for medicine by brand name..."
          aria-label="Search medicine by brand name"
        />
        {value && (
          <button
            type="button"
            className="clear-button"
            onClick={() => onChange("")}
            aria-label="Clear search"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;