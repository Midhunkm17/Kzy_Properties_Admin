import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Typography,
  CircularProgress,
  Pagination,
  useTheme,
  alpha,
  Card,
  CardContent,
  Chip,
  Button,
  Divider,
  Grid,
} from "@mui/material";

import { getProperties } from "../services/apis/propertyApis";
import toast, { Toaster } from "react-hot-toast";
import PropertyDetailsDrawer from "../components/PropertyDetailsDrawer";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const ManageProperties = () => {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const handleViewDetails = (property) => {
    setSelectedProperty(property);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => setDrawerOpen(false);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["properties", currentPage, itemsPerPage],
    queryFn: () => getProperties({ page: currentPage, limit: itemsPerPage }),
    keepPreviousData: true,
  });

  if (isLoading) return <CircularProgress />;
  if (isError) {
    toast.error("Something went wrong!");
    return null;
  }

  const properties = data?.data || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <>
      <Typography fontSize={25} fontWeight={600}>
        Manage Properties
      </Typography>
      <Divider />

      <Grid container spacing={3} mt={4}>
        {properties.map((item) => (
          <Grid item xs={12} sm={3} md={4} lg={3} key={item._id}>
            <Card
              sx={{
                width:180,
                height: 300,
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                transition: "all 0.3s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
                },
              }}
            >
              <Box sx={{ position: "relative", overflow: "hidden" }}>
                <Box
                  component="img"
                  src={item?.thumbnail}
                  alt={item?.propertyTitle}
                  sx={{
                    width: '100%',
                    height: 170,
                    objectFit: "cover",
                    transition: "transform 0.3s ease",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)",
                  }}
                />
                <Chip
                  label={`₹${new Intl.NumberFormat("en-IN").format(item.price)}`}
                  sx={{
                    position: "absolute",
                    bottom: 12,
                    left: 12,
                    backgroundColor: "rgba(40, 57, 235, 0.93)",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    opacity:.9
                  }}
                />
              </Box>

              <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                <Typography
                  fontSize={15}
                  component="h3"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    color: theme.palette.text.primary,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {item?.propertyTitle?.length > 30
                    ? `${item.propertyTitle.slice(0, 30)}...`
                    : item?.propertyTitle}
                </Typography>
                <Box display="flex" alignItems="center" mb={2}>
                  <LocationOnIcon
                    sx={{
                      color: "rgba(40, 57, 235, 0.93)",
                      fontSize: 18,
                      mr: 0.5,
                    }}
                  />
                  <Typography
                    fontSize={12}
                    color="text.secondary"
                    fontWeight={500}
                  >
                    {item?.place?.length > 20
                      ? `${item.place.slice(0, 20)}...`
                      : item?.place}
                  </Typography>
                </Box>
                <Button
                  onClick={() => handleViewDetails(item)}
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: "auto",
                    background: "rgba(40, 57, 235, 0.93)",
                    fontWeight: 600,
                    borderRadius: 2,
                    "&:hover": {
                      background: "rgb(40, 56, 235)",
                    },
                  }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Box mt={4} display="flex" justifyContent="center">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(e, value) => setCurrentPage(value)}
          color="primary"
          shape="rounded"
          disabled={isFetching}
        />
      </Box>

      {/* Drawer */}
      <PropertyDetailsDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        property={selectedProperty}
      />

      {/* Toast */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            borderRadius: "12px",
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          },
        }}
      />
    </>
  );
};

export default ManageProperties;
