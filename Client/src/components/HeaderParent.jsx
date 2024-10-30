import React from "react";
import { useUsersProfileContext } from "../components/Context/GetUsersProfile";
import Header from "../components/Header";

function ParentComponent() {
  const { currentUserProfile } = useUsersProfileContext();

  return (
    <div>
      <Header profileImage={currentUserProfile?.profileImage} />{" "}
    </div>
  );
}

export default ParentComponent;
