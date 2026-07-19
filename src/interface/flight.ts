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
  flightDetails: FlightDetail[];
  passengerFareBreakDown: PassengerFare[];
  saleCurrencyAmount: SaleCurrency;
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
  totalFare: number;
  taxFare: number;
}
