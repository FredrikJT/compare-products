import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import IconButton from "@mui/joy/IconButton";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";
import * as React from "react";

import { useCsvContext } from "../context/CsvContext";
import { CompareProductItem } from "../types/common";
import { createProducts } from "../utils/createProducts";
function Row(props: { row: CompareProductItem; initialOpen?: boolean }) {
  const { row } = props;
  const [open, setOpen] = React.useState(props.initialOpen || false);

  console.log("row", row);

  return (
    <React.Fragment>
      <tr>
        <td>
          <IconButton
            aria-label="expand row"
            variant="plain"
            color="neutral"
            size="sm"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </td>
        <th scope="row">{row.name}</th>
        <td>{row.description}</td>
        <td>{row.totalCost}</td>
      </tr>
      <tr>
        <td style={{ height: 0, padding: 0 }} colSpan={6}>
          {open && (
            <Sheet
              variant="soft"
              sx={{
                p: 1,
                pl: 6,
                boxShadow: "inset 0 3px 6px 0 rgba(0 0 0 / 0.08)",
              }}
            >
              <Typography level="body-lg" component="div">
                History
              </Typography>
              <Table
                borderAxis="bothBetween"
                size="sm"
                aria-label="purchases"
                sx={{
                  "& > thead > tr > th:nth-child(n + 3), & > tbody > tr > td:nth-child(n + 3)":
                    { textAlign: "right" },
                  "--TableCell-paddingX": "0.5rem",
                }}
              >
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Failure per Year</th>
                    <th>Price per Year</th>
                  </tr>
                </thead>
                <tbody>
                  {row.children.map((historyRow) => (
                    <tr key={historyRow.name}>
                      <th scope="row">{historyRow.name}</th>
                      <td>{historyRow.quantity}</td>
                      <td>${historyRow.price.toFixed(2)}</td>
                      <td>{historyRow.failureRate.toFixed(2)}</td>
                      <td>
                        $
                        {(
                          historyRow.quantity *
                          historyRow.price *
                          historyRow.failureRate
                        ).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Sheet>
          )}
        </td>
      </tr>
    </React.Fragment>
  );
}

export default function TableCollapsibleRow() {
  const { csvData = [] } = useCsvContext();

  const products = createProducts(csvData);

  console.log("products", products);

  return (
    <Sheet>
      <Table
        aria-label="collapsible table"
        sx={{
          "& > thead > tr > th:nth-child(n + 3), & > tbody > tr > td:nth-child(n + 3)":
            { textAlign: "right" },
          '& > tbody > tr:nth-child(odd) > td, & > tbody > tr:nth-child(odd) > th[scope="row"]':
            {
              borderBottom: 0,
            },
        }}
      >
        <thead>
          <tr>
            <th style={{ width: 40 }} aria-label="empty" />
            <th style={{ width: "40%" }}>Name</th>
            <th>Description</th>
            <th>Price per Year</th>
          </tr>
        </thead>
        <tbody>
          {products.map((row, index) => (
            <Row key={row.name} row={row} initialOpen={index === 0} />
          ))}
        </tbody>
      </Table>
    </Sheet>
  );
}
