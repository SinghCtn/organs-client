import { gql, useMutation } from "@apollo/client";
import { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import toast from "react-hot-toast";
import { Label } from "@radix-ui/react-label";
import { BottomGradient, LabelInputContainer } from "./CreateAdmin";
import { Input } from "../components/UI/Input";
import { useNavigate } from "react-router-dom";

const LOGIN_MUTATION = gql`
  mutation ($email: ID!, $password: String!) {
    login(email: $email, password: $password) {
      name
      role
      token
    }
  }
`;

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { data }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      if (data && data.login) {
        context.login(data.login);
        toast.success(`Logged in successfully as ${data.login.role}`);
        setEmail("");
        setPassword("");
        navigate("/");
      } else {
        throw new Error("Failed to login!!");
      }
    },
    onError: (error) => {
      console.log(error);
      toast.error("An error occured while logging in.");
    },
  });
  const context = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login({ variables: { email, password } });
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center w-full h-full">
        <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-neutral-900">
          <h2 className="font-bold text-xl text-neutral-200">Login</h2>
          <form onSubmit={handleLogin} className="my-8 text-neutral-200">
            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                placeholder="projectmayhem@fc.com"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="••••••••"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </LabelInputContainer>

            <button
              className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              type="submit"
            >
              Login
              <BottomGradient />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
