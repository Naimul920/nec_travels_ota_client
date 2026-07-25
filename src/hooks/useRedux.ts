import { useFlightStore } from "@/redux/features/flightSlice";

export const useAppDispatch = () => (action: () => void) => action();

export const useAppSelector = <T>(
  selector: (state: ReturnType<typeof useFlightStore.getState>) => T,
): T => useFlightStore(selector);