export interface Document {
  uuid: string;
  type: string;
  number: string;
  expiration_date: string;
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
}

export interface Machinery {
  uuid: string;
}
export interface Carrier {
  uuid: string;
}
