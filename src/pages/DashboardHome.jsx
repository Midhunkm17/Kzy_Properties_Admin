import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, House } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Typography,
  useTheme,
} from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import { getProperties } from "../services/apis/propertyApis";

const DashboardHome = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["properties"],
    queryFn: getProperties,
  });
  console.log(data);

  if (isLoading) {
    return <CircularProgress />;
  }
  if (isError) {
    toast.error("Something went wrong!");
  }

  return (
    <>
      <Typography fontSize={25} fontWeight={600}>
        Dashboard
      </Typography>
      <Divider />
      <Box width={400} mt={4}>
        <Card
          sx={{
            width: "100%",
            borderRadius: "16px",
            overflow: "hidden",
            position: "relative",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
            background: "linear-gradient(135deg, #4776E6 0%, #8E54E9 100%)",
            border: "none",
            height: "180px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Background decoration */}
          {/* <Box
          sx={{
            position: "absolute",
            top: "-20px",
            right: "-20px",
            borderRadius: "50%",
            width: "120px",
            height: "120px",
            background: "rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 0,
          }}
        >
          <House size={50} style={{ opacity: 1 ,color:"rgb(255, 255, 255)"}} />
        </Box> */}

          <CardContent sx={{ position: "relative", zIndex: 1, pt: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1,
                gap: 1,
              }}
            >
              <Box
                sx={{
                  backgroundColor: "rgb(255, 255, 255)",
                  borderRadius: "10px",
                  padding: "10px",
                  display: "flex",
                }}
              >
                <House size={20} />
              </Box>
              <Typography
                color="rgb(255, 255, 255)"
                fontSize={20}
                fontWeight={500}
              >
                Properties Listed
              </Typography>
            </Box>

            <Box textAlign={"center"}>
              <Typography
                color="white"
                fontWeight="bold"
                fontSize={35}
                sx={{ lineHeight: 1 }}
              >
                {data?.count || 0}
              </Typography>
            </Box>
          </CardContent>

          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
            <Button
              onClick={() => navigate("/properties")}
              variant="solid"
              size="sm"
              endDecorator={<ArrowRight />}
              sx={{
                color: "rgb(255, 255, 255)",
                borderRadius: "10px",
                backgroundColor: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                transition: "all 0.2s",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.25)",
                  transform: "translateX(3px)",
                },
              }}
            >
              View Details
            </Button>
          </Box>
        </Card>
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
    </>
  );
};

export default DashboardHome;
