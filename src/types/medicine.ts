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
  indications_and_usage?: string[];
  dosage_and_administration?: string[];
  purpose?: string[];
  warnings?: string[];
  active_ingredient?: string[];
  spl_product_data_elements?: string[];
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