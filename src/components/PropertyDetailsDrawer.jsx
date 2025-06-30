import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  Button,
  Chip,
  Grid,
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
    onError: (error) => setApiError(error.message),
  });

  const imagesMutation = useMutation({
    mutationFn: ({ id, imageFiles, thumbnailFile }) => {
      const mergedImages = [];

      for (let i = 0; i < 6; i++) {
        const key = `image${i + 1}`;
        if (imageFiles[key]) {
          mergedImages.push(imageFiles[key]); // new file
        } else if (property.images?.[i]) {
          mergedImages.push(property.images[i]); // existing URL
        }
      }
      return updatePropertyImages(
        id,
        mergedImages,
        thumbnailFile ?? property.thumbnail
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["properties"]);
      setApiError(null);
      setImageFiles({});
      setThumbnailFile(null);
    },
    onError: (error) => {
      setApiError(error.message);
    },
  });

  // Clear form data when drawer closes - moved before early return
  React.useEffect(() => {
    if (!open) {
      setFormData({});
      setImageFiles({});
      setThumbnailFile(null);
      setApiError(null);
    }
  }, [open]);

  if (!property) return null;

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleImageChange = (index) => (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log(`Setting image for index ${index + 1}:`, file.name); // Debug log
      setImageFiles((prev) => ({ ...prev, [`image${index + 1}`]: file }));
    }
  };

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setThumbnailFile(file);
    }
  };

  const toggleSoldStatus = () => {
    setFormData((prev) => ({ ...prev, isActive: !getValue("isActive") }));
  };

  const getValue = (field) => formData[field] ?? property[field];

  const getImagePreview = (index) => {
    const imageKey = `image${index + 1}`;
    if (imageFiles[imageKey]) {
      return URL.createObjectURL(imageFiles[imageKey]);
    }
    return property.images?.[index] || "";
  };

  const getThumbnailPreview = () => {
    if (thumbnailFile) {
      return URL.createObjectURL(thumbnailFile);
    }
    return property.thumbnail || "";
  };

  const handleSaveAll = async () => {
    try {
      console.log("Saving images:", imageFiles); // Debug log

      if (Object.keys(formData).length > 0) {
        await propertyMutation.mutateAsync({
          id: property?._id,
          data: formData,
        });
      }
      if (Object.keys(imageFiles).length > 0 || thumbnailFile) {
        await imagesMutation.mutateAsync({
          id: property._id,
          imageFiles,
          thumbnailFile,
        });
      }
      toast.success("Property updated successfully");
      onClose();
    } catch (error) {
      console.error("Error saving:", error);
      toast.error(error.message);
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
          width: { xs: "100%", sm: "500px" },
          padding: 3,
          backgroundImage:
            "linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(255,255,255,0.95))",
        },
      }}
    >
      <Box sx={{ height: "100%", overflowY: "auto" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" fontWeight={600}>
            Edit Property
          </Typography>
          <IconButton onClick={onClose} size="small" disabled={isLoading}>
            <CloseIcon />
          </IconButton>
        </Box>

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
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mb={2}
          >
            <CircularProgress size={20} />
            <Typography variant="body2" sx={{ ml: 1 }}>
              Updating...
            </Typography>
          </Box>
        )}

        <Button
          fullWidth
          variant={isPropertySold ? "contained" : "outlined"}
          color={isPropertySold ? "error" : "success"}
          startIcon={isPropertySold ? <SellIcon /> : <CheckCircleIcon />}
          onClick={toggleSoldStatus}
          disabled={isLoading}
          sx={{ mb: 2 }}
        >
          {isPropertySold ? "Mark as Available" : "Mark as Sold"}
        </Button>

        <Divider sx={{ my: 2 }} />

        <Box textAlign="center" mb={3}>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="thumbnail-upload"
            type="file"
            onChange={handleThumbnailChange}
            disabled={isLoading}
          />
          <label htmlFor="thumbnail-upload">
            <Avatar
              src={getThumbnailPreview()}
              variant="rounded"
              sx={{
                width: 200,
                height: 150,
                mx: "auto",
                mb: 2,
                cursor: isLoading ? "not-allowed" : "pointer",
                "&:hover": { opacity: 0.8 },
              }}
            />
          </label>

          <TextField
            fullWidth
            label="Property Title"
            value={getValue("propertyTitle")}
            onChange={handleChange("propertyTitle")}
            disabled={isLoading}
          />
          <Stack direction="row" spacing={1} justifyContent="center" mt={2}>
            <Chip label={property.propertyCategory} color="primary" />
            <Chip
              label={property.serviceProvideType}
              color="secondary"
              variant="outlined"
            />
            {isPropertySold && <Chip label="SOLD" color="error" />}
          </Stack>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" fontWeight={600} mb={2}>
          Property Images
        </Typography>
        <Grid container spacing={2} mb={3}>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <Grid item xs={6} key={index}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id={`image-upload-${index}`}
                type="file"
                onChange={handleImageChange(index)}
                disabled={isLoading}
              />
              <label htmlFor={`image-upload-${index}`}>
                <Box sx={{ position: "relative", width: 150 }}>
                  <Avatar
                    src={getImagePreview(index)}
                    variant="rounded"
                    sx={{
                      width: "100%",
                      height: 100,
                      cursor: isLoading ? "not-allowed" : "pointer",
                      backgroundColor: getImagePreview(index)
                        ? "transparent"
                        : "#f5f5f5",
                      border: "2px dashed #ddd",
                      "&:hover": { borderColor: "#1976d2" },
                    }}
                  >
                    {!getImagePreview(index) && (
                      <ImageIcon sx={{ fontSize: 30, color: "#999" }} />
                    )}
                  </Avatar>
                  {/* Debug: Show index number */}
                  <Typography
                    variant="caption"
                    sx={{
                      position: "absolute",
                      bottom: 2,
                      right: 2,
                      backgroundColor: "rgba(0,0,0,0.7)",
                      color: "white",
                      padding: "2px 4px",
                      borderRadius: "4px",
                      fontSize: "10px",
                    }}
                  >
                    {index + 1}
                  </Typography>
                </Box>
              </label>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Place"
              value={getValue("place")}
              onChange={handleChange("place")}
              disabled={isLoading}
              InputProps={{ startAdornment: <LocationOnIcon sx={{ mr: 1 }} /> }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Location URL"
              value={getValue("locationUrl")}
              onChange={handleChange("locationUrl")}
              disabled={isLoading}
              InputProps={{ startAdornment: <LinkIcon sx={{ mr: 1 }} /> }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={getValue("propertyDescription")}
              onChange={handleChange("propertyDescription")}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <HomeWorkIcon sx={{ mr: 1, alignSelf: "flex-start" }} />
                ),
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Rooms"
              type="number"
              value={getValue("numberOfRooms")}
              onChange={handleChange("numberOfRooms")}
              disabled={isLoading}
              InputProps={{ startAdornment: <BedIcon sx={{ mr: 1 }} /> }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Bathrooms"
              type="number"
              value={getValue("numberOfBathRooms")}
              onChange={handleChange("numberOfBathRooms")}
              disabled={isLoading}
              InputProps={{ startAdornment: <BathtubIcon sx={{ mr: 1 }} /> }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Attached Bathrooms"
              type="number"
              value={getValue("attachedBathRooms")}
              onChange={handleChange("attachedBathRooms")}
              disabled={isLoading}
              InputProps={{ startAdornment: <BathtubIcon sx={{ mr: 1 }} /> }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Cents"
              type="number"
              value={getValue("cent")}
              onChange={handleChange("cent")}
              disabled={isLoading}
              InputProps={{ startAdornment: <SquareFootIcon sx={{ mr: 1 }} /> }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Square Feet"
              type="number"
              value={getValue("squareFeet")}
              onChange={handleChange("squareFeet")}
              disabled={isLoading}
              InputProps={{ startAdornment: <SquareFootIcon sx={{ mr: 1 }} /> }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Price (INR)"
              type="number"
              value={getValue("price")}
              onChange={handleChange("price")}
              disabled={isLoading}
              InputProps={{
                startAdornment: <PriceChangeIcon sx={{ mr: 1 }} />,
              }}
            />
          </Grid>
        </Grid>

        <Box mt={4}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleSaveAll}
            disabled={isLoading}
            startIcon={isLoading && <CircularProgress size={16} />}
            sx={{ mb: 2 }}
          >
            Save All Changes
          </Button>
          <Button
            sx={{ mb: 5 }}
            fullWidth
            color="error"
            variant="outlined"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default PropertyDetailsDrawer;
