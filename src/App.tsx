import "./App.css";
import CompareProducts from "./components/CompareProducts";
import CsvUpload from "./components/CsvUpload";
import DetailedComparisonTable from "./components/DetailedComparisonTable";
import { CsvProvider } from "./context/CsvContext";

function App() {
  return (
    <CsvProvider>
      <CompareProducts />
      <CsvUpload />
      <DetailedComparisonTable />
      {/* <Row /> */}
    </CsvProvider>
  );
}

export default App;
