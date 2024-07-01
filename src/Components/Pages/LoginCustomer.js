import React, { useState } from "react";
import axios from "axios";
import { Link as RouterLink } from "react-router-dom";
import { Avatar, Button, CssBaseline, TextField, Paper, Box, Grid, Typography, Link } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import img from "../assets/Images/patrick-fore-iOiaqY7eZsY-unsplash.jpg";

const theme = createTheme();

const LoginCustomer = () => {
  const [blockName, setBlockName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/login_by_customer",
        {
          user: {
            block_name: blockName,
            room_number: roomNumber,
            password,
          },
          client_id: "whkBTp_UAjOR29cRg2AWxarqOC4IniwQlOo4iuDVN_0",
        }
      );

      if (response?.status === 200) {
        const user = response.data.user;
        localStorage.setItem("user_role", "customer");
        localStorage.setItem("access_token", user.access_token);
        localStorage.setItem("block_name", user.block_name);
        localStorage.setItem("room_number", user.room_number);
        localStorage.setItem("floor_number", user.floor_number);
        localStorage.setItem("block_id", user.block_id);
        localStorage.setItem("floor_id", user.floor_id);
        localStorage.setItem("room_id", user.room_id);
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Login successful");
        window.location.href = "/WaterBillsPay";
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer />
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${img})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light" ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="block_name"
                label="Block Name"
                name="block_name"
                autoComplete="block_name"
                autoFocus
                value={blockName}
                onChange={(e) => setBlockName(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="room_number"
                label="Room Number"
                name="room_number"
                type="number"
                autoComplete="room_number"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
              <Grid container>
                <Grid item xs>
                  <RouterLink to="/forgot-password">Forgot password?</RouterLink>
                </Grid>
                <Grid item>
                  <RouterLink to="/customer_signup">{"Don't have an account? Sign Up"}</RouterLink>
                </Grid>
              </Grid>
              <RouterLink
                to="/"
                style={{ marginTop: "10px", display: "flex", justifyContent: "center" }}
              >
                {"Admin Customer Option"}
              </RouterLink>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default LoginCustomer;
