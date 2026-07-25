export interface IFlight {
  airportCode: string;
  airportName: string;
  cityCode: string;
  cityName: string;
  format: string;
  countryCode: string;
  countryName: string;
}

const BDdomFlight: Array<IFlight> = [
  {
    airportCode: "BZL",
    airportName: "Barisal Airport",
    cityCode: "BZL",
    cityName: "Barisal",
    format: "BZL, Barisal",
    countryCode: "BD",
    countryName: "Bangladesh",
  },
  {
    airportCode: "CGP",
    airportName: "Chittagong International Airport",
    cityCode: "CGP",
    cityName: "Chittagong",
    format: "CGP, Shah Amanat International",
    countryCode: "BD",
    countryName: "Bangladesh",
  },
  {
    airportCode: "CXB",
    airportName: "Cox's Bazar",
    cityCode: "CXB",
    cityName: "Cox's Bazar",
    format: "CXB, Cox's Bazar",
    countryCode: "BD",
    countryName: "Bangladesh",
  },
  {
    airportCode: "DAC",
    airportName: "Hazrat Shahjalal International Airport",
    cityCode: "DAC",
    cityName: "Dhaka",
    format: "DAC, Shahjalal International",
    countryCode: "BD",
    countryName: "Bangladesh",
  },
  {
    airportCode: "JSR",
    airportName: "Jessore",
    cityCode: "JSR",
    cityName: "Jessore",
    format: "JSR, Jessore",
    countryCode: "BD",
    countryName: "Bangladesh",
  },
  {
    airportCode: "RJH",
    airportName: "Rajshahi",
    cityCode: "RJH",
    cityName: "Rajshahi",
    format: "RJH, Shah Makhdum",
    countryCode: "BD",
    countryName: "Bangladesh",
  },
  {
    airportCode: "SPD",
    airportName: "Saidpur",
    cityCode: "SPD",
    cityName: "Saidpur",
    format: "SPD, Saidpur",
    countryCode: "BD",
    countryName: "Bangladesh",
  },
  {
    airportCode: "ZYL",
    airportName: "Sylhet Civil",
    cityCode: "ZYL",
    cityName: "Sylhet",
    format: "ZYL, Osmani International",
    countryCode: "BD",
    countryName: "Bangladesh",
  },
];

export const findbddom = (airportCode: string) => {
  return BDdomFlight.some((item) =>
    item.format
      .replace(/\s+/g, " ")
      .trim()
      .toLocaleLowerCase()
      .includes(airportCode.replace(/\s+/g, " ").trim().toLocaleLowerCase())
  );
};
