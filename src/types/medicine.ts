export interface OpenFDA {
  brand_name?: string[];
  generic_name?: string[];
  manufacturer_name?: string[];
  product_type?: string[];
  route?: string[];
  substance_name?: string[];
  application_number?: string[];
}
export interface Medicine {
    openfda?: OpenFDA;
    [key: string]: unknown;
}
export interface MedicineList {
    results: Medicine[];
    meta?: {
        results?: {
            total?: number;
        };
    };
}