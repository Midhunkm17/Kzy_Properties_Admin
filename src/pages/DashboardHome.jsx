import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  House,
  HomeWork,
  AddHome,
  LocationOn,
  CheckCircle,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Typography,
  useTheme,
  Stack,
  Chip,
} from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import { getProperties } from "../services/apis/propertyApis";

// ── Recent Activity Item ────────────────────────────────────────────────────
const ActivityItem = ({ title, place, type, price }) => (
  <Box display="flex" alignItems="center" gap={2} py={1.2}>
    <Box
      sx={{
        bgcolor: "#f0f4ff",
        borderRadius: 2,
        p: 1,
        display: "flex",
        flexShrink: 0,
      }}
    >
      <House sx={{ fontSize: 18, color: "#4776E6" }} />
    </Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography
        fontSize={13}
        fontWeight={600}
        sx={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {title}
      </Typography>
      <Box display="flex" alignItems="center" gap={0.5}>
        <LocationOn sx={{ fontSize: 11, color: "text.secondary" }} />
        <Typography fontSize={11} color="text.secondary">
          {place}
        </Typography>
      </Box>
    </Box>
    <Stack alignItems="flex-end" spacing={0.5} flexShrink={0}>
      <Chip
        label={type}
        size="small"
        sx={{ fontSize: 10, height: 20, bgcolor: "#e8f4fd", color: "#1976d2" }}
      />
      <Typography fontSize={12} fontWeight={700} color="primary.main">
        ₹{new Intl.NumberFormat("en-IN").format(price)}
      </Typography>
    </Stack>
  </Box>
);

// ── Action Card ─────────────────────────────────────────────────────────────
const ActionCard = ({ label, description, icon, color, onClick }) => (
  <Card
    onClick={onClick}
    sx={{
      borderRadius: 3,
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      border: "1px solid rgba(0,0,0,0.06)",
      cursor: "pointer",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
      },
    }}
  >
    <CardContent sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
      <Box
        sx={{
          bgcolor: `${color}18`,
          borderRadius: 2,
          p: 1.2,
          display: "flex",
          flexShrink: 0,
        }}
      >
        {React.cloneElement(icon, { sx: { color, fontSize: 22 } })}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography fontWeight={600} fontSize={14}>
          {label}
        </Typography>
        <Typography fontSize={12} color="text.secondary" noWrap>
          {description}
        </Typography>
      </Box>
      <ArrowRight sx={{ color: "text.disabled", flexShrink: 0 }} />
    </CardContent>
  </Card>
);

// ── Main ────────────────────────────────────────────────────────────────────
const DashboardHome = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["properties", "dashboard"],
    queryFn: () => getProperties({ page: 1, limit: 5 }),
    staleTime: 5 * 60 * 1000,
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

  if (isError) toast.error("Something went wrong!");

  const totalCount = data?.count || 0;
  const recent = data?.data || [];

  return (
    <Box sx={{ width: "100%", boxSizing: "border-box" }}>
      {/* Header */}
      <Typography fontSize={{ xs: 20, sm: 24 }} fontWeight={700}>
        Dashboard
      </Typography>
      <Typography fontSize={13} color="text.secondary" mb={2}>
        Welcome back! Here's what's happening with your properties.
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {/* ── Stat Card — full width on mobile, 1/3 on desktop ── */}
      {/* ── Stat Card — full width ── */}
      <Card
        onClick={() => navigate("/properties")}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(71,118,230,0.25)",
          background: "linear-gradient(135deg, #4776E6 0%, #8E54E9 100%)",
          border: "none",
          cursor: "pointer",
          mb: 3,
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: "0 16px 40px rgba(71,118,230,0.35)",
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr auto" },
              alignItems: "center",
              gap: 2,
            }}
          >
            {/* Left — icon + label + number */}
            <Box>
              <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
                <Box
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    borderRadius: 2,
                    p: 1,
                    display: "flex",
                  }}
                >
                  <House sx={{ color: "#fff", fontSize: 24 }} />
                </Box>
                <Typography
                  color="rgba(255,255,255,0.85)"
                  fontSize={15}
                  fontWeight={500}
                  letterSpacing={0.3}
                >
                  Total Properties Listed
                </Typography>
              </Box>
              <Typography
                color="#fff"
                fontWeight={800}
                fontSize={{ xs: 48, sm: 64 }}
                lineHeight={1}
              >
                {totalCount}
              </Typography>
              <Typography color="rgba(255,255,255,0.65)" fontSize={13} mt={1}>
                Properties available across all categories
              </Typography>
            </Box>

            {/* Right — view all button */}
            <Box
              display="flex"
              flexDirection="column"
              alignItems={{ xs: "flex-start", sm: "flex-end" }}
              gap={1}
            >
              <Button
                endIcon={<ArrowRight />}
                onClick={() => navigate("/properties")}
                sx={{
                  color: "#fff",
                  bgcolor: "rgba(255,255,255,0.15)",
                  borderRadius: 2,
                  px: 2.5,
                  py: 1,
                  fontWeight: 600,
                  fontSize: 13,
                  backdropFilter: "blur(10px)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
                }}
              >
                View All
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* ── Bottom: Recent + Quick Actions ── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1.2fr 1fr" },
          gap: 2,
          alignItems: "start",
        }}
      >
        {/* Recent Properties */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1.5}
            >
              <Typography fontWeight={700} fontSize={15}>
                Recent Properties
              </Typography>
              <Button
                size="small"
                endIcon={<ArrowRight />}
                onClick={() => navigate("/properties")}
                sx={{ fontSize: 12 }}
              >
                View All
              </Button>
            </Box>
            <Divider sx={{ mb: 1 }} />
            {recent.length === 0 ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight={120}
              >
                <Typography fontSize={13} color="text.secondary">
                  No properties yet.
                </Typography>
              </Box>
            ) : (
              <Stack divider={<Divider />}>
                {recent.map((p) => (
                  <ActivityItem
                    key={p._id}
                    title={p.propertyTitle}
                    place={p.place}
                    type={p.serviceProvideType}
                    price={p.price}
                  />
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Typography fontWeight={700} fontSize={15}>
            Quick Actions
          </Typography>
          <ActionCard
            label="Add New Property"
            description="List a new property for sale or rent"
            icon={<AddHome />}
            color="#4776E6"
            onClick={() => navigate("/add-property")}
          />
          <ActionCard
            label="Manage Properties"
            description="Edit, update or remove listings"
            icon={<HomeWork />}
            color="#11998e"
            onClick={() => navigate("/properties")}
          />
          <ActionCard
            label="Active Listings"
            description={`${totalCount} properties currently listed`}
            icon={<CheckCircle />}
            color="#f7971e"
            onClick={() => navigate("/properties")}
          />
        </Box>
      </Box>

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

export default DashboardHome;
