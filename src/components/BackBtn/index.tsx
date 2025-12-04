import React from "react";

import { useLocation, useNavigate } from "react-router-dom";

const BackBtn: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoBack = () => {
    if (location.state?.from) {
      navigate(location.state?.from, { replace: true });
    } else {
      navigate(-1);
    }
  };
  return (
    <button
      onClick={handleGoBack}
      className="bg-transparent p-0 m-0 w-[24px] h-[24px] leading-[24px] focus:outline-none z-10"
    >
      <i className="votigram-icon-back text-[24px] text-white" />
    </button>
  );
};

export default BackBtn;
