import React, { useContext, useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Label } from "../components/UI/Label";
import { Input } from "../components/UI/Input";
import { cn } from "../lib/utils";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { AuthContext } from "../Context/AuthContext";
import { GET_ALL_ORGANS } from "../Organs/Organs";
import { GET_ALL_REQUESTS } from "../Organs/OrganRequests";

const CREATE_ADMIN = gql`
  mutation ($input: CreateAdminInput!) {
    createAdmin(input: $input) {
      id
      name
      role
      email
    }
  }
`;

const GET_ALL_ADMINS = gql`
  query {
    getAllAdmins {
      id
      name
      role
      email
    }
  }
`;

export default function SignupFormDemo() {
  const [adminObject, setAdminObject] = useState({
    name: "",
    email: "",
    password: "",
  });

  const context = useContext(AuthContext);

  const [createAdmin, { data }] = useMutation(CREATE_ADMIN);
  const [viewData, setViewData] = useState([]);
  const { data: adminsData, loading, error } = useQuery(GET_ALL_ADMINS);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (error) {
      console.error("Error fetching admins:", error.message);
      return;
    }

    if (adminsData && adminsData.getAllAdmins) {
      setViewData(adminsData.getAllAdmins);
    }
  }, [adminsData]);

  const handleSetAdminObject = (e) => {
    const { name, value } = e.target;
    setAdminObject((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createAdmin({
        variables: { input: adminObject },
        refetchQueries: [
          { query: GET_ALL_ADMINS },
          { query: GET_ALL_ORGANS },
          { query: GET_ALL_REQUESTS },
        ],
      });
      toast.success("Admin Added Successfully");
      // console.log(data);
      setAdminObject({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center w-6/12 h-full border-r-2 border-neutral-800">
        <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-neutral-900">
          <h2 className="font-bold text-xl text-neutral-200">
            Create New Admin
          </h2>

          <form className="my-8" onSubmit={(e) => handleSubmit(e)}>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Tyler"
                type="text"
                name="name"
                value={adminObject.name}
                onChange={(e) => handleSetAdminObject(e)}
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                placeholder="projectmayhem@fc.com"
                type="email"
                name="email"
                value={adminObject.email}
                onChange={(e) => handleSetAdminObject(e)}
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="••••••••"
                type="password"
                name="password"
                value={adminObject.password}
                onChange={(e) => handleSetAdminObject(e)}
              />
            </LabelInputContainer>
            <button
              className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              type="submit"
            >
              Create Admin
              <BottomGradient />
            </button>{" "}
          </form>
        </div>
      </div>
      <AllAdmins viewData={viewData} context={context} />
    </>
  );
}

const AllAdmins = ({ viewData, context }) => {
  console.log(viewData);
  return (
    <div className="overflow-auto w-6/12">
      <motion.div className="px-2 py-2 flex justify-between items-center bg-neutral-800 text-neutral-200">
        <ul className="grid grid-cols-4 w-full gap-4">
          <li>ID</li>
          <li>Name</li>
          <li>Email</li>
          <li>Role</li>
        </ul>
      </motion.div>
      {viewData?.length < 1 ? (
        <div className="text-center">
          <div className="text-red-600 pt-24 text-3xl">No records found</div>
          <div className="text-xl font-bold pt-20">
            {context.user.role === "SUPERADMIN" &&
              `Session may have been expired, login again and try!!!`}
          </div>
        </div>
      ) : (
        viewData?.map((info) => (
          <motion.div
            layoutId={`${info.id}-${info.recipientId}`}
            key={`${info.id}`}
            className="px-2 py-4 flex flex-col justify-between items-center hover:bg-neutral-400 rounded-xl  text-sm m-2 border border-neutral-500"
          >
            <ul className="grid grid-cols-4 w-full gap-4 mb-2">
              <motion.li layoutId={`id-${info.id}-${info.id}`}>
                {info.id}
              </motion.li>
              <motion.li layoutId={`id-${info.id}-${info.name}`}>
                {info.name}
              </motion.li>
              <motion.li layoutId={`id-${info.id}-${info.email}`}>
                {info.email}
              </motion.li>
              <motion.li layoutId={`id-${info.id}-${info.role}`}>
                {info.role}
              </motion.li>
            </ul>
          </motion.div>
        ))
      )}
    </div>
  );
};

export const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

export const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
