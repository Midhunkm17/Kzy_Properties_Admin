import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  Stack,
  Avatar,
  IconButton,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import LinkIcon from "@mui/icons-material/Link";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import ImageIcon from "@mui/icons-material/Image";
import SellIcon from "@mui/icons-material/Sell";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateProperty,
  updatePropertyImages,
} from "../services/apis/propertyApis";
import toast from "react-hot-toast";

// ── Reusable field row ──────────────────────────────────────────────────────
const Field = ({
  label,
  value,
  onChange,
  disabled,
  icon,
  multiline,
  rows,
  type,
}) => (
  <TextField
    fullWidth
    label={label}
    value={value}
    onChange={onChange}
    disabled={disabled}
    multiline={multiline}
    rows={rows}
    type={type}
    InputProps={
      icon
        ? {
            startAdornment: (
              <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                {icon}
              </Box>
            ),
          }
        : undefined
    }
  />
);

const PropertyDetailsDrawer = ({ open, onClose, property }) => {
  const [formData, setFormData] = useState({});
  const [imageFiles, setImageFiles] = useState({});
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [apiError, setApiError] = useState(null);
  const queryClient = useQueryClient();

  const propertyMutation = useMutation({
    mutationFn: ({ id, data }) => updateProperty(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["properties"]);
      setApiError(null);
    },
    onError: (e) => setApiError(e.message),
  });

  const imagesMutation = useMutation({
    mutationFn: ({ id, imageFiles, thumbnailFile }) => {
      const merged = [];
      for (let i = 0; i < 6; i++) {
        const key = `image${i + 1}`;
        merged.push(imageFiles[key] ?? property.images?.[i] ?? null);
      }
      return updatePropertyImages(
        id,
        merged.filter(Boolean),
        thumbnailFile ?? property.thumbnail,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["properties"]);
      setApiError(null);
      setImageFiles({});
      setThumbnailFile(null);
    },
    onError: (e) => setApiError(e.message),
  });

  React.useEffect(() => {
    if (!open) {
      setFormData({});
      setImageFiles({});
      setThumbnailFile(null);
      setApiError(null);
    }
  }, [open]);

  if (!property) return null;

  const handleChange = (field) => (e) =>
    setFormData((p) => ({ ...p, [field]: e.target.value }));
  const handleImageChange = (index) => (e) => {
    const file = e.target.files[0];
    if (file) setImageFiles((p) => ({ ...p, [`image${index + 1}`]: file }));
  };
  const handleThumbnailChange = (e) => {
    const f = e.target.files[0];
    if (f) setThumbnailFile(f);
  };
  const toggleSoldStatus = () =>
    setFormData((p) => ({ ...p, isActive: !getValue("isActive") }));
  const getValue = (field) => formData[field] ?? property[field];

  const getImagePreview = (index) => {
    const key = `image${index + 1}`;
    return imageFiles[key]
      ? URL.createObjectURL(imageFiles[key])
      : property.images?.[index] || "";
  };
  const getThumbnailPreview = () =>
    thumbnailFile
      ? URL.createObjectURL(thumbnailFile)
      : property.thumbnail || "";

  const handleSaveAll = async () => {
    try {
      if (Object.keys(formData).length > 0)
        await propertyMutation.mutateAsync({
          id: property._id,
          data: formData,
        });
      if (Object.keys(imageFiles).length > 0 || thumbnailFile)
        await imagesMutation.mutateAsync({
          id: property._id,
          imageFiles,
          thumbnailFile,
        });
      toast.success("Property updated successfully");
      onClose();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const isPropertySold = !getValue("isActive");
  const isLoading = propertyMutation.isPending || imagesMutation.isPending;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 480, md: 560, lg: 640 },
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
        },
      }}
    >
      {/* ── Header ── */}
      <Box
        sx={{
          px: { xs: 2, sm: 3 },
          py: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          Edit Property
        </Typography>
        <IconButton onClick={onClose} size="small" disabled={isLoading}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* ── Scrollable body ── */}
      <Box sx={{ flex: 1, overflowY: "auto", px: { xs: 2, sm: 3 }, py: 2 }}>
        {/* Error / loading */}
        {apiError && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => setApiError(null)}
          >
            {apiError}
          </Alert>
        )}
        {isLoading && (
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <CircularProgress size={18} />
            <Typography variant="body2">Updating…</Typography>
          </Box>
        )}

        {/* Sold toggle */}
        <Button
          fullWidth
          variant={isPropertySold ? "contained" : "outlined"}
          color={isPropertySold ? "error" : "success"}
          startIcon={isPropertySold ? <SellIcon /> : <CheckCircleIcon />}
          onClick={toggleSoldStatus}
          disabled={isLoading}
          sx={{ mb: 2, borderRadius: 2 }}
        >
          {isPropertySold ? "Mark as Available" : "Mark as Sold"}
        </Button>

        <Divider sx={{ mb: 2 }} />

        {/* ── Thumbnail ── */}
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="drawer-thumbnail-upload"
          type="file"
          onChange={handleThumbnailChange}
          disabled={isLoading}
        />
        <label
          htmlFor="drawer-thumbnail-upload"
          style={{
            display: "block",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          <Box
            component="img"
            src={getThumbnailPreview()}
            alt="Thumbnail"
            sx={{
              width: "100%",
              height: { xs: 180, sm: 220 },
              objectFit: "cover",
              borderRadius: 2,
              border: "2px dashed #ccc",
              display: "block",
              mb: 2,
              "&:hover": { borderColor: "primary.main", opacity: 0.9 },
            }}
          />
        </label>

        {/* Title + chips */}
        <TextField
          fullWidth
          label="Property Title"
          value={getValue("propertyTitle")}
          onChange={handleChange("propertyTitle")}
          disabled={isLoading}
          sx={{ mb: 2 }}
        />
        <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
          <Chip
            label={property.propertyCategory}
            color="primary"
            size="small"
          />
          <Chip
            label={property.serviceProvideType}
            color="secondary"
            variant="outlined"
            size="small"
          />
          {isPropertySold && <Chip label="SOLD" color="error" size="small" />}
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* ── Property Images — CSS Grid ── */}
        <Typography variant="subtitle1" fontWeight={600} mb={1.5}>
          Property Images
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1.5,
            mb: 3,
          }}
        >
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <Box key={index}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id={`drawer-image-${index}`}
                type="file"
                onChange={handleImageChange(index)}
                disabled={isLoading}
              />
              <label
                htmlFor={`drawer-image-${index}`}
                style={{
                  display: "block",
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    paddingTop: "100%",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      borderRadius: 2,
                      border: "2px dashed #ddd",
                      overflow: "hidden",
                      bgcolor: "#f5f5f5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      "&:hover": { borderColor: "primary.main" },
                      backgroundImage: getImagePreview(index)
                        ? `url(${getImagePreview(index)})`
                        : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {!getImagePreview(index) && (
                      <ImageIcon sx={{ fontSize: 28, color: "#bbb" }} />
                    )}
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 4,
                        right: 4,
                        bgcolor: "rgba(0,0,0,0.55)",
                        color: "#fff",
                        fontSize: 10,
                        px: 0.6,
                        py: 0.2,
                        borderRadius: 1,
                      }}
                    >
                      {index + 1}
                    </Box>
                  </Box>
                </Box>
              </label>
            </Box>
          ))}
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* ── Fields ── */}
        <Stack spacing={2}>
          <Field
            label="Place"
            value={getValue("place")}
            onChange={handleChange("place")}
            disabled={isLoading}
            icon={<LocationOnIcon fontSize="small" />}
          />
          <Field
            label="Location URL"
            value={getValue("locationUrl")}
            onChange={handleChange("locationUrl")}
            disabled={isLoading}
            icon={<LinkIcon fontSize="small" />}
          />
          <Field
            label="Description"
            value={getValue("propertyDescription")}
            onChange={handleChange("propertyDescription")}
            disabled={isLoading}
            icon={<HomeWorkIcon fontSize="small" />}
            multiline
            rows={3}
          />

          {/* 2-column number fields */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <Field
              label="Rooms"
              value={getValue("numberOfRooms")}
              onChange={handleChange("numberOfRooms")}
              disabled={isLoading}
              icon={<BedIcon fontSize="small" />}
              type="number"
            />
            <Field
              label="Bathrooms"
              value={getValue("numberOfBathRooms")}
              onChange={handleChange("numberOfBathRooms")}
              disabled={isLoading}
              icon={<BathtubIcon fontSize="small" />}
              type="number"
            />
            <Field
              label="Attached Bathrooms"
              value={getValue("attachedBathRooms")}
              onChange={handleChange("attachedBathRooms")}
              disabled={isLoading}
              icon={<BathtubIcon fontSize="small" />}
              type="number"
            />
            <Field
              label="Cents"
              value={getValue("cent")}
              onChange={handleChange("cent")}
              disabled={isLoading}
              icon={<SquareFootIcon fontSize="small" />}
              type="number"
            />
            <Field
              label="Square Feet"
              value={getValue("squareFeet")}
              onChange={handleChange("squareFeet")}
              disabled={isLoading}
              icon={<SquareFootIcon fontSize="small" />}
              type="number"
            />
          </Box>

          <Field
            label="Price (INR)"
            value={getValue("price")}
            onChange={handleChange("price")}
            disabled={isLoading}
            icon={<PriceChangeIcon fontSize="small" />}
            type="number"
          />
        </Stack>
      </Box>

      {/* ── Footer actions (sticky) ── */}
      <Box
        sx={{
          px: { xs: 2, sm: 3 },
          py: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          display: "flex",
          gap: 1.5,
          flexShrink: 0,
        }}
      >
        <Button
          variant="outlined"
          color="error"
          fullWidth
          onClick={onClose}
          disabled={isLoading}
          sx={{ borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          fullWidth
          onClick={handleSaveAll}
          disabled={isLoading}
          startIcon={isLoading && <CircularProgress size={15} />}
          sx={{ borderRadius: 2 }}
        >
          Save Changes
        </Button>
      </Box>
    </Drawer>
  );
};

export default PropertyDetailsDrawer;
