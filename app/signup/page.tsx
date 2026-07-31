import SignUpForm from "@/components/SignUpForm";
import SignUpSideBar from "@/components/SignUpSideBar";
import React from "react";

const signupPage = () => {
  return (
    <div className="flex min-h-screen w-full max-w-[1420px] mx-auto py-3">
      <div className="hidden md:flex md:w-1/2 flex justify-center items-center px-6">
        <SignUpSideBar />
      </div>
      <div className="md:w-1/2 w-full px-6 flex flex-col justify-center gap-4 bg-[#F9F9F9]">
        <SignUpForm />
      </div>
    </div>
  );
};

export default signupPage;
