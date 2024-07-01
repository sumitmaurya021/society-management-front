import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link } from 'react-router-dom';
import ParticlesComponent from '../particles';
import './AdminCustomer.css';


function AdminCustomer() {

  return (
    <>
    <ParticlesComponent className="particles"/>
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{
        height: '100vh',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <Grid item xs={12} sm={6} md={4} style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '20px', borderRadius: '10px' }}>
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid item>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              style={{ display: 'flex', alignItems: 'center' }}
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
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <LockOutlinedIcon style={{ marginRight: 8 }} />
              Customer Login
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
    </>
  );
}

export default AdminCustomer;
