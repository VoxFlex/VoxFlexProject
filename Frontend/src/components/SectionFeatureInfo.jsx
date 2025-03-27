import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const SectionFeatureInfo = ({
  title,
  subtitle,
  imgSrc,
  linkTo,
  buttonName,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: "#F4F6F9",
        borderRadius: "3.125rem",
        marginX: "5vw",
        marginBottom: "3rem",
        px: { xs: 2, md: 6 },
        py: { xs: 6, md: 6 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        width: "70%"
      }}
    >
      {/* Title */}
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ color: "#0A2540", mb: 2 }}
      >
        {title}
      </Typography>

      {/* Subtitle */}
      <Typography
        variant="subtitle1"
        sx={{
          color: "#666",
          maxWidth: { xs: "80%", md: "70%" },
          mx: "auto",
          whiteSpace: "pre-line",
        }}
      >
        {subtitle}
      </Typography>

      {/* Image */}
      <Box
        component="img"
        src={imgSrc}
        alt="feature-image"
        sx={{
          width: { xs: "100%", sm: "80%", md: "60%" },
        //   minHeight: "30vh",
          my: 6,
        }}
      />

      {/* CTA Button */}
      <Button
        component={Link}
        to={linkTo}
        variant="outlined"
        sx={{
          px: 5,
          py: 1,
          borderRadius: "30px",
          color: "#3478F6",
          borderColor: "#3478F6",
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#3478F6",
            color: "#fff",
          },
        }}
      >
        {buttonName}
      </Button>
    </Box>
  );
};

export default SectionFeatureInfo;
