import React from "react";

const TicketLoading: React.FC = () => {
  return (
    <div className="flex justify-center py-20">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );
};

export default TicketLoading;
