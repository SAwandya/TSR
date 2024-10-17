import { useQuery } from "@tanstack/react-query";
import { APIClient } from "../services/api-client";

const apiClient = new APIClient("/showtimes");

const useShowtimes = (movieId, theaterId) => {
  return useQuery({
    queryKey: ["showtimes", movieId, theaterId], // Query key
    queryFn: () =>
      apiClient.getMore(movieId, theaterId).then((res) => res.data), // Query function
    enabled: !!movieId && !!theaterId, // Query only runs when movieId and theaterId are available
  });
};

export default useShowtimes;
