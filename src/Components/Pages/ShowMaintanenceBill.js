import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { MaterialReactTable, useMaterialReactTable,} from 'material-react-table';

function ShowMaintenanceBill() {
  const [bills, setBills] = useState([]);
  
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

        const response = await axios.get('http://localhost:3000/api/v1/buildings/1/maintenance_bills', config);

        setBills(response.data);
      } catch (error) {
        console.error('Error fetching maintenance bills:', error);
      }
    };
    fetchBills();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'your_name',
        header: 'Your Name',
        size: 200,
      },
      {
        accessorKey: 'name',
        header: 'Name',
        size: 150,
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
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: bills,
  });

  return (
    <motion.div whileInView={{ opacity: [0, 1] }}>
      <h1 className='sticky-top text-center p-3 bg-light border-bottom'>Maintenance Bill</h1>
      <div className='p-3'>
        <MaterialReactTable table={table} />
      </div>
    </motion.div>
  );
}

export default ShowMaintenanceBill;
