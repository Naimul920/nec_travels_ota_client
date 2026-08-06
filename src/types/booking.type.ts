export interface BookingCurrency {
  name: string;
  code: string;
  symbol: string;
}

export interface BookingFare {
  base_fare: string;
  tax: string;
  gross_fare: string;
  ait: string;
  service_charge: string;
  discount: string;
  offer_amount: string;
  total_amount: string;
}

export interface BookingSegment {
  airline: string;
  flight_number: string;
  booking_class: string;
  airline_pnr: string;
  airline_code: string;
  origin_airport_code: string;
  destination_airport_code: string;
  departure_at: string;
  arrival_at: string;
  baggage: string | null;
  cabin: string;
  duration: string;
}

export interface BookingPassenger {
  id: string;
  passenger_type: string;
  title: string;
  first_name: string;
  last_name: string;
  gender: string;
  dob: string;
  nationality: string;
  passport_number: string;
  passport_expiry: string;
  ticket_number: string | null;
  seat_number: string | null;
  baggage: string | null;
  meal: string | null;
  email: string | null;
  phone: string | null;
}

export interface BookingPayment {
  status: string;
  payment_method: string;
}

export interface BookingTicket {
  id: string;
  ticket_number: string | null;
  status: string;
  issued_at: string | null;
}

export interface BookingItem {
  id: string;
  booking_reference: string;
  booking_source: string;
  status: string;
  provider: string;
  gds_pnr: string;
  exchange_rate: string | null;
  remarks: string | null;
  booking_deadline: string | null;
  created_at: string;
  provider_booking_id?: string;
  total_amount?: string;
  user: {
    email: string;
    phone: string;
    b2b_user?: {
      logo_key: string;
      agency_name: string;
      documents: { caab_certificate_number: string }[];
    };
    profile: {
      first_name: string;
      last_name: string;
      full_name: string;
    };
  };
  currency: BookingCurrency;
  source: {
    name: string;
    code: string;
  };
  booking_fare: BookingFare;
  booking_segments: BookingSegment[];
  booking_passengers: BookingPassenger[];
  booking_payments: BookingPayment[];
  tickets: BookingTicket;
}
