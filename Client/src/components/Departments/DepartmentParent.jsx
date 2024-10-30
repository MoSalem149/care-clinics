import React from "react";
import HeaderParent from "../../components/HeaderParent";
import Department from "./Department";
import Footer from "../Footer";
import { useUsersProfileContext } from "../../components/Context/GetUsersProfile";
const DepartmentParent = () => {
  const { currentUserProfile } = useUsersProfileContext();
  return (
    <div>
      <HeaderParent profileImage={currentUserProfile?.profileImage} />
      <Department />
      <Footer />
    </div>
  );
};

export default DepartmentParent;
