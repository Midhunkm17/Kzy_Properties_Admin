import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Grid,
  Divider,
  Stack,
  Avatar,
  TextField,
  CircularProgress,
  Alert,
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
import PriceChangeIconchange from "@mui/icons-material/PriceChange";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addProperty } from "../services/apis/propertyApis";
import toast, { Toaster } from "react-hot-toast";

const AddProperty = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({});
  const [imageFiles, setImageFiles] = useState({});
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [apiError, setApiError] = useState(null);
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

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleImageChange = (index) => (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFiles((prev) => ({ ...prev, [`image${index + 1}`]: file }));
    }
  };

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setThumbnailFile(file);
    }
  };

  const getImagePreview = (index) => {
    const imageKey = `image${index + 1}`;
    return imageFiles[imageKey]
      ? URL.createObjectURL(imageFiles[imageKey])
      : "";
  };

  const getThumbnailPreview = () => {
    return thumbnailFile ? URL.createObjectURL(thumbnailFile) : "";
  };

  const handleAdd = async () => {
    try {
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value);
      });

      for (let i = 0; i < 6; i++) {
        const file = imageFiles[`image${i + 1}`];
        if (file) payload.append("images", file);
      }

      if (thumbnailFile) payload.append("thumbnail", thumbnailFile);

      await addMutation.mutateAsync(payload);
    } catch (err) {
      console.error("Add error:", err);
      toast.error(err.response?.data?.message || "Failed to add property");
    }
  };

  return (
    <Box sx={{ p: 3, mx: "auto" }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Add New Property
      </Typography>
      <input
        accept="image/*"
        style={{ display: "none" }}
        id="thumbnail-upload"
        type="file"
        onChange={handleThumbnailChange}
        disabled={addMutation.isPending}
      />
      <label htmlFor="thumbnail-upload">
        <Avatar
          src={getThumbnailPreview()}
          variant="rounded"
          sx={{ width: 250, height: 250, mx: "auto", mb: 2, cursor: "pointer" }}
        />
      </label>

      <TextField
        fullWidth
        label="Property Title"
        value={formData.propertyTitle || ""}
        onChange={handleChange("propertyTitle")}
        sx={{ mb: 2 }}
      />

      <Grid container spacing={2} mb={3}>
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <Grid item xs={6} sm={6} key={index}>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id={`image-upload-${index}`}
              type="file"
              onChange={handleImageChange(index)}
            />
            <label htmlFor={`image-upload-${index}`}>
              <Box sx={{ position: "relative"}}>
                <Avatar
                  src={getImagePreview(index)}
                  variant="rounded"
                  sx={{ width: 180, height: 180, border: "1px dashed #ccc" }}
                >
                  {!getImagePreview(index) && (
                    <ImageIcon sx={{ fontSize: 30, color: "#999" }} />
                  )}
                </Avatar>
              </Box>
            </label>
          </Grid>
        ))}
      </Grid>
      <TextField
        label="Description"
        multiline
        rows={5}
        sx={{ mb: 2 }}
        fullWidth
        value={formData.propertyDescription || ""}
        onChange={handleChange("propertyDescription")}
        InputProps={{ startAdornment: <HomeWorkIcon sx={{ mr: 1 }} /> }}
      />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Place"
            value={formData.place || ""}
            onChange={handleChange("place")}
            InputProps={{ startAdornment: <LocationOnIcon sx={{ mr: 1 }} /> }}
          />
        </Grid>
        <Grid item>
          {" "}
          <FormControl sx={{ width: 200 }}>
            <InputLabel id="service-type-label">
              Property Business Type
            </InputLabel>
            <Select
              labelId="service-type-label"
              value={formData.serviceProvideType || ""}
              label="Service Type"
              onChange={handleChange("serviceProvideType")}
            >
              <MenuItem value="Sale">Sale</MenuItem>
              <MenuItem value="Rent">Rent</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl fullWidth sx={{ width: 200 }}>
            <InputLabel id="property-category-label">
              Property Category
            </InputLabel>
            <Select
              labelId="property-category-label"
              value={formData.propertyCategory || ""}
              label="Service Type"
              onChange={handleChange("propertyCategory")}
            >
              <MenuItem value={"House"}>House</MenuItem>
              <MenuItem value={"Villa"}>Villa</MenuItem>
              <MenuItem value={"Apartment"}>Apartment</MenuItem>
              <MenuItem value={"Land"}>Land</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Location URL"
            value={formData.locationUrl || ""}
            onChange={handleChange("locationUrl")}
            InputProps={{ startAdornment: <LinkIcon sx={{ mr: 1 }} /> }}
          />
        </Grid>
        <Grid item xs={12}></Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Rooms"
            type="number"
            value={formData.numberOfRooms || ""}
            onChange={handleChange("numberOfRooms")}
            InputProps={{ startAdornment: <BedIcon sx={{ mr: 1 }} /> }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Bathrooms"
            type="number"
            value={formData.numberOfBathRooms || ""}
            onChange={handleChange("numberOfBathRooms")}
            InputProps={{ startAdornment: <BathtubIcon sx={{ mr: 1 }} /> }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Attached Bathrooms"
            type="number"
            value={formData.attachedBathRooms || ""}
            onChange={handleChange("attachedBathRooms")}
            InputProps={{ startAdornment: <BathtubIcon sx={{ mr: 1 }} /> }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Cents"
            type="number"
            value={formData.cent || ""}
            onChange={handleChange("cent")}
            InputProps={{ startAdornment: <SquareFootIcon sx={{ mr: 1 }} /> }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Square Feet"
            type="number"
            value={formData.squareFeet || ""}
            onChange={handleChange("squareFeet")}
            InputProps={{ startAdornment: <SquareFootIcon sx={{ mr: 1 }} /> }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Price (INR)"
            type="number"
            value={formData.price || ""}
            onChange={handleChange("price")}
            InputProps={{
              startAdornment: <PriceChangeIconchange sx={{ mr: 1 }} />,
            }}
          />
        </Grid>
      </Grid>

      <Box mt={4}>
        <Button
          fullWidth
          variant="contained"
          onClick={handleAdd}
          disabled={addMutation.isPending}
          startIcon={addMutation.isPending && <CircularProgress size={16} />}
          sx={{ mb: 2 }}
        >
          Add Property
        </Button>
      </Box>
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
    </Box>
  );
};

export default AddProperty;
