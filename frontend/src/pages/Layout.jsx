import React from "react";
import NavBar from "../components/NavBar";
import HomePage from "./HomePage";
import ImageSlider from "../components/ImageSlider";
import CardSlider from "../components/CardSlider";
import MovieDetailsPage from "./MovieDetailsPage";
import DateScroller from "../components/DateScroller";
import SeatSelection from "../components/SeatSelection";
import MoviePostForm from "../components/MoviePostForm";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

const Layout = () => {
  return (
    <>
      <NavBar />
      <Outlet />
      <Footer/>
    </>
  );
};

export default Layout;
