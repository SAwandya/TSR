import { APIClient } from "./api-client";

const apiClient = new APIClient("/movies");

class MovieService {
  CreateMovie(movies) {
    return apiClient.post(movies);
  }
}

export default new MovieService();
