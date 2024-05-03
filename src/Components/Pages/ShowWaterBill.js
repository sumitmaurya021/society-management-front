import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import Spinner from "../Spinner";
import { ToastContainer, toast } from "react-toastify";

function ShowWaterBill() {
  const [waterBills, setWaterBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        // Retrieve access token from local storage
        const accessToken = localStorage.getItem("access_token");

        if (!accessToken) {
          console.error("Access token not found in local storage");
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        const response = await axios.get(
          "http://localhost:3000/api/v1/buildings/1/water_bills",
          config
        );

        if (response.status === 200) {
          setWaterBills(response.data);
          setIsLoading(false);
          toast.success("Water bills fetched successfully");
        } else {
          toast.error("Error fetching water bills");
        }
      } catch (error) {
        console.error("Error fetching water bills:", error);
      }
    };

    fetchBills();
  }, []);

  // Define columns for MaterialReactTable
  const columns = [
    {
      accessorKey: "bill_name",
      header: "Bill Name",
      size: 200,
    },
    {
      accessorKey: "bill_month_and_year",
      header: "Bill Month and Year",
      size: 150,
    },
    {
      accessorKey: "owner_amount",
      header: "Owner Amount",
      size: 150,
    },
    {
      accessorKey: "rent_amount",
      header: "Rent Amount",
      size: 150,
    },
    {
      accessorKey: "start_date",
      header: "Start Date",
      size: 150,
    },
    {
      accessorKey: "end_date",
      header: "End Date",
      size: 150,
    },
    {
      accessorKey: "remarks",
      header: "Remarks",
      size: 300,
    },
  ];

  // Create MaterialReactTable instance
  const table = useMaterialReactTable({
    columns,
    data: waterBills,
  });

  return (
    <>
      {isLoading && <Spinner />}
      <motion.div whileInView={{ opacity: [0, 1] }}>
        <h1 className="sticky-top text-center p-3 bg-light border-bottom">
          Water Bill
        </h1>
        <div className="p-3">
          <MaterialReactTable table={table} />
        </div>
        <ToastContainer />
      </motion.div>
    </>
  );
}

export default ShowWaterBill;
