import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  Stack,
  TextField,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import LinkIcon from "@mui/icons-material/Link";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addProperty } from "../services/apis/propertyApis";
import toast, { Toaster } from "react-hot-toast";

// ── Reusable Field ──────────────────────────────────────────────────────────
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
              <Box
                sx={{
                  mr: 1,
                  display: "flex",
                  alignItems: multiline ? "flex-start" : "center",
                  mt: multiline ? 1 : 0,
                }}
              >
                {icon}
              </Box>
            ),
          }
        : undefined
    }
  />
);

const AddProperty = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({});
  const [imageFiles, setImageFiles] = useState({});
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: (data) => addProperty(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["properties"]);
      setFormData({});
      setImageFiles({});
      setThumbnailFile(null);
      toast.success("Property added successfully");
    },
  });

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

  const getImagePreview = (index) => {
    const file = imageFiles[`image${index + 1}`];
    return file ? URL.createObjectURL(file) : "";
  };
  const getThumbnailPreview = () =>
    thumbnailFile ? URL.createObjectURL(thumbnailFile) : "";

  const handleAdd = async () => {
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([k, v]) => payload.append(k, v));
      for (let i = 0; i < 6; i++) {
        const file = imageFiles[`image${i + 1}`];
        if (file) payload.append("images", file);
      }
      if (thumbnailFile) payload.append("thumbnail", thumbnailFile);
      await addMutation.mutateAsync(payload);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add property");
    }
  };

  const isPending = addMutation.isPending;

  return (
    <Box sx={{ width: "100%", boxSizing: "border-box" }}>
      <Typography variant="h5" fontWeight={700} mb={1}>
        Add New Property
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* ── Thumbnail ── */}
      <input
        accept="image/*"
        style={{ display: "none" }}
        id="thumbnail-upload"
        type="file"
        onChange={handleThumbnailChange}
        disabled={isPending}
      />
      <label
        htmlFor="thumbnail-upload"
        style={{
          display: "block",
          cursor: isPending ? "not-allowed" : "pointer",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: { xs: 200, sm: 260 },
            borderRadius: 2,
            border: "2px dashed #ccc",
            overflow: "hidden",
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#f9f9f9",
            backgroundImage: getThumbnailPreview()
              ? `url(${getThumbnailPreview()})`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: "border-color 0.2s",
            "&:hover": { borderColor: "primary.main" },
          }}
        >
          {!getThumbnailPreview() && (
            <Stack alignItems="center" spacing={1}>
              <ImageIcon sx={{ fontSize: 40, color: "#bbb" }} />
              <Typography fontSize={13} color="text.secondary">
                Click to upload thumbnail
              </Typography>
            </Stack>
          )}
        </Box>
      </label>

      {/* ── Title ── */}
      <Field
        label="Property Title"
        value={formData.propertyTitle || ""}
        onChange={handleChange("propertyTitle")}
        disabled={isPending}
      />

      <Divider sx={{ my: 2 }} />

      {/* ── 6 Image Slots — CSS Grid ── */}
      <Typography variant="subtitle1" fontWeight={600} mb={1.5}>
        Property Images
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(3, 1fr)",
            sm: "repeat(6, 1fr)",
          },
          gap: 1.5,
          mb: 3,
        }}
      >
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <Box key={index}>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id={`image-upload-${index}`}
              type="file"
              onChange={handleImageChange(index)}
              disabled={isPending}
            />
            <label
              htmlFor={`image-upload-${index}`}
              style={{
                display: "block",
                cursor: isPending ? "not-allowed" : "pointer",
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
                    bgcolor: "#f5f5f5",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundImage: getImagePreview(index)
                      ? `url(${getImagePreview(index)})`
                      : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    transition: "border-color 0.2s",
                    "&:hover": { borderColor: "primary.main" },
                  }}
                >
                  {!getImagePreview(index) && (
                    <Stack alignItems="center" spacing={0.5}>
                      <ImageIcon sx={{ fontSize: 22, color: "#bbb" }} />
                      <Typography fontSize={10} color="text.secondary">
                        {index + 1}
                      </Typography>
                    </Stack>
                  )}
                </Box>
              </Box>
            </label>
          </Box>
        ))}
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* ── All Fields ── */}
      <Stack spacing={2}>
        <Field
          label="Description"
          value={formData.propertyDescription || ""}
          onChange={handleChange("propertyDescription")}
          disabled={isPending}
          icon={<HomeWorkIcon fontSize="small" />}
          multiline
          rows={4}
        />

        <Field
          label="Place"
          value={formData.place || ""}
          onChange={handleChange("place")}
          disabled={isPending}
          icon={<LocationOnIcon fontSize="small" />}
        />

        {/* Business Type + Category — side by side */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          <FormControl fullWidth disabled={isPending}>
            <InputLabel>Property Business Type</InputLabel>
            <Select
              value={formData.serviceProvideType || ""}
              label="Property Business Type"
              onChange={handleChange("serviceProvideType")}
            >
              <MenuItem value="Sale">Sale</MenuItem>
              <MenuItem value="Rent">Rent</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth disabled={isPending}>
            <InputLabel>Property Category</InputLabel>
            <Select
              value={formData.propertyCategory || ""}
              label="Property Category"
              onChange={handleChange("propertyCategory")}
            >
              <MenuItem value="House">House</MenuItem>
              <MenuItem value="Villa">Villa</MenuItem>
              <MenuItem value="Apartment">Apartment</MenuItem>
              <MenuItem value="Land">Land</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Field
          label="Location URL"
          value={formData.locationUrl || ""}
          onChange={handleChange("locationUrl")}
          disabled={isPending}
          icon={<LinkIcon fontSize="small" />}
        />

        {/* Number fields — 2 column grid */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <Field
            label="Rooms"
            value={formData.numberOfRooms || ""}
            onChange={handleChange("numberOfRooms")}
            disabled={isPending}
            icon={<BedIcon fontSize="small" />}
            type="number"
          />
          <Field
            label="Bathrooms"
            value={formData.numberOfBathRooms || ""}
            onChange={handleChange("numberOfBathRooms")}
            disabled={isPending}
            icon={<BathtubIcon fontSize="small" />}
            type="number"
          />
          <Field
            label="Attached Bathrooms"
            value={formData.attachedBathRooms || ""}
            onChange={handleChange("attachedBathRooms")}
            disabled={isPending}
            icon={<BathtubIcon fontSize="small" />}
            type="number"
          />
          <Field
            label="Cents"
            value={formData.cent || ""}
            onChange={handleChange("cent")}
            disabled={isPending}
            icon={<SquareFootIcon fontSize="small" />}
            type="number"
          />
          <Field
            label="Square Feet"
            value={formData.squareFeet || ""}
            onChange={handleChange("squareFeet")}
            disabled={isPending}
            icon={<SquareFootIcon fontSize="small" />}
            type="number"
          />
        </Box>

        <Field
          label="Price (INR)"
          value={formData.price || ""}
          onChange={handleChange("price")}
          disabled={isPending}
          icon={<PriceChangeIcon fontSize="small" />}
          type="number"
        />
      </Stack>

      {/* ── Submit ── */}
      <Box mt={3} mb={2}>
        <Button
          fullWidth
          variant="contained"
          onClick={handleAdd}
          disabled={isPending}
          startIcon={isPending && <CircularProgress size={16} />}
          sx={{ py: 1.4, borderRadius: 2, fontWeight: 600, fontSize: 15 }}
        >
          {isPending ? "Adding Property…" : "Add Property"}
        </Button>
      </Box>

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: "12px",
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          },
        }}
      />
    </Box>
  );
};

export default AddProperty;
