import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ToolCard = ({ title, description, icon: Icon, path }) => {
  const navigate = useNavigate();

  return (
    <Paper
      elevation={isActive ? 1 : 1}
      sx={{
        p: 3,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: 3,
          cursor: "pointer",
        },
        height: "100%",
      }}
      onClick={() => path && navigate(path)}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
          bgcolor: "grey.100",
        }}
      >
        <Icon sx={{ fontSize: 24, color: "primary.main" }} />
      </Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Paper>
  );
};

export default ToolCard;
