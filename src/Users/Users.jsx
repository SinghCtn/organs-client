import React, { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import AvailabilityStatus from "../utils/AvailabilityStatus";
import UrgencyLevel from "../utils/UrgencyLevel";
import { Label } from "@radix-ui/react-label";
import { LabelInputContainer } from "./CreateAdmin";
import { Select } from "../components/UI/Select";
import { motion } from "framer-motion";
import BloodGroup from "../utils/BloodGroup";

export const GET_ALL_USERS = gql`
  query Query {
    getUsers {
      id
      name
      gender
      dob
      bloodGroup
      phone
      email
      userType
      ... on Donor {
        donationOrgans {
          id
          organ
          availabilityStatus
        }
      }
      ... on Recipient {
        requestedOrgans {
          id
          organ
          urgencyLevel
        }
      }
    }
  }
`;

function Users() {
  const { loading, error, data } = useQuery(GET_ALL_USERS);
  const [userType, setUserType] = useState("ALL");
  const [viewData, setViewData] = useState([]);

  useEffect(() => {
    if (data?.getUsers) {
      switch (userType) {
        case "ALL":
          setViewData(data.getUsers);
          break;
        case "DONOR":
          setViewData(data.getUsers.filter((d) => d.userType === "DONOR"));
          break;
        case "RECIPIENT":
          setViewData(data.getUsers.filter((d) => d.userType === "RECIPIENT"));
          break;
        default:
          setViewData([]);
      }
    }
  }, [data, userType]);

  if (loading) return <h1>Loading.......</h1>;
  if (error) return <h1>message: {error.message}</h1>;

  const handleUserChange = (e) => {
    setUserType(e.target.value);
  };

  return (
    <>
      <div className="mx-auto w-full gap-4">
        <div className="bg-neutral-800 text-neutral-200 text-right px-4 py-1 flex justify-end">
          <LabelInputContainer className="w-40 mr-4 text-sm">
            <Label htmlFor="name" className="inline-block ">
              User Types
            </Label>
            <Select
              className="my-custom-class h-8"
              value={userType}
              onChange={handleUserChange}
            >
              <option value="ALL">ALL</option>
              <option value="DONOR">DONOR</option>
              <option value="RECIPIENT">RECIPIENT</option>
            </Select>
          </LabelInputContainer>
        </div>
        <motion.div className="px-4 py-2 flex justify-between items-center bg-neutral-800 text-neutral-200">
          <ul className="grid grid-cols-8 w-full gap-4">
            <li>ID</li>
            <li>Name</li>
            <li>Gender</li>
            <li>DOB</li>
            <li>Blood Group</li>
            <li>Phone</li>
            <li>Email</li>
            <li>User Type</li>
          </ul>
        </motion.div>
        {viewData?.length < 1 ? (
          <div className="text-center text-red-600 py-24 text-3xl">
            No records found
          </div>
        ) : (
          viewData?.map((info, index) => (
            <motion.div
              layoutId={`${info.id}-${info.recipientId}`}
              key={`${info.id}`}
              className="p-4 flex flex-col justify-between items-center hover:bg-neutral-400 rounded-xl  text-sm m-2 border border-neutral-500"
            >
              <ul className="grid grid-cols-8 w-full gap-4 mb-2">
                <motion.li layoutId={`id-${info.id}-${info.id}`}>
                  {info.id}
                </motion.li>
                <motion.li layoutId={`id-${info.id}-${info.name}`}>
                  {info.name}
                </motion.li>
                <motion.li layoutId={`id-${info.id}-${info.gender}`}>
                  {info.gender}
                </motion.li>
                <motion.li layoutId={`id-${info.id}-${info.dob}`}>
                  {info.dob}
                </motion.li>
                <motion.li layoutId={`id-${info.id}-${info.bloodGroup}`}>
                  <BloodGroup>{info.bloodGroup}</BloodGroup>
                </motion.li>
                <motion.li layoutId={`id-${info.id}-${info.phone}`}>
                  {info.phone}
                </motion.li>
                <motion.li layoutId={`id-${info.id}-${info.email}`}>
                  {info.email}
                </motion.li>
                <motion.li layoutId={`id-${info.id}-${info.userType}`}>
                  {info.userType}
                </motion.li>
              </ul>
              {userType !== "ALL" && (
                <motion.div className="grid grid-cols-4 gap-3 w-full border border-neutral-500 p-2 rounded-xl">
                  {info.userType === "DONOR"
                    ? info.donationOrgans?.map(
                        ({ id, organ, availabilityStatus }) => (
                          <div key={id}>
                            {organ}:{" "}
                            <AvailabilityStatus>
                              {availabilityStatus}
                            </AvailabilityStatus>
                          </div>
                        )
                      )
                    : info.requestedOrgans?.map(
                        ({ id, organ, urgencyLevel }) => (
                          <div key={id}>
                            {organ}: <UrgencyLevel>{urgencyLevel}</UrgencyLevel>
                          </div>
                        )
                      )}
                </motion.div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </>
  );
}

export default Users;
