import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import ProgressCircle from "./ProgressCircle";

const StatBox = ({ title, subtitle, icon}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" m="0 30px">
      <Box display="flex" alignItems="center" justifyContent="space-between">
        {/* Icon and text content container */}
        <Box display="flex" alignItems="center">
          {/* Icon on the left */}
          <Box mr={1}>{icon}</Box>
          {/* Text content (title and subtitle) */}
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ color: colors.grey[100] }}>
              {title}
            </Typography>
            <Typography variant="h5">
              {subtitle}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default StatBox;
