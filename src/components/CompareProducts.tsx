import React, { useState } from "react";
import { useCsvContext } from "../context/CsvContext";
import { CompareProductItem } from "../types/common";
import { createProducts } from "../utils/createProducts";
import ChildTable from "./ChildTable";
import "./Table.css";

const CompareProducts: React.FC = () => {
  const { csvData } = useCsvContext();
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null);
  const products: CompareProductItem[] = createProducts(csvData);

  return (
    <>
      <h1>Compare Products</h1>

      <table
        style={{ width: "1010px", backgroundColor: "rgba(128, 128, 128, 0.2)" }}
      >
        <thead>
          <tr>
            <th>Product</th>
            <th>Description</th>
            <th style={{ width: "200px" }}>Assembly Cost per Year</th>
          </tr>
        </thead>
        <tbody>
          {products
            .sort((a, b) => a.totalCost - b.totalCost)
            .map((product, index) => (
              <React.Fragment key={`product-${index}`}>
                <tr
                  onClick={() =>
                    setExpandedProduct(expandedProduct === index ? null : index)
                  }
                >
                  <td>
                    {product.children.length > 0 &&
                      (expandedProduct === index ? "▼" : "▶")}{" "}
                    {product.name}
                  </td>
                  <td>{product.description}</td>
                  <td style={{ width: "150px" }}>
                    ${product.totalCost?.toFixed(2)}
                  </td>
                </tr>

                {expandedProduct === index && (
                  <tr>
                    <td colSpan={3} style={{ padding: 0 }}>
                      <ChildTable children={product.children} indentLevel={1} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
        </tbody>
      </table>
    </>
  );
};

export default CompareProducts;
