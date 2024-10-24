import React from "react";
import Header from "../Header";
import Department from "./Department";
import Footer from "../Footer";

const DepartmentParent = () => {
  return (
    <div>
      <Header />
      <Department />
      <Footer />
    </div>
  );
};

export default DepartmentParent;
