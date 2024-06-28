import React, { useState } from "react";
import axios from "axios";
import { Link as RouterLink } from "react-router-dom";
import { Avatar, Button, CssBaseline, TextField, Paper, Box, Grid, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThreeDots } from 'react-loader-spinner';
import img from "../assets/Images/patrick-fore-iOiaqY7eZsY-unsplash.jpg";

const theme = createTheme();

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpSent, setOTPSent] = useState(false);
  const [otp, setOTP] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/api/v1/login", { user: { email, password } });
      if (response?.status === 200) {
        setOTPSent(true);
        toast.info(`Email sent to ${email}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/api/v1/verify_otp_and_login", {
        user: { email, otp },
        client_id: "JxG3hdqSMfJLXBzg4Y0qoOgOV53QBAclGVytNeYBos4",
      });
      if (response?.status === 200) {
        const role = 'admin';
        localStorage.setItem('user_role', role);
        localStorage.setItem("access_token", response.data.user.access_token);
        localStorage.setItem("user", response.data.user.id);
        toast.success("Email verified successfully!");
        window.location.href = "/";
      }
    } catch (error) {
      toast.error("An error occurred while verifying OTP. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer />
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} sx={{
          backgroundImage: `url(${img})`,
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) => t.palette.mode === "light" ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box sx={{ my: 8, mx: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">Sign in</Typography>
            <Box component="form" noValidate onSubmit={otpSent ? handleOTPSubmit : handleLoginSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id={otpSent ? "otp" : "email"}
                label={otpSent ? "OTP" : "Email Address"}
                name={otpSent ? "otp" : "email"}
                autoComplete={otpSent ? "off" : "email"}
                autoFocus
                value={otpSent ? otp : email}
                onChange={(e) => otpSent ? setOTP(e.target.value) : setEmail(e.target.value)}
              />
              {!otpSent && (
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
              )}
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
                {loading ? <ThreeDots visible={true} height="30" width="30" color="#fff" /> : (otpSent ? "Verify OTP" : "Sign In")}
              </Button>
              {!otpSent && (
                <Grid container>
                  <Grid item xs>
                    <RouterLink to="/forgot-password">Forgot password?</RouterLink>
                  </Grid>
                  <Grid item>
                    <RouterLink to="/signup">{"Don't have an account? Sign Up"}</RouterLink>
                  </Grid>
                </Grid>
              )}
              <RouterLink to="/" style={{ marginTop: "10px", display: "flex", justifyContent: "center" }}>{"Admin Customer Option"}</RouterLink>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default Login;
