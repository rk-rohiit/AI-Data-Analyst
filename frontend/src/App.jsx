import { useState } from "react";
import Layout from "./components/Layout";
import FileUpload from "./components/FileUpload";
import Dashboard from "./components/Dashboard";

function App() {
  const [data, setData] = useState(null);
  const [activePage, setActivePage] = useState("upload");
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Layout
      activePage={activePage}
      onPageChange={setActivePage}
      hasData={!!data}
      darkMode={darkMode}
      onToggleDarkMode={() => setDarkMode(!darkMode)}
    >
      {activePage === "upload" && (
        <FileUpload
          setData={(res) => {
            setData(res);
            setActivePage("dashboard"); // auto switch
          }}
          darkMode={darkMode}
        />
      )}

      {activePage === "dashboard" && data && (
        <Dashboard data={data} darkMode={darkMode} />
      )}
    </Layout>
  );
}

export default App;