export interface PBRMapSet {
  albedo: string;
  normal: string;
  roughness: string;
  fluid: string;
  metallic: string;
}

export interface GenerationRun {
  runId: string;
  timestamp: number;
  category: string;
  seed: number;
  variation: number;
  creativeFreedom: boolean;
  description: string;
  maps: PBRMapSet;
}

export interface ReferenceImage {
  id: string;
  url: string;
  name: string;
}

export interface GenerationSettings {
  category: string;
  seed: number;
  variation: number;
  creativeFreedom: boolean;
  description: string;
  references: ReferenceImage[];
}
