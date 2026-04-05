import { Box, Typography, Button } from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn";

export const PropertyCard = ({ item, onView }) => {
  const formattedPrice = new Intl.NumberFormat("en-IN").format(item.price);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: "12px",
        overflow: "hidden",
        bgcolor: "background.paper",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        border: "1px solid rgba(0,0,0,0.06)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        height: "100%",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 10px 28px rgba(0,0,0,0.13)",
        },
      }}
    >
      {/* Image */}
      <Box sx={{ position: "relative", flexShrink: 0 }}>
        <Box
          component="img"
          src={item?.thumbnail}
          alt={item?.propertyTitle}
          sx={{
            width: "100%",
            height: 185,
            objectFit: "cover",
            display: "block",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 10,
            left: 10,
            bgcolor: "rgba(28,46,214,0.92)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 13,
            px: 1.5,
            py: 0.4,
            borderRadius: "6px",
            letterSpacing: 0.3,
          }}
        >
          ₹{formattedPrice}
        </Box>
      </Box>

      {/* Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          p: 2,
          gap: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 600,
            lineHeight: 1.45,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "2.9em",
            color: "text.primary",
          }}
        >
          {item?.propertyTitle}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <LocationOnIcon
            sx={{ fontSize: 14, color: "primary.main", flexShrink: 0 }}
          />
          <Typography
            sx={{
              fontSize: 12,
              color: "text.secondary",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {item?.place}
          </Typography>
        </Box>

        <Button
          onClick={() => onView(item)}
          variant="contained"
          fullWidth
          disableElevation
          sx={{
            mt: "auto",
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: 13,
            py: 1,
            textTransform: "uppercase",
            letterSpacing: 0.6,
          }}
        >
          View Details
        </Button>
      </Box>
    </Box>
  );
};
