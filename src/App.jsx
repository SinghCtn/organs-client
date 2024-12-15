import React, { useContext, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./components/UI/SideBar";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import {
  IconLungs,
  IconUserPlus,
  IconUsers,
  IconQuestionMark,
  IconCrown,
  IconLungsFilled,
  IconLogin,
  IconLogout,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "./lib/utils";

import Home from "./Home/Home";
import Organs from "./Organs/Organs";
import Users from "./Users/Users";
import OrganRequests from "./Organs/OrganRequests";
import Login from "./Users/Login";
import CreateAdmin from "./Users/CreateAdmin";
import AddUser from "./Users/AddUser";
import { AuthContext } from "./Context/AuthContext";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./Context/ProtectedRoute";

const links = [
  {
    label: "Add User",
    href: "/add_users",
    icon: (
      <IconUserPlus className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "Users",
    href: "/view_users",
    icon: (
      <IconUsers className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "Organs",
    href: "/view_organs",
    icon: (
      <IconLungs className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "Organ Requests",
    href: "/view_requested_organs",
    icon: (
      <IconQuestionMark className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "Create Admin",
    href: "/create_admin",
    icon: (
      <IconCrown className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
];

export default function App() {
  const [open, setOpen] = useState(false);
  const context = useContext(AuthContext);
  // console.log(context.user);

  return (
    <Router>
      <div
        className={cn(
          "rounded-md flex flex-col md:flex-row bg-gray-100 w-full flex-1 max-w-7xl mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
          "h-screen"
        )}
      >
        <Toaster position="top-right" reverseOrder={false} />
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              {open ? <Logo /> : <LogoIcon />}
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
            </div>
            <div>
              {context?.user?.token ? (
                <>
                  <SidebarLink
                    link={{
                      label: `${context.user.name} - ${context.user.role}`,
                      href: "",
                      icon: (
                        <div className="h-7 w-9 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0 flex items-center justify-center">
                          <h1 className="text-neutral-900 text-3xl flex-shrink-0 ">
                            {context.user.name[0]}
                          </h1>
                        </div>
                      ),
                    }}
                  />
                  <div onClick={context.logout}>
                    <SidebarLink link={{ label: "Logout", href: "/login" }}>
                      <IconLogout className="text-neutral-700 dark:text-neutral-200 h-7 w-7 flex-shrink-0" />
                    </SidebarLink>
                  </div>
                </>
              ) : (
                <SidebarLink link={{ label: "Login", href: "/login" }}>
                  <IconLogin className="text-neutral-700 dark:text-neutral-200 h-7 w-7 flex-shrink-0" />
                </SidebarLink>
              )}
            </div>
          </SidebarBody>
        </Sidebar>
        <div className="flex flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/add_users"
              element={
                <ProtectedRoute
                  user={context.user}
                  requiredRole={["ADMIN", "SUPERADMIN"]}
                >
                  <AddUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/view_users"
              element={
                <ProtectedRoute
                  user={context.user}
                  requiredRole={["ADMIN", "SUPERADMIN"]}
                >
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/view_organs"
              element={
                <ProtectedRoute
                  user={context.user}
                  requiredRole={["ADMIN", "SUPERADMIN"]}
                >
                  <Organs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/view_requested_organs"
              element={
                <ProtectedRoute
                  user={context.user}
                  requiredRole={["ADMIN", "SUPERADMIN"]}
                >
                  <OrganRequests />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />}></Route>
            <Route
              path="/create_admin"
              element={
                <ProtectedRoute
                  user={context.user}
                  requiredRole={["SUPERADMIN"]}
                >
                  <CreateAdmin />
                </ProtectedRoute>
              }
            ></Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export const Logo = () => {
  return (
    <Link
      to="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <LogoIcon />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-white whitespace-pre"
      >
        Organs Inventory Management
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      to="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <IconLungsFilled className="text-neutral-200 h-7 w-7 flex-shrink-0" />
    </Link>
  );
};
