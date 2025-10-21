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
  desired_date?: string;
  state: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  inactivated_at?: string;
}
