
export interface Vendor {
  name: string;
  contact: string;
  phone: string;
  location: string;
  priceEstimate: string;
}

export interface SimilarProduct {
  name: string;
  brand: string;
  price: string;
  matchScore: string; 
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AnalyzedItem {
  id: string;
  name: string;
  category: 'Finish' | 'Furniture' | 'Lighting' | 'Appliance' | 'Decor' | 'Vehicle' | 'Fabric' | 'Sanitaryware';
  description: string;
  material: string;
  x: number; 
  y: number; 
  vendors: Vendor[];
  similarProducts?: SimilarProduct[];
  groundingSources?: GroundingSource[];
  quantityEstimate: string;
  searchQuery: string;
  averagePrice: string;
  isUpdating?: boolean;
}

export interface AnalysisResult {
  items: AnalyzedItem[];
  summary: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
