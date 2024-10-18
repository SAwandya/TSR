import axios, { CanceledError } from "axios";

const axiosInstance = axios.create({
  baseURL: "http://trs-crfja2d0acc8fgcr.eastus-01.azurewebsites.net/api",
});

class APIClient {
  endpoint;

  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  post = (config) => {
    // axiosInstance.defaults.headers.common["x-auth-token"] =
    //   localStorage.getItem("token");
    return axiosInstance.post(this.endpoint, config).then((res) => res.data);
  };

  getAll = () => {
    axiosInstance.defaults.headers.common["x-auth-token"] =
      localStorage.getItem("token");
    return axiosInstance.get(this.endpoint).then((res) => res.data);
  };

  delete = (params) => {
    axiosInstance.defaults.headers.common["x-auth-token"] =
      localStorage.getItem("token");
    return axiosInstance
      .delete(`${this.endpoint}/${params}`)
      .then((res) => res.data);
  };

  put = (config, params) => {
    axiosInstance.defaults.headers.common["x-auth-token"] =
      localStorage.getItem("token");
    return axiosInstance
      .put(`${this.endpoint}/${params}`, config)
      .then((res) => res.data);
  };

  getOne = (params) => {
    // axiosInstance.defaults.headers.common["x-auth-token"] =
    //   localStorage.getItem("token");
    return axiosInstance
      .get(`${this.endpoint}/${params}`)
      .then((res) => res.data);
  };

  getMore = (movieId, theaterId) => {
    return axiosInstance.get(`${this.endpoint}`, {
      params: {
        movieId: movieId,
        theaterId: theaterId,
      },
    });
  };

}

export { CanceledError, APIClient };
