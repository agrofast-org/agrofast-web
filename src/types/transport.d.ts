export interface Request {
  uuid: string;
  user: User;
  machine: Machine;
  origin_place_id: string;
  origin_place_name: string;
  origin_latitude: string;
  origin_longitude: string;
  destination_place_id: string;
  destination_place_name: string;
  destination_latitude?: string;
  destination_longitude?: string;
  distance: number;
  estimated_time: number;
  estimated_cost: string;
  final_cost?: string;
  payment_id?: number;
  payment?: Payment;
  desired_date?: string;
  state:
    | "pending"
    | "waiting_for_offer"
    | "payment_pending"
    | "approved"
    | "rejected"
    | "in_progress"
    | "canceled"
    | "completed";
  active: boolean;
  created_at: string;
  updated_at: string;
  inactivated_at?: string;
}

export interface Offer {
  uuid: string;
  request_uuid: string;
  transporter: Transporter;
  proposed_cost: string;
  message?: string;
  state:
    | "pending"
    | "waiting_for_offer"
    | "payment_pending"
    | "approved"
    | "rejected"
    | "in_progress"
    | "canceled"
    | "completed";
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: number;
  uuid: string;
  payment_id: number;
  status: string;
  status_detail: string;
  transaction_amount: 1;
  external_reference?: string;
  date_created: string;
  date_approved?: string;
  date_last_updated: string;
  date_of_expiration: string;
  qr_code: string;
  qr_code_base64: string;
  ticket_url: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  inactivated_at?: string;
}
