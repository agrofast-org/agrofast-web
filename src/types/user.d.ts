export interface Document {
  id: number;
  uuid: string;
  user_id: number;
  document_type: string;
  emission_date: string; // ISO 8601 format
  number: string;
  active: boolean;
  created_at: string; // ISO 8601 format
  updated_at: string; // ISO 8601 format
  inactivated_at?: string; // ISO 8601 format or null
}

export type ProfileType = "requester" | "transporter";

export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  number?: string;
  profile_type?: ProfileType;
  profile_picture?: string;
  documents?: Document[];
  user_mercado_pago?: object[];
}

export interface Machinery {
  uuid: string;
  name: string;
}
export interface Carrier {
  uuid: string;
  name: string;
}
