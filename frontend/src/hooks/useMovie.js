import { useQuery } from "@tanstack/react-query";
import { APIClient } from "../services/api-client";

const apiClient = new APIClient("/movies");

const useMovie = (id) =>
  useQuery({
    queryKey: ["movies", id],
    queryFn: () => apiClient.getOne(id),
  });

export default useMovie;
