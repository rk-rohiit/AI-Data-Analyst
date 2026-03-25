import { useState } from "react";
import Layout from "./components/Layout";
import FileUpload from "./components/FileUpload";
import Dashboard from "./components/Dashboard";

function App() {
  const [data, setData] = useState(null);
  const [activePage, setActivePage] = useState("upload");

  return (
    <Layout
      activePage={activePage}
      onPageChange={setActivePage}
      hasData={!!data}
    >
      {activePage === "upload" && (
        <FileUpload
          setData={(res) => {
            setData(res);
            setActivePage("dashboard"); // auto switch
          }}
        />
      )}

      {activePage === "dashboard" && data && (
        <Dashboard data={data} />
      )}
    </Layout>
  );
}

export default App;