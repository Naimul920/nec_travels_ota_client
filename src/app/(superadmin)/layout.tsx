import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div>Head</div>
      <div>{children}</div>
      <div>Foot</div>
    </>
  );
}

export default layout;
