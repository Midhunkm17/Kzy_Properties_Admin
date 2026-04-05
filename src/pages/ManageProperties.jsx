import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Typography,
  CircularProgress,
  Pagination,
  useTheme,
  Button,
  Divider,
} from "@mui/material";
import { getProperties } from "../services/apis/propertyApis";
import toast, { Toaster } from "react-hot-toast";
import PropertyDetailsDrawer from "../components/PropertyDetailsDrawer";
import { PropertyCard } from "../components/PropertyCard";

const ManageProperties = () => {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const handleViewDetails = (property) => {
    setSelectedProperty(property);
    setDrawerOpen(true);
  };

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["properties", currentPage, itemsPerPage],
    queryFn: () => getProperties({ page: currentPage, limit: itemsPerPage }),
    keepPreviousData: true,
  });

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    toast.error("Something went wrong!");
    return null;
  }

  const properties = data?.data || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <Box sx={{ width: "100%", boxSizing: "border-box" }}>
      <Typography fontSize={25} fontWeight={600}>
        Manage Properties
      </Typography>

      <Divider sx={{ my: 2 }} />

      {properties.length === 0 ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="40vh"
        >
          <Typography color="text.secondary">No properties found.</Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 2,
            width: "100%",
          }}
        >
          {properties.map((item) => (
            <PropertyCard
              key={item._id}
              item={item}
              onView={handleViewDetails}
            />
          ))}
        </Box>
      )}

      {totalPages > 1 && (
        <Box mt={4} mb={2} display="flex" justifyContent="center">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, value) => setCurrentPage(value)}
            color="primary"
            shape="rounded"
            disabled={isFetching}
          />
        </Box>
      )}

      <PropertyDetailsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        property={selectedProperty}
      />

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: "12px",
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
          },
        }}
      />
    </Box>
  );
};

export default ManageProperties;
