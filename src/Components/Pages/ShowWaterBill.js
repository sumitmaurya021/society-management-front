import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { toast, ToastContainer } from 'react-toastify';

function ShowWaterBill() {
  const [waterBills, setWaterBills] = useState([]);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        // Retrieve access token from local storage
        const accessToken = localStorage.getItem('access_token');

        if (!accessToken) {
          console.error('Access token not found in local storage');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        };

        const response = await axios.get('http://localhost:3000/api/v1/buildings/1/water_bills', config);
        setWaterBills(response.data);
      } catch (error) {
        console.error('Error fetching water bills:', error);
        toast.error('Error fetching water bills');
      }
    };

    fetchBills();
  }, []);

  // Define columns for MaterialReactTable
  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
      size: 200,
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      size: 150,
    },
    {
      accessorKey: 'start_date',
      header: 'Start Date',
      size: 150,
    },
    {
      accessorKey: 'end_date',
      header: 'End Date',
      size: 150,
    },
    {
      accessorKey: 'remarks',
      header: 'Remarks',
      size: 300,
    },
  ];

  // Create MaterialReactTable instance
  const table = useMaterialReactTable({
    columns,
    data: waterBills,
  });

  return (
    <div>
      <ToastContainer />
      <Container>
        <h2 className=' mb-3'>Water Bills</h2>
        <MaterialReactTable table={table} />
      </Container>
    </div>
  );
}

export default ShowWaterBill;
