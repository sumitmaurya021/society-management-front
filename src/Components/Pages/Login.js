import React, { useState } from                       "react"                                ;
import axios from                                     "axios"                                ;
import { Link, Navigate, Link as RouterLink, useNavigate } from "react-router-dom"                     ;
import Avatar from                                    "@mui/material/Avatar"                 ;
import Button from                                    "@mui/material/Button"                 ;
import CssBaseline from                               "@mui/material/CssBaseline"            ;
import TextField from                                 "@mui/material/TextField"              ;
import Paper from                                     "@mui/material/Paper"                  ;
import Box from                                       "@mui/material/Box"                    ;
import Grid from                                      "@mui/material/Grid"                   ;
import LockOutlinedIcon from                          "@mui/icons-material/LockOutlined"     ;
import Typography from                                "@mui/material/Typography"             ;
import { createTheme, ThemeProvider } from            "@mui/material/styles"                 ;
import { ToastContainer, toast } from                 "react-toastify"                       ;
import                                                "react-toastify/dist/ReactToastify.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [otpSent, setOTPSent] = useState(false);
  const [otp, setOTP] = useState("");


  const handleSubmit = async (e) => {

    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/v1/login", {
        user: {
          email,
          password,
        },
      });
      if (response && response.data && response.status === 200) {
        setOTPSent(true);
        toast.info(`Email sent to ${email}`);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "An error occurred");
      toast.error(errorMessage);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/verify_otp_and_login",
        {
          user: {
            email,
            otp,
          },
          client_id: "SPUH4U-v80y2GYQcXUOOlIUyFjSiYFhtNj9tecp3Ots",
        }
      );
      if (response && response.data && response.status === 200) {
        const role = 'admin';
        localStorage.setItem('user_role', role);
        localStorage.setItem("access_token", response.data.user.access_token);
        localStorage.setItem("user", response.data.user.id);
        toast.success("Email verified successfully!");
        window.location.href = '/';
      }
    } catch (error) {
      console.error("Error while verifying OTP:", error);
      toast.error(
        "An error occurred while verifying OTP. Please try again later."
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
              "url(https://source.unsplash.com/random?blue sky)",
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
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={otpSent ? handleOTPSubmit : handleSubmit}
              sx={{ mt: 1 }}
            >
              {!otpSent ? (
                <>
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
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign In
                  </Button>
                  <Grid container>
                    <Grid item xs>
                      <Link
                        component={RouterLink}
                        to="/forgot-password"
                        variant="body2"
                      >
                        Forgot password?
                      </Link>
                    </Grid>
                    <Grid item>
                      <Link component={RouterLink} to="/signup" variant="body2">
                        {"Don't have an account? Sign Up"}
                      </Link>
                    </Grid>
                  </Grid>
                  <Link to="/admin_customer_option" variant="body2" style={{ marginTop: "10px", display: "flex", justifyContent: "center" }}>
                    {"Admin Customer Option"}
                  </Link>
                </>
              ) : (
                <Box>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="otp"
                    label="OTP"
                    name="otp"
                    type="text"
                    autoComplete="off"
                    value={otp}
                    onChange={(e) => setOTP(e.target.value)}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Verify OTP
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
    </>
  );
}

export default Login;
