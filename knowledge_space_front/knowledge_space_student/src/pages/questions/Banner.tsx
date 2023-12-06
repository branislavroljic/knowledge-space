import React from "react";
import { CardContent, Typography, Button, Box } from "@mui/material";
import starBg from "/src/assets/images/gold.png";
import BlankCard from "./BlankCard";

export interface BannerProps {
  title: string;
  subtitle?: string;
  goToText: string;
  onGoToClick: () => void;
}

const Banner = ({ title, subtitle, goToText, onGoToClick }: BannerProps) => {
  return (
    <BlankCard>
      <CardContent sx={{ p: "30px" }}>
        <Box textAlign="center">
          <img src={starBg} alt="star" width={150} />

          <Typography variant="h5">{title}</Typography>
          {subtitle && (
            <Typography variant="subtitle1" color="textSecondary" mt={1} mb={2}>
              {subtitle}
            </Typography>
          )}

          <Button
            color="primary"
            variant="contained"
            size="large"
            onClick={onGoToClick}
          >
            {goToText}
          </Button>
        </Box>
      </CardContent>
    </BlankCard>
  );
};

export default Banner;
