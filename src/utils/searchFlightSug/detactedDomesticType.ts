import { findbddom } from "./findbddom";
import { findnpdom } from "./findnpdom";

const detectDomesticType = (from: string, to: string) => {
  const isBdFrom = findbddom(from);
  const isBdTo = findbddom(to);

  const isNpFrom = findnpdom(from);
  const isNpTo = findnpdom(to);

  return {
    bddom: isBdFrom && isBdTo,
    npdom: !isBdFrom && !isBdTo && isNpFrom && isNpTo,
  };
};


export default detectDomesticType;