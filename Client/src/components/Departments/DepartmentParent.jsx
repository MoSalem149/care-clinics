import React from "react";
import Header from "../../components/Header";
import Department from "./Department";
import Footer from "../Footer";
import { useUsersProfileContext } from "../../components/Context/GetUsersProfile";
const DepartmentParent = () => {
  const { currentUserProfile } = useUsersProfileContext();
  return (
    <div>
      <Header />
      <Department />
      <Footer />
    </div>
  );
};

export default DepartmentParent;
