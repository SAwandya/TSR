import React, { useState } from "react";
import { Box, Typography, Button, IconButton, styled } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const SliderContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  height: "70vh",
  overflow: "hidden",
}));

const SlideImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

const SlideContent = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(2),
  background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
  color: "white",
}));

const ThumbnailContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

const Thumbnail = styled("img")(({ active }) => ({
  width: "80px",
  height: "45px",
  objectFit: "cover",
  cursor: "pointer",
  border: active ? "2px solid white" : "none",
  opacity: active ? 1 : 0.7,
  transition: "opacity 0.3s ease",
  "&:hover": {
    opacity: 1,
  },
}));

const slides = [
  {
    image: "https://example.com/joker.jpg",
    title: "Joker: Folie à Deux",
    thumbnail: "https://example.com/joker-thumb.jpg",
  },
  {
    image: "https://example.com/venom.jpg",
    title: "Venom",
    thumbnail: "https://example.com/venom-thumb.jpg",
  },
  {
    image: "https://example.com/gladiator.jpg",
    title: "Gladiator",
    thumbnail: "https://example.com/gladiator-thumb.jpg",
  },
  // Add more slides as needed
];

const ImageSlider2 = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <Box>
      <SliderContainer>
        <SlideImage
          src={slides[currentSlide].image}
          alt={slides[currentSlide].title}
        />
        <SlideContent>
          <Typography variant="h4" gutterBottom>
            {slides[currentSlide].title}
          </Typography>
          <Box>
            <Button
              variant="contained"
              startIcon={<PlayArrowIcon />}
              sx={{ mr: 2, bgcolor: "primary.main" }}
            >
              Trailer
            </Button>
            <Button
              variant="outlined"
              sx={{ color: "white", borderColor: "white" }}
            >
              Get IMAX Tickets
            </Button>
          </Box>
        </SlideContent>
        <IconButton
          sx={{ position: "absolute", left: 10, top: "50%", color: "white" }}
          onClick={prevSlide}
        >
          <NavigateBeforeIcon />
        </IconButton>
        <IconButton
          sx={{ position: "absolute", right: 10, top: "50%", color: "white" }}
          onClick={nextSlide}
        >
          <NavigateNextIcon />
        </IconButton>
      </SliderContainer>
      <ThumbnailContainer>
        {slides.map((slide, index) => (
          <Thumbnail
            key={index}
            src={slide.thumbnail}
            alt={slide.title}
            active={index === currentSlide}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </ThumbnailContainer>
    </Box>
  );
};

export default ImageSlider2;
