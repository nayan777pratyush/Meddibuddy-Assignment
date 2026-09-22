import type { Medicine, MedicineList } from "../types/medicine";

const FDA_BASE_URL = "https://api.fda.gov/drug/label.json";

export async function searchMedicine(
    query: string,
    signal?: AbortSignal
): Promise<Medicine[]> {
    const url = `${FDA_BASE_URL}?search=openfda.brand_name:${encodeURIComponent(query)}&limit=20`;

    const response = await fetch(url, { signal });

    if (response.status === 404) return [];
    if (!response.ok) throw new Error(`failed to fetch medicines.`);

    const data: MedicineList = await response.json();
    return data.results ?? [];
}