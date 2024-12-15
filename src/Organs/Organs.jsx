import React, { useEffect, useRef, useState } from "react";
import { forwardRef } from "react";
import { AnimatePresence, motion, useMotionTemplate } from "framer-motion";
import { useOutsideClick } from "../hooks/use-outside-click";

import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";

import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { Label } from "@radix-ui/react-label";
import { LabelInputContainer } from "../Users/CreateAdmin";
import { Select } from "../components/UI/Select";
import AvailabilityStatus from "../utils/AvailabilityStatus";
import { GET_ALL_REQUESTS } from "./OrganRequests";

export const GET_ALL_ORGANS = gql`
  query {
    getOrgans {
      id
      organ
      donorId
      availabilityStatus
      dateOfDonation
      dateOfTransplant
      recipientId
      donor {
        id
        name
        bloodGroup
      }
      recipient {
        id
        name
        bloodGroup
      }
    }
  }
`;

const GET_ALL_RECIPIENTS = gql`
  query ($organ: OrganType) {
    getRequests(organ: $organ) {
      urgencyLevel
      recipient {
        id
        name
      }
    }
  }
`;

const UPDATE_ORGAN_DETAILS = gql`
  mutation ($input: UpdateOrganInput) {
    updateOrgan(input: $input) {
      id
      organ
      donorId
      availabilityStatus
      dateOfDonation
      dateOfTransplant
      recipientId
      donor {
        id
        name
        bloodGroup
      }
      recipient {
        id
        name
        bloodGroup
      }
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

const AVAILABILITYSTATUS = [
  "UNAVAILABLE",
  "AVAILABLE",
  "ALLOCATED",
  "TRANSPLANTED",
];

export default function Organs({}) {
  //acert
  const [active, setActive] = useState(null);
  const ref = useRef(null);
  // console.log(active);

  //mine
  // view
  const queryParams = new URLSearchParams(useLocation().search);
  const organName = queryParams.get("organName");
  const requestId = queryParams.get("requestId");

  const { loading, error, data } = useQuery(GET_ALL_ORGANS);

  const [viewData, setViewData] = useState([]);

  const [organfilterOption, setOrganFilterOption] = useState(
    organName || "ALL"
  );

  const [availabilityfilterOption, setAvailabilityFilterOption] =
    useState("ALL");

  // insert

  //acert
  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  // mine
  // filter logic
  useEffect(() => {
    if (organfilterOption === "ALL" && availabilityfilterOption === "ALL") {
      setViewData(data?.getOrgans);
    } else if (
      availabilityfilterOption === "ALL" &&
      organfilterOption !== "ALL"
    ) {
      setViewData(() =>
        data?.getOrgans?.filter((organ) => organ.organ === organfilterOption)
      );
    } else if (
      organfilterOption === "ALL" &&
      availabilityfilterOption !== "ALL"
    ) {
      setViewData(() =>
        data?.getOrgans?.filter(
          (organ) => organ.availabilityStatus === availabilityfilterOption
        )
      );
    } else {
      setViewData(() =>
        data?.getOrgans
          ?.filter((organ) => organ.organ === organfilterOption)
          .filter(
            (organ) => organ.availabilityStatus === availabilityfilterOption
          )
      );
    }
  }, [data, organfilterOption, availabilityfilterOption]);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>{error.message}</h1>;

  return (
    <>
      {/* <Toaster position="top-right" reverseOrder={false} /> */}
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0  grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2  items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <UpdateOrgan
              active={active}
              ref={ref}
              setActive={setActive}
              requestID={requestId}
            />
          </div>
        ) : null}
      </AnimatePresence>
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
              <Label htmlFor="name">Availability Status</Label>
              <Select
                className="h-8"
                value={availabilityfilterOption}
                onChange={(e) => {
                  setAvailabilityFilterOption(e.target.value);
                }}
              >
                <option value="ALL">ALL</option>
                {AVAILABILITYSTATUS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Select>
            </LabelInputContainer>
          </div>
          <motion.div className="px-4 py-2 flex justify-between items-center bg-neutral-800 text-neutral-200">
            <ul className="grid grid-cols-7 w-full gap-4">
              <li>ID</li>
              <li>Organ</li>
              <li>Donor ID</li>
              <li>Availability Status</li>
              <li>Date of Donation</li>
              <li>Date of Transplant</li>
              <li>Recipient ID</li>
            </ul>

            <div className="w-20"></div>
          </motion.div>{" "}
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
                <ul className="grid grid-cols-7 w-full gap-4 text-sm">
                  <motion.li layoutId={`id-${info.id}-${info.id}`}>
                    {info.id}
                  </motion.li>
                  <motion.li layoutId={`id-${info.id}-${info.organ}`}>
                    {info.organ}
                  </motion.li>
                  <motion.li layoutId={`id-${info.id}-${info.donorId}`}>
                    {info.donorId}
                  </motion.li>
                  <motion.li
                    layoutId={`id-${info.id}-${info.availabilityStatus}`}
                  >
                    <AvailabilityStatus>
                      {info.availabilityStatus}
                    </AvailabilityStatus>
                  </motion.li>
                  <motion.li
                    layoutId={`id-${info.id}-${
                      info.dateOfDonation || "no-donation-date"
                    }`}
                  >
                    {info.dateOfDonation || "Donation not Scheduled"}
                  </motion.li>
                  <motion.li
                    layoutId={`id-${info.id}-${
                      info.dateOfTransplant || "no-transplant-date"
                    }`}
                  >
                    {info.dateOfTransplant || "Transplant not Scheduled"}
                  </motion.li>
                  <motion.li
                    layoutId={`id-${info.id}-${
                      info.recipientId || "no-recipient"
                    }`}
                  >
                    {info.recipientId || "Recipient is to be assigned"}
                  </motion.li>
                </ul>

                <motion.button
                  layoutId={`button-${info.id}-${info.id}`}
                  onClick={() => setActive(info)}
                  className="px-4 py-2 text-sm rounded-full border-2 border-green-500 font-bold bg-gray-100 hover:bg-green-500 hover:text-white text-black mt-4 md:mt-0 w-20"
                >
                  Update
                </motion.button>
              </motion.div>
            ))
          )}
        </div>
      </>
    </>
  );
}

const UpdateOrgan = forwardRef(({ active, setActive, requestID }, ref) => {
  // Insert Logic
  const [updateOrgan, { data, error, loading }] =
    useMutation(UPDATE_ORGAN_DETAILS);

  const [
    getOrganRequests,
    { data: requestsData, error: requestsError, loading: requestsLoading },
  ] = useLazyQuery(GET_ALL_RECIPIENTS);

  const [updateObject, setUpdateObject] = useState({
    id: "",
    availabilityStatus: "",
    dateOfDonation: "",
    dateOfTransplant: "",
    recipientId: "",
  });

  console.log(updateObject.recipientId);

  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);

  // state update for the request
  const handleSetUpdateObject = (e) => {
    const { name, value } = e.target;
    if (
      name === "availabilityStatus" &&
      (value === "AVAILABLE" || value === "UNAVAILABLE")
    ) {
      setUpdateObject((prev) => ({
        ...prev,
        recipientId: "",
        dateOfTransplant: "",
      }));
    }
    if (name === "availabilityStatus" && value === "UNAVAILABLE") {
      setUpdateObject((prev) => ({
        ...prev,
        dateOfDonation: "",
      }));
    }
    setUpdateObject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // enabling editable

  const handleSetEditing = async () => {
    setEditing((prev) => !prev);
    await getOrganRequests({ variables: { organ: active.organ } });
    setUpdateObject(() => ({
      id: active.id,
      availabilityStatus: active.availabilityStatus || "",
      dateOfDonation: active.dateOfDonation || "",
      dateOfTransplant: active.dateOfTransplant || "",
      recipientId: requestID || active.recipientId || "",
    }));
  };

  const handleOrganUpdate = async () => {
    try {
      setUpdating(true);
      if (
        updateObject.availabilityStatus === active.availabilityStatus &&
        updateObject.dateOfDonation === active.dateOfDonation &&
        updateObject.dateOfTransplant === active.dateOfTransplant &&
        updateObject.recipientId === active.recipientId
      ) {
        throw new Error("No new updates");
      }
      await updateOrgan({
        variables: { input: updateObject },
        refetchQueries: [{ query: GET_ALL_REQUESTS }],
      });
      toast.success("Organ Updated Successfully");
      handleSetEditing();
      setActive(null);
    } catch (error) {
      console.log("Error: ", error);
      toast.error(error.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <motion.div
      layoutId={`${active.id}-${active.recipientId}`}
      ref={ref}
      className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%]  flex flex-col bg-neutral-800 sm:rounded-3xl overflow-hidden py-10"
    >
      <div className="py-4 px-8 className text-neutral-950 bg-slate-50 rounded-3xl">
        <ul>
          <motion.li
            layoutId={`id-${active.id}-${active.organ}`}
            className=" text-center text-3xl font-bold"
          >
            {active.organ}
            <motion.span layoutId={`id-${active.id}-${active.id}`}>
              {active.id}
            </motion.span>
          </motion.li>

          <li className="text-lg mb-4">
            <span className="font-bold">ID: </span>
            <motion.span layoutId={`id-${active.id}-${active.id}-span`}>
              {active.id}
            </motion.span>
          </li>

          <li className="text-lg mb-4">
            <span className="font-bold">Organ: </span>
            <motion.span layoutId={`id-${active.id}-${active.organ}-span`}>
              {active.organ}
            </motion.span>
          </li>

          <li className="text-lg mb-4">
            <span className="font-bold">Availability Status: </span>
            <motion.span
              layoutId={`id-${active.id}-${active.availabilityStatus}`}
            >
              {editing ? (
                <select
                  name="availabilityStatus"
                  value={updateObject.availabilityStatus}
                  onChange={handleSetUpdateObject}
                >
                  <option value="UNAVAILABLE">UNAVAILABLE</option>
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="ALLOCATED">ALLOCATED</option>
                  <option value="TRANSPLANTED">TRANSPLANTED</option>
                </select>
              ) : (
                active.availabilityStatus
              )}
            </motion.span>
          </li>

          <li className="text-lg mb-4">
            <span className="font-bold">Date of Donation: </span>
            <motion.span
              layoutId={`id-${active.id}-${
                active.dateOfDonation || "no-donation-date"
              }`}
            >
              {editing ? (
                <input
                  type="date"
                  name="dateOfDonation"
                  value={updateObject.dateOfDonation}
                  onChange={handleSetUpdateObject}
                />
              ) : (
                active.dateOfDonation || "Donation not Scheduled"
              )}
            </motion.span>
          </li>

          <li className="text-lg mb-4">
            <span className="font-bold">Date of Transplant: </span>
            <motion.span
              layoutId={`id-${active.id}-${
                active.dateOfTransplant || "no-transplant-date"
              }`}
            >
              {editing ? (
                <input
                  type="date"
                  name="dateOfTransplant"
                  value={updateObject.dateOfTransplant}
                  onChange={handleSetUpdateObject}
                />
              ) : (
                active.dateOfTransplant || "Transplant not Scheduled"
              )}
            </motion.span>
          </li>

          <li className="text-lg mb-4">
            <span className="font-bold">Donor ID: </span>
            <motion.span layoutId={`id-${active.id}-${active.donorId}`}>
              {active.donorId}
            </motion.span>
          </li>

          <li className="text-lg mb-4">
            <span className="font-bold">Recipient ID: </span>
            <motion.span
              layoutId={`id-${active.id}-${
                active.recipientId || "no-recipient"
              }`}
            >
              {editing ? (
                <select
                  name="recipientId"
                  value={updateObject.recipientId}
                  onChange={handleSetUpdateObject}
                >
                  {requestsData &&
                  requestsData.getRequests &&
                  requestsData.getRequests.length > 0 ? (
                    <>
                      <option value="" disabled>
                        Select a recipient
                      </option>
                      {requestsData.getRequests.map((request) => (
                        <option
                          key={request.recipient.id}
                          value={request.recipient.id}
                        >
                          {request.recipient.id +
                            " " +
                            request.recipient.name +
                            " " +
                            request.urgencyLevel}
                        </option>
                      ))}
                    </>
                  ) : (
                    <option value="" disabled>
                      No Request for the organ
                    </option>
                  )}
                </select>
              ) : (
                active.recipientId || "Recipient is to be assigned"
              )}
            </motion.span>
          </li>
        </ul>
        {!editing ? (
          <motion.button
            layoutId={`button-${active.id}-${active.id}`}
            onClick={handleSetEditing}
            className="px-4 py-2 text-sm rounded-full border-2 border-blue-500 font-bold bg-gray-100 hover:bg-blue-500 hover:text-white text-black mt-4 md:mt-0"
          >
            Edit
          </motion.button>
        ) : (
          <>
            <motion.button
              layoutId={`button-${active.id}-${active.id}`}
              onClick={handleSetEditing}
              className="px-4 py-2 text-sm rounded-full border-2 border-red-500 font-bold bg-gray-100 hover:bg-red-500 hover:text-white text-black mt-4 md:mt-0 mr-4"
              disabled={updating}
            >
              Cancle
            </motion.button>

            <motion.button
              layoutId={`button-${active.id}-${active.id}-2`}
              onClick={handleOrganUpdate}
              className="px-4 py-2 text-sm rounded-full border-2 border-green-500 font-bold bg-gray-100 hover:bg-green-500 hover:text-white text-black mt-4 md:mt-0"
              disabled={updating}
            >
              Update
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  );
});

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};
