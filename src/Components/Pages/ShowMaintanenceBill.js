import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { ToastContainer, toast } from "react-toastify";
import Spinner from "../Spinner";

function ShowMaintenanceBill() {
  const [bills, setBills] = useState([]);
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
          "http://localhost:3000/api/v1/buildings/1/maintenance_bills",
          config
        );

        if (response.status === 200) {
          setBills(response.data);
          setIsLoading(false);
          toast.success("Maintenance bills fetched successfully");
        } else {
          toast.error("Error fetching maintenance bills");
        }
      } catch (error) {
        console.error("Error fetching maintenance bills:", error);
      }
    };
    fetchBills();
  }, []);

  const columns = useMemo(
    () => [
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
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: bills,
  });

  return (
    <>
      {isLoading && <Spinner />}
      <motion.div>
        <h1 className="sticky-top text-center p-3 bg-light border-bottom">
          Maintenance Bill
        </h1>
        <div className="p-3">
          <MaterialReactTable table={table} />
        </div>
        <ToastContainer />
      </motion.div>
    </>
  );
}

export default ShowMaintenanceBill;
