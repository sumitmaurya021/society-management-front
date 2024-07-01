import React, { useState } from "react";
import axios from "axios";
import { Link as RouterLink } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SignUpCustomer.css";

const theme = createTheme();

function SignUpCustomer() {
  const [userType, setUserType] = useState("residential");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile_number: "",
    room_number: "",
    block_name: "",
    floor_number: "",
    owner_or_renter: "",
    gender: "",
    shop_number: "",
  });

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
    setFormData({
      ...formData,
      room_number: "",
      owner_or_renter: "",
      shop_number: "",
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const user = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        mobile_number: formData.mobile_number,
        block_name: formData.block_name,
        floor_number: formData.floor_number,
        gender: formData.gender,
        role: userType === "shop" ? "shop" : undefined,
        room_number: userType === "residential" ? formData.room_number : undefined,
        owner_or_renter: userType === "residential" ? formData.owner_or_renter : undefined,
        shop_number: userType === "shop" ? formData.shop_number : undefined,
      };

      const response = await axios.post("http://localhost:3000/api/v1/users", {
        user,
        client_id: "whkBTp_UAjOR29cRg2AWxarqOC4IniwQlOo4iuDVN_0",
      });

      if (response.status === 200) {
        console.log("User signed up successfully:", response.data);
        toast.success("Sign up successful");
        window.location.href = "/customer_login";
      } else {
        console.error("Error signing up:", response.data);
        toast.error("Sign up failed. Please try again.");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error("Sign up failed. Please try again.");
    }
  };

  return (
    <>
      <ToastContainer />
      <ThemeProvider theme={theme}>
        <Container maxWidth="md" className="fade-in">
          <CssBaseline />
          <Box
            sx={{
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
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    name="userType"
                    label="I am signing up for"
                    value={userType}
                    onChange={handleUserTypeChange}
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value="residential">Residential</option>
                    <option value="shop">Shop</option>
                  </TextField>
                </Grid>
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
                <Grid item xs={12} sm={6}>
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
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="mobile_number"
                    label="Mobile Number"
                    type="text"
                    id="mobile_number"
                    autoComplete="mobile_number"
                    value={formData.mobile_number}
                    onChange={handleChange}
                  />
                </Grid>
                {userType === "shop" && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        name="shop_number"
                        label="Shop Number"
                        type="text"
                        id="shop_number"
                        autoComplete="shop_number"
                        value={formData.shop_number}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        name="block_name"
                        label="Block Name"
                        type="text"
                        id="block_name"
                        autoComplete="block_name"
                        value={formData.block_name}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        name="floor_number"
                        label="Floor Number"
                        type="text"
                        id="floor_number"
                        autoComplete="floor_number"
                        value={formData.floor_number}
                        onChange={handleChange}
                      />
                    </Grid>
                  </>
                )}
                {userType === "residential" && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        name="block_name"
                        label="Block Name"
                        type="text"
                        id="block_name"
                        autoComplete="block_name"
                        value={formData.block_name}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        name="floor_number"
                        label="Floor Number"
                        type="text"
                        id="floor_number"
                        autoComplete="floor_number"
                        value={formData.floor_number}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        name="room_number"
                        label="Room Number"
                        type="text"
                        id="room_number"
                        autoComplete="room_number"
                        value={formData.room_number}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
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
                  </>
                )}
                <Grid item xs={12} sm={6}>
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
              <div className="d-flex mt-3 justify-content-between">
                <button type="submit" className="btn btn-sm btn-primary">Sign Up</button>
                <Link component={RouterLink} to="/customer_login" className="btn btn-sm btn-primary text-white">Already have an account? Sign in</Link>
              </div>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}

export default SignUpCustomer;


