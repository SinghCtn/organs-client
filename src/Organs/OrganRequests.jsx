import React, { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import UrgencyLevel from "../utils/UrgencyLevel";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useMotionTemplate } from "framer-motion";
import { LabelInputContainer } from "../Users/CreateAdmin";
import { Label } from "@radix-ui/react-label";
import { Select } from "../components/UI/Select";

export const GET_ALL_REQUESTS = gql`
  query {
    getOrganRequests {
      id
      organ
      organId
      recipientId
      urgencyLevel
    }
  }
`;

const OrganType = [
  "HEART",
  "LUNGS",
  "LIVER",
  "KIDNEY",
  "PANCREAS",
  "INTESTINES",
  "CORNEA",
  "SKIN",
  "BONE",
  "TENDON",
  "HEART_VALVE",
  "VEINS",
  "ARTERIES",
];

const URGENCYLEVEL = ["EMERGENCY", "HIGH", "MODERATE", "LOW"];

function OrganRequests() {
  const { data, loading, error } = useQuery(GET_ALL_REQUESTS);
  const [viewData, setViewData] = useState([]);
  const [urgencyfilterOption, setUrgencyFilterOption] = useState("ALL");
  const [organfilterOption, setOrganFilterOption] = useState("ALL");

  useEffect(() => {
    if (organfilterOption === "ALL" && urgencyfilterOption === "ALL") {
      setViewData(data?.getOrganRequests);
    } else if (urgencyfilterOption === "ALL" && organfilterOption !== "ALL") {
      setViewData(() =>
        data?.getOrganRequests?.filter(
          (organ) => organ.organ === organfilterOption
        )
      );
    } else if (organfilterOption === "ALL" && urgencyfilterOption !== "ALL") {
      setViewData(() =>
        data?.getOrganRequests?.filter(
          (organ) => organ.urgencyLevel === urgencyfilterOption
        )
      );
    } else {
      setViewData(() =>
        data?.getOrganRequests
          ?.filter((organ) => organ.organ === organfilterOption)
          .filter((organ) => organ.urgencyLevel === urgencyfilterOption)
      );
    }
  }, [data, organfilterOption, urgencyfilterOption]);

  if (loading) return <div>Loading......</div>;

  if (error) return <div>{error}</div>;

  return (
    <>
      <div className="mx-auto w-full gap-4">
        <div className="bg-neutral-800 text-neutral-200 text-right px-4 py-1 flex justify-end text-sm">
          <LabelInputContainer className="w-40 mr-4">
            <Label htmlFor="name" className="inline-block">
              Organs
            </Label>
            <Select
              className="h-8"
              value={organfilterOption}
              onChange={(e) => {
                setOrganFilterOption(e.target.value);
              }}
            >
              <option value="ALL">ALL</option>
              {OrganType.map((organ) => (
                <option key={organ} value={organ}>
                  {organ}
                </option>
              ))}
            </Select>
          </LabelInputContainer>
          <LabelInputContainer className="w-40">
            <Label htmlFor="name">Urgency Level</Label>
            <Select
              className="h-8"
              value={urgencyfilterOption}
              onChange={(e) => {
                setUrgencyFilterOption(e.target.value);
              }}
            >
              <option value="ALL">ALL</option>
              {URGENCYLEVEL.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
          </LabelInputContainer>
        </div>
        <motion.div className="px-4 py-2 flex justify-between items-center bg-neutral-800 text-neutral-200">
          <ul className="grid grid-cols-5 w-full gap-4">
            <li>ID</li>
            <li>Organ</li>
            <li>Recipient ID</li>
            <li>Urgency Level</li>
            <li> Organ ID</li>
          </ul>
          <div className="w-20"></div>
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
              className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-400 rounded-xl cursor-pointer m-2 border border-neutral-500"
            >
              <ul className="grid grid-cols-5 w-full gap-4 text-sm">
                <motion.li layoutId={`id-${info.id}-${info.id}`}>
                  {info.id}
                </motion.li>
                <motion.li layoutId={`id-${info.id}-${info.organ}`}>
                  {info.organ}
                </motion.li>
                <motion.li layoutId={`id-${info.id}-${info.recipientId}`}>
                  {info.recipientId}
                </motion.li>
                <motion.li layoutId={`id-${info.id}-${info.urgencyLevel}`}>
                  <UrgencyLevel>{info.urgencyLevel}</UrgencyLevel>
                </motion.li>
                <motion.li
                  layoutId={`id-${info.id}-${info.organId || "no-orgnaId"}`}
                >
                  {info.organId || "Organ to be assigned"}
                </motion.li>
              </ul>

              <Link
                to={`/view_organs?organName=${info.organ}&requestId=${info.recipientId}`}
              >
                <motion.button
                  layoutId={`button-${info.id}-${info.id}`}
                  className="px-4 py-2 text-sm rounded-full border-2 border-green-500 font-bold bg-gray-100 hover:bg-green-500 hover:text-white text-black mt-4 md:mt-0 w-20"
                >
                  Assign
                </motion.button>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </>
  );
}
export default OrganRequests;
