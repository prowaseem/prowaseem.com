import React from "react";
import { Layout, theme, ConfigProvider } from "antd";
import Header from "./components/header";
import "./App.scss";

const headerStyle: React.CSSProperties = {
  position: "sticky",
  zIndex: 1,
  top: 0,
  width: "100%",
  display: "flex",
  alignItems: "center",
};

function App() {
  return (
    <Layout>
      <Layout.Header style={headerStyle}>
        <Header />
      </Layout.Header>
      <div className="overlay"></div>
    </Layout>
  );
}

export default App;
