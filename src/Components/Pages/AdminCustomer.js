import React from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link } from 'react-router-dom'; // Assuming you're using React Router

function AdminCustomer() {
  return (
    <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
      <Grid item xs={12} sm={6} md={4}>
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid item>
            <Typography variant="h4" align="center" gutterBottom>
              Welcome
            </Typography>
            <Typography variant="subtitle1" align="center" gutterBottom>
              Please select your login option
            </Typography>
          </Grid>
          <Grid item>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
            >
              <LockOutlinedIcon style={{ marginRight: 8 }} />
              Admin Login
            </Button>
          </Grid>
          <Grid item>
            <Button
              component={Link}
              to="/customer_login"
              variant="contained"
              color="secondary"
              fullWidth
              size="large"
            >
              <LockOutlinedIcon style={{ marginRight: 8 }} />
              Customer Login
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default AdminCustomer;
