import Papa from "papaparse";
import React from "react";
import { useCsvContext } from "../context/CsvContext";
import { Item } from "../types/common";

interface RawItem {
  Name: string;
  Type: string;
  Quantity: string;
  "Price ($)": string;
  "Failure rate (1/year)": string;
  Description: string;
  Parent: string;
}

const CsvUpload: React.FC = () => {
  const { setCsvData } = useCsvContext();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse<RawItem>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        console.log("result", result);
        const items: Item[] = result.data.map((rawItem) => {
          const cleanedRawItem = {} as RawItem;
          for (const [key, value] of Object.entries(rawItem)) {
            cleanedRawItem[key as keyof RawItem] =
              typeof value === "string" ? value.replace(/\n/g, "") : value;
          }
          return parseRawItem(cleanedRawItem);
        });

        setCsvData((prevItems: Item[][]) => [...prevItems, items]);
      },
      error: (error: Error) => {
        console.error("Error while parsing CSV file:", error);
      },
    });
  };

  return (
    <>
      <div style={{ textAlign: "left" }}>
        <button onClick={() => document.getElementById("csvUpload")?.click()}>
          Add Product
        </button>
      </div>
      <input
        id="csvUpload"
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        style={{ display: "none" }}
      />
    </>
  );
};

function parseRawItem(rawItem: RawItem): Item {
  return {
    name: rawItem.Name,
    type: rawItem.Type,
    quantity: parseQuantity(rawItem.Quantity),
    price: parsePrice(rawItem["Price ($)"]),
    failureRate: parseFailureRate(rawItem["Failure rate (1/year)"]),
    description: rawItem.Description,
    parent: rawItem.Parent,
  };
}

function parsePrice(priceStr?: string): number | undefined {
  if (!priceStr) return undefined;
  return parseFloat(priceStr.replace(/[$,]/g, "")) || undefined;
}

function parseQuantity(quantityStr: string): number {
  return parseInt(quantityStr) || 0;
}

function parseFailureRate(rateStr: string): number {
  return parseFloat(rateStr) || 0;
}

export default CsvUpload;
