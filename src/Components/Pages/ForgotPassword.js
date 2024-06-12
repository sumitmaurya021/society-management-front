import React, { useState } from                 "react"                                ;
import axios from                               "axios"                                ;
import { Link as RouterLink, useNavigate } from "react-router-dom"                     ;
import Button from                              "@mui/material/Button"                 ;
import CssBaseline from                         "@mui/material/CssBaseline"            ;
import TextField from                           "@mui/material/TextField"              ;
import Paper from                               "@mui/material/Paper"                  ;
import Box from                                 "@mui/material/Box"                    ;
import Grid from                                "@mui/material/Grid"                   ;
import LockOutlinedIcon from                    "@mui/icons-material/LockOutlined"     ;
import Typography from                          "@mui/material/Typography"             ;
import { createTheme, ThemeProvider } from      "@mui/material/styles"                 ;
import { toast, ToastContainer } from           "react-toastify"                       ;
import                                          "react-toastify/dist/ReactToastify.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false); // Track if OTP is sent
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/forgot_password",
        {
          email,
        }
      );
      if (response && response.status === 200) {
        toast.info(`Email sent to ${email} with OTP for password reset.`);
        setOtpSent(true); // Set OTP sent state to true
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error(
        "An error occurred while sending email. Please try again later."
      );
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/reset_password",
        {
          email,
          otp,
          password: newPassword, // Send the password as 'password'
        }
      );
      if (response && response.status === 200) {
        toast.success("Password reset successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 3000); // Redirect to login page after 3 seconds
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error(
        "An error occurred while resetting password. Please try again later."
      );
    }
  };

  return (
    <>
    <ToastContainer />
    <ThemeProvider theme={createTheme()}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://source.unsplash.com/random?wallpapers)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
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
            <LockOutlinedIcon sx={{ mt: 1, mb: 2 }} />
            <Typography component="h1" variant="h5">
              {otpSent ? "Reset Password" : "Forgot Password"}
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={otpSent ? handleResetPassword : handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {otpSent && (
                <>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="otp"
                    label="OTP"
                    name="otp"
                    autoComplete="off"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="newPassword"
                    label="New Password"
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {otpSent ? "Reset Password" : "Send OTP"}
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <RouterLink to="/login" variant="body2">
                    Return to login
                  </RouterLink>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
    </>
  );
}

export default ForgotPassword;
