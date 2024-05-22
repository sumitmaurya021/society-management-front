import React, { useState } from            "react"                                ;
import axios from                          "axios"                                ;
import { Link as RouterLink } from         "react-router-dom"                     ;
import Avatar from                         "@mui/material/Avatar"                 ;
import Button from                         "@mui/material/Button"                 ;
import CssBaseline from                    "@mui/material/CssBaseline"            ;
import TextField from                      "@mui/material/TextField"              ;
import Link from                           "@mui/material/Link"                   ;
import Grid from                           "@mui/material/Grid"                   ;
import Box from                            "@mui/material/Box"                    ;
import LockOutlinedIcon from               "@mui/icons-material/LockOutlined"     ;
import Typography from                     "@mui/material/Typography"             ;
import Container from                      "@mui/material/Container"              ;
import { createTheme, ThemeProvider } from "@mui/material/styles"                 ;
import { toast, ToastContainer } from      "react-toastify"                       ;
import                                     "react-toastify/dist/ReactToastify.css";

function SignUpCustomer() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        mobile_number: "",
        room_id: "",
        block_id: "", 
        floor_id: "",
        room_number: "",
        owner_or_renter: "",
        gender: "",
    })

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:3000/api/v1/users", {
                user: formData,
                client_id: "JV03tEaWKO3DIsc2DfjPuKD9OKvmNZVw4yMoJlReMGA",
            });
            console.log("User signed up successfully:", response.data);
            toast.success("Sign up successful");
        } catch (error) {
            console.error("Error signing up:", error);
            // Show error message to user
        }
    }


  return (
    <>
      <ThemeProvider theme={createTheme()}>
        <Container component="mai1n" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="name"
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    autoFocus
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="mobile_number"
                    label="Mobile Number"
                    type="number"
                    id="mobile_number"
                    autoComplete="mobile_number"
                    value={formData.mobile_number}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="room_id"
                    label="Room ID"
                    type="number"
                    id="room_id"
                    autoComplete="room_id"
                    value={formData.room_id}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="block_id"
                    label="Block ID"
                    type="number"
                    id="block_id"
                    autoComplete="block_id"
                    value={formData.block_id}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="floor_id"
                    label="Floor ID"
                    type="number"
                    id="floor_id"
                    autoComplete="floor_id"
                    value={formData.floor_id}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="room_number"
                    label="Room Number"
                    type="number"
                    id="room_number"
                    autoComplete="room_number"
                    value={formData.room_number}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="owner_or_renter"
                    label="Owner or Renter"
                    type="text"
                    id="owner_or_renter"
                    autoComplete="owner_or_renter"
                    value={formData.owner_or_renter}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="gender"
                    label="Gender"
                    type="text"
                    id="gender"
                    autoComplete="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link component={RouterLink} to="/login" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
        <ToastContainer />
      </ThemeProvider>
                
    </>
  )
}

export default SignUpCustomer
