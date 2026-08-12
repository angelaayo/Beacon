import SignUpForm from "@/components/SignUpForm";
import AuthSideBar from "@/components/AuthSideBar";

const SignupPage = () => {
  return (
    <div className="flex min-h-screen w-full max-w-[1420px] mx-auto py-3">
      <div className="hidden md:flex md:w-1/2 justify-center items-center px-6">
        <AuthSideBar />
      </div>
      <div className="md:w-1/2 w-full px-6 flex flex-col justify-center gap-4 bg-muted">
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignupPage;
