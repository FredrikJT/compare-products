import React, { useMemo, useState } from "react";
import { useCsvContext } from "../context/CsvContext";
import { Item } from "../types/common";

interface ComparisonData {
  Name: string;
  Type: string;
  Parent?: string;
  products: Item[];
}

const DetailedComparisonTable: React.FC = () => {
  const { csvData } = useCsvContext();
  const [viewMode, setViewMode] = useState<"simple" | "complete">("simple");

  const comparisonData = useMemo(() => {
    if (!csvData || csvData.length < 2) return null;
    const allComponents = new Map<string, ComparisonData>();

    csvData.forEach((product, productIndex) => {
      product.forEach((item) => {
        const key = `${item.name}|${item.type}|${item.parent}`;
        if (!allComponents.has(key)) {
          allComponents.set(key, {
            Name: item.name,
            Type: item.type,
            Parent: item.parent,
            products: [],
          } as ComparisonData);
        }
        allComponents.get(key)!.products[productIndex] = item;
      });
    });

    return Array.from(allComponents.values());
  }, [csvData]);

  const productTotalCosts = useMemo(() => {
    if (!csvData) return [];
    return csvData.map((product) => {
      const productItem = product.find((item) => item.type === "Product");
      return productItem ? calculateTotalCost(product, productItem.name) : 0;
    });
  }, [csvData]);

  if (!comparisonData) return null;

  const renderSimpleTable = () => (
    <table style={{ width: "100%" }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>{csvData[0][0].description}</th>
          <th>{csvData[1][0].description}</th>
          <th>Difference</th>
        </tr>
      </thead>
      <tbody>
        {comparisonData.map((row, rowIndex) => {
          const cost1 = calculateItemCost(row.products[0]);
          const cost2 = calculateItemCost(row.products[1]);
          const difference = cost2 - cost1;

          return (
            <tr key={`row-${rowIndex}`}>
              <td>{row.Name}</td>
              <td>{row.Type}</td>
              <td>${cost1?.toFixed(2)}</td>
              <td>${cost2.toFixed(2)}</td>
              <td style={{ color: difference > 0 ? "red" : "green" }}>
                {differenceText(cost2, cost1)}
              </td>
            </tr>
          );
        })}
        <tr>
          <td colSpan={2}>
            <strong>Total Cost</strong>
          </td>
          <td>
            <strong>${productTotalCosts[0].toFixed(2)}</strong>
          </td>
          <td>
            <strong>${productTotalCosts[1].toFixed(2)}</strong>
          </td>
          <td
            style={{
              color:
                productTotalCosts[1] - productTotalCosts[0] > 0
                  ? "red"
                  : "green",
            }}
          >
            <strong>
              {differenceText(productTotalCosts[1], productTotalCosts[0])}
            </strong>
          </td>
        </tr>
      </tbody>
    </table>
  );

  const differenceText = (number1: number, number2: number): string => {
    return number1 - number2 !== 0
      ? `${number1 - number2 > 0 ? "+" : "-"} ${Math.abs(
          number1 - number2
        ).toFixed(2)}`
      : "-";
  };

  const renderCompleteTable = () => (
    <table style={{ width: "100%" }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Parent</th>
          {csvData.map((product, index) => (
            <React.Fragment key={`header-${index}`}>
              <th colSpan={5}>{product[0].description}</th>
            </React.Fragment>
          ))}
        </tr>
        <tr>
          <th colSpan={3}></th>
          {csvData.map((_, index) => (
            <React.Fragment key={`subheader-${index}`}>
              <th>Quantity</th>
              <th>Price ($)</th>
              <th>Failure rate (1/year)</th>
              <th>Item Cost ($/year)</th>
              <th>Description</th>
            </React.Fragment>
          ))}
        </tr>
      </thead>
      <tbody>
        {comparisonData.map((row, rowIndex) => (
          <tr key={`row-${rowIndex}`}>
            <td>{row.Name}</td>
            <td>{row.Type}</td>
            <td>{row.Parent}</td>
            {row.products.map((item: Item, productIndex: number) => (
              <React.Fragment key={`cell-${rowIndex}-${productIndex}`}>
                <td>{item.quantity || "-"}</td>
                <td>{item.price || "-"}</td>
                <td>{item.failureRate || "-"}</td>
                <td>
                  {item.type === "Product" ? (
                    <strong>
                      ${productTotalCosts[productIndex].toFixed(2)}
                    </strong>
                  ) : item ? (
                    `$${calculateItemCost(item).toFixed(2)}`
                  ) : (
                    "-"
                  )}
                </td>
                <td>{item.description || "-"}</td>
              </React.Fragment>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Detailed Comparison</h2>
      <div>
        <button
          onClick={() => setViewMode("simple")}
          disabled={viewMode === "simple"}
        >
          Simple View
        </button>
        <button
          onClick={() => setViewMode("complete")}
          disabled={viewMode === "complete"}
        >
          Complete View
        </button>
      </div>
      {viewMode === "simple" ? renderSimpleTable() : renderCompleteTable()}
    </div>
  );
};

function calculateItemCost(item?: Item): number {
  if (!item || !item.price || !item.failureRate || !item.quantity) return 0;

  return item.quantity * item.price * item.failureRate;
}

function calculateTotalCost(items: Item[], productName: string): number {
  let totalCost = 0;

  function recursiveCalculate(parentName: string) {
    items.forEach((item) => {
      if (item.parent === parentName) {
        totalCost += calculateItemCost(item);
        recursiveCalculate(item.name);
      }
    });
  }

  recursiveCalculate(productName);
  return totalCost;
}

export default DetailedComparisonTable;
