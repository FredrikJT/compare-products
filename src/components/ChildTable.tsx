import React, { useState } from "react";
import "./Table.css";

interface Item {
  name: string;
  quantity: number;
  price: number;
  failureRate: number;
  children?: Item[];
  totalCost: number;
}

interface ChildTableProps {
  children: Item[];
  indentLevel?: number;
}

const ChildTable: React.FC<ChildTableProps> = ({
  children,
  indentLevel = 0,
}) => {
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null);

  const indentPadding = 20;
  const tableWidth = 1000 - indentPadding * indentLevel;

  // Calculate the width for the Name column
  const fixedColumnsWidth = 750; // Total width of other columns
  const nameColumnWidth = tableWidth - fixedColumnsWidth - indentPadding;

  return (
    <table
      style={{
        width: `${tableWidth}px`,
        backgroundColor: "rgba(128, 128, 128, 0.2)",
        marginLeft: `${indentPadding}px`,
      }}
    >
      <thead>
        <tr style={{ width: `${tableWidth}px` }}>
          <th style={{ width: `${nameColumnWidth}px` }}>
            {indentLevel <= 1 && "Name"}
          </th>
          <th style={{ width: "100px" }}>{indentLevel <= 1 && "Quantity"}</th>
          <th style={{ width: "100px" }}>{indentLevel <= 1 && "Price"}</th>
          <th style={{ width: "150px" }}>
            {indentLevel <= 1 && "Failure per Year"}
          </th>
          <th style={{ width: "200px" }}>
            {indentLevel <= 1 && "Item Price per Year"}
          </th>
          <th style={{ width: "200px" }}>
            {indentLevel <= 1 && "Assembly Cost per Year"}
          </th>
        </tr>
      </thead>
      <tbody>
        {children
          .sort((a, b) => (b.totalCost ?? 0) - (a.totalCost ?? 0))
          .map((item, index) => {
            const itemPricePerYear =
              item.price * item.quantity * item.failureRate;
            return (
              <React.Fragment key={`${item.name}-${index}`}>
                <tr
                  onClick={() =>
                    item.children &&
                    item.children.length > 0 &&
                    setExpandedProduct(expandedProduct === index ? null : index)
                  }
                >
                  <td>
                    {item.children &&
                      item.children.length > 0 &&
                      (expandedProduct === index ? "▼" : "▶")}{" "}
                    {item.name}
                  </td>
                  <td>{item.quantity}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>{item.failureRate.toFixed(3)}</td>
                  <td>${itemPricePerYear.toFixed(2)}</td>
                  <td style={{ width: "150px" }}>
                    ${item.totalCost?.toFixed(2)}
                  </td>
                </tr>
                {expandedProduct === index &&
                  item.children &&
                  item.children.length > 0 && (
                    <tr>
                      <td colSpan={6} style={{ padding: 0 }}>
                        <div style={{ width: "100%" }}>
                          <ChildTable
                            children={item.children}
                            indentLevel={indentLevel + 1}
                          />
                        </div>
                      </td>
                    </tr>
                  )}
              </React.Fragment>
            );
          })}
      </tbody>
    </table>
  );
};

export default ChildTable;
