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
import { toast, ToastContainer } from                 "react-toastify"                       ;
import                                                "react-toastify/dist/ReactToastify.css";

function LoginCustomer() {
  const [errorMessage, setErrorMessage] = useState("");
  const [block_name, setBlockName] = useState("");
  const [room_number, setRoomNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try{
      const response = await axios.post("http://localhost:3000/api/v1/login_by_customer", {
        user: {
          block_name,
          room_number,
          password,
        },
        client_id: "huAjw3Fq_4qlXRUYWTciYsp9FmbT12OJny5db9bOme8",
      })

      if (response && response.data && response.status === 200) {
        const user = response.data.user;
        localStorage.setItem("user_role", "customer");
        localStorage.setItem("access_token", user.access_token);
        localStorage.setItem("block_name", user.block_name); // Changed from block_id to block
        localStorage.setItem("room_number", user.room_number);
        localStorage.setItem("floor_number", user.floor_number); // Changed from floor to floor_number
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Login successful");
        window.location.href = "/WaterBillsPay";
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "An error occurred");
      toast.error(errorMessage);
    }
  }

  return (
    <div>
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
              backgroundImage: "url(https://source.unsplash.com/random)",
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
                onSubmit={handleSubmit}
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="block_name"
                  label="Block Name"
                  name="block_name"
                  autoComplete="block_name"
                  autoFocus
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
                  autoFocus
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
                    <Link href="#" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link component={RouterLink} to="/customer_signup" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
                <Link to="/admin_customer_option" variant="body2" style={{ marginTop: "10px", display: "flex", justifyContent: "center" }}>
                    {"Admin Customer Option"}
                  </Link>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
      
    </div>
  )
}

export default LoginCustomer
