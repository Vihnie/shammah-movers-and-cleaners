export interface Booking {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  service_type: string;
  tier: string;
  tier_name: string;
  move_date: string;
  time_slot: string;
  pickup_address: string;
  dropoff_address: string;
  total_price: number;
  payment_method: string;
  status: 'Pending' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';
  details_json: string;
  created_at?: string;
}

export interface Lead {
  id: string;
  customer_name: string;
  phone: string;
  email: string;
  service_type: string;
  moving_from: string;
  moving_to: string;
  move_date: string;
  property_type: string;
  house_size: string;
  estimated_amount: number;
  status: 'New' | 'Contacted' | 'Quoted' | 'Converted' | 'Lost';
  notes?: string;
  created_at?: string;
}

export interface Quote {
  id: string;
  quote_number: string;
  lead_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  service_type: string;
  moving_from: string;
  moving_to: string;
  items_json: string;
  total_amount: number;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Declined';
  valid_until: string;
  created_at?: string;
}

export interface User {
  id: number;
  uid: string;
  email: string;
  display_name: string;
  role: string;
  created_at?: string;
}

export interface ServiceDetail {
  id: string;
  title: string;
  tagline: string;
  description: string;
  basePrice: number;
  priceUnit: string;
  icon: string;
  features: string[];
  popularFor: string;
}

export interface Vehicle {
  id: string;
  regNumber: string;
  model: string;
  type: 'Luton Box Van' | 'LWB Sprinter' | '7.5t Truck' | '18t Pantechnicon';
  capacityCuFt: number;
  status: 'Available' | 'On Route' | 'Maintenance' | 'Assigned';
  driverName: string;
  currentLocation: string;
}

export interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  service: string;
  verified: boolean;
}
