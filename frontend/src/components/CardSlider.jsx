import React from "react";
import Slider from "react-slick";
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import useMovies from "../hooks/useMovies";
import { useNavigate } from "react-router-dom";

const cardData = [
  { title: "Fire force", content: "This is card 1 content" },
  { title: "Fire force", content: "This is card 2 content" },
  { title: "Fire force", content: "This is card 3 content" },
  { title: "Fire force", content: "This is card 4 content" },
  { title: "Fire force", content: "This is card 5 content" },
  { title: "Fire force", content: "This is card 1 content" },
  { title: "Fire force", content: "This is card 2 content" },
];

const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      style={{
        position: "absolute",
        top: "50%",
        right: "10px",
        zIndex: 1,
        backgroundColor: "white",
      }}
    >
      <ArrowForwardIosIcon />
    </IconButton>
  );
};

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      style={{
        position: "absolute",
        top: "50%",
        left: "10px",
        zIndex: 1,
        backgroundColor: "white",
      }}
    >
      <ArrowBackIosIcon />
    </IconButton>
  );
};

const CardSlider = () => {

  const {data} = useMovies();
  console.log(data);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 7, // Default number of cards to show
    slidesToScroll: 1,
    nextArrow: <NextArrow />, // Custom Next Arrow
    prevArrow: <PrevArrow />, // Custom Prev Arrow
    responsive: [
      {
        breakpoint: 1024, // For large screens (desktops)
        settings: {
          slidesToShow: 3, // Show 3 cards
        },
      },
      {
        breakpoint: 768, // For medium screens (tablets)
        settings: {
          slidesToShow: 2, // Show 2 cards
        },
      },
      {
        breakpoint: 480, // For small screens (mobile devices)
        settings: {
          slidesToShow: 1, // Show 1 card
        },
      },
    ],
  };

  const navigate = useNavigate();

  const handleSubmit = (id) => {
    navigate(`/moviedetails/${id}`);
  }

  return (
    <Slider {...settings}>
      {data?.map((card, index) => (
        <Card key={index} sx={{ maxWidth: 180, marginLeft: '10px' }}>
          <CardMedia
            sx={{ height: 255 }}
            image={card.imageUrl}
            title="green iguana"
          />
          <CardContent>
            <Typography gutterBottom component="div">
              {card.title}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {card.genre}
            </Typography>
            <Button
              variant="contained"
              onClick={() => handleSubmit(card._id)}
              sx={{
                backgroundColor: "black",
                color: "white",
                borderRadius: "20px",
                marginTop: "10px",
                fontSize: "12px",
              }}
              endIcon={<ConfirmationNumberIcon />}
            >
              Time & Ticket
            </Button>
          </CardContent>
        </Card>
      ))}
    </Slider>
  );
};

export default CardSlider;
