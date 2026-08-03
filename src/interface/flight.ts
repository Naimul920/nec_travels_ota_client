export interface SearchPayload {
  flight: "oneway" | "roundtrip" | "multicity";
  from?: string;
  to?: string;
  start_date?: string;
  return_date?: string;
  no_of_adult: number;
  no_of_children: number;
  no_of_kids: number;
  no_of_infant: number;
  flight_class: string;
  segments?: { from: string; to: string; start_date: string }[];
}

export interface FlightSearchResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: FlightSearchData;
}

export interface FlightSearchData {
  searchId: string;
  tripType: string;
  from: string;
  to: string;
  startDate: string;
  noOfAdult: number;
  noOfChildren: number;
  noOfKids: number;
  noOfInfant: number;
  itinDetails: Itinerary[];
}

export interface Itinerary {
  isRefundable: boolean;
  marriageGroup: string;
  sourceProvider?: string;
  flightDetails: FlightDetail[];
  passengerFareBreakDown: PassengerFare[];
  saleCurrencyAmount: SaleCurrencyAmount;
}

export interface FlightDetail {
  elapsedTime: number;
  schedules: Schedule[];
}

export interface Schedule {
  flightName: string;
  bookingCode: string;
  cabinCode: string;
  seatsAvailable: number;
  marketingCarrierCode: string;
  operatingCarrierCode: string;
  marketingFlightNumber: number;
  frequency: string;
  stopCount: number;
  isQuoteSharedFlight: boolean;
  airCraftType: string;
  airCraftTypeForFirstLeg: string;
  airCraftTypeForLastLeg: string;
  departure: AirportInfo;
  arrival: AirportInfo;
  totalMilesFlown: number;
  departureDateTime: string;
  arrivalDateTime: string;
}

export interface AirportInfo {
  airport: string;
  time: string;
  country: string;
  terminal?: string;
}

export interface PassengerFare {
  fareBasisCode: string;
  totalFare: number;
  totalTaxAmount: number;
  currency: string;
  validatingCarrierCode: string;
  lastTicketDate: string;
  lastTicketTime: string;
  passengerType: string;
  passengerNumber: number;
}

export interface SaleCurrency {
  taxFare: number;
  baseAmount: number;
  grossFare: number;
  ait: number;
  discountAmount: number;
  offerAmount?: number;
  totalAmount: number;
}

export interface BookingPassenger {
  title: string;
  firstname: string;
  lastname: string;
  gender: string;
  date_of_birth: string;
  country: string;
  passport_number: string;
  passport_expire: string;
  passenger_type: string;
  email?: string;
  phone?: string;
}

export interface BookingSegment {
  origin: string;
  destination: string;
  departure_date_time: string;
  arrival_date_time: string;
  flight_number: string;
  carrier_code: string;
  res_book_desig_code: string;
}

export interface LeadPassenger {
title: string;
  firstname: string;
  lastname: string;
  gender: string;
  date_of_birth: string;
  country: string;
  passport_number: string;
  passport_expire: string;
  passenger_type: string;
  email?: string;
  phone?: string;
}

export interface Passenger {
  title: string;
  firstname: string;
  lastname: string;
  gender: string;
  date_of_birth: string;
  country: string;
  passport_number: string;
  passport_expire: string;
  passenger_type: string;
}


export interface BookFlightPayload {
  quoteId: string;
  lead_passenger: LeadPassenger;
  passengers?: Passenger[];
  segments: BookingSegment[];
  payment_type: string;
  provider: string;
}
export interface FlightBookingResponseData {
booking_id: string;
booking_reference: string;
pnr: string;
}
export interface FlightBookingResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: FlightBookingResponseData;
}

export interface SaleCurrencyAmount {
  totalFare: number;
  totalAmount: number;
  baseAmount: number;
  discountAmount: number;
  offerAmount?: number;
  taxFare: number;
}

export interface RevalidateItineraryPayload {
  tripType: string;
  from: string;
  to: string;
  noOfAdult: number;
  noOfChildren: number;
  noOfKids: number;
  noOfInfant: number;
  itinDetail: { flightDetails: FlightDetail[] };
  passengerFareBreakDown: PassengerFare[];
  saleCurrencyAmount: SaleCurrencyAmount;
  searchId: string;
}

export interface RevalidateItineraryResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    quoteId: string;
    itineraries: Itinerary[];
  };
}
