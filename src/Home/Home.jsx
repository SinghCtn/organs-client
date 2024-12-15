import Organs from "../Charts/Organs";
import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import Users from "../Charts/Users";

const GET_ALL_ORGANS = gql`
  query {
    getOrgans {
      organ
    }
    getOrganRequests {
      organ
    }
    getUsers {
      userType
    }
  }
`;

const Home = () => {
  const { data } = useQuery(GET_ALL_ORGANS);
  const [userTypes, setUserTypes] = useState({ DONOR: 0, RECIPIENT: 0 });
  const [organsData, setOrgansData] = useState({
    HEART: 0,
    LUNGS: 0,
    LIVER: 0,
    KIDNEY: 0,
    PANCREAS: 0,
    INTESTINES: 0,
    CORNEA: 0,
    SKIN: 0,
    BONE: 0,
    TENDON: 0,
    HEART_VALVE: 0,
    VEINS: 0,
    ARTERIES: 0,
  });
  const [organRequestsData, setOrganRequestsData] = useState({
    HEART: 0,
    LUNGS: 0,
    LIVER: 0,
    KIDNEY: 0,
    PANCREAS: 0,
    INTESTINES: 0,
    CORNEA: 0,
    SKIN: 0,
    BONE: 0,
    TENDON: 0,
    HEART_VALVE: 0,
    VEINS: 0,
    ARTERIES: 0,
  });

  useEffect(() => {
    if (data && data.getOrgans) {
      const counts = {
        HEART: 0,
        LUNGS: 0,
        LIVER: 0,
        KIDNEY: 0,
        PANCREAS: 0,
        INTESTINES: 0,
        CORNEA: 0,
        SKIN: 0,
        BONE: 0,
        TENDON: 0,
        HEART_VALVE: 0,
        VEINS: 0,
        ARTERIES: 0,
      };
      data.getOrgans.forEach(({ organ }) => {
        if (counts[organ] !== undefined) {
          counts[organ] += 1;
        }
      });

      setOrgansData(counts);
    }
    if (data && data.getOrganRequests) {
      const counts = {
        HEART: 0,
        LUNGS: 0,
        LIVER: 0,
        KIDNEY: 0,
        PANCREAS: 0,
        INTESTINES: 0,
        CORNEA: 0,
        SKIN: 0,
        BONE: 0,
        TENDON: 0,
        HEART_VALVE: 0,
        VEINS: 0,
        ARTERIES: 0,
      };

      data.getOrganRequests.forEach(({ organ }) => {
        if (counts[organ] !== undefined) {
          counts[organ] += 1;
        }
      });

      setOrganRequestsData(counts);
    }
    if (data && data.getUsers) {
      const counts = {
        DONOR: 0,
        RECIPIENT: 0,
      };

      data.getUsers.forEach(({ userType }) => {
        if (counts[userType] !== undefined) {
          counts[userType] += 1;
        }
      });

      setUserTypes(counts);
    }
  }, [data]);

  console.log(data);

  return (
    <div className="container mx-auto p-6 bg-neutral-600 shadow-lg flex items-center justify-around">
      <div className="grid grid-cols-3">
        <div className="bg-neutral-200 p-4 shadow-md flex flex-col items-center justify-between">
          <Organs
            organData={Object.keys(organsData).map((key) => organsData[key])}
          />
          <div className="text-xl font-bold">Organs</div>
        </div>
        <div className="bg-neutral-200 p-4 shadow-md flex flex-col items-center justify-between">
          <Organs
            organData={Object.keys(organRequestsData).map(
              (key) => organRequestsData[key]
            )}
          />
          <div className="text-xl font-bold">Organ Requests</div>
        </div>
        <div className="bg-neutral-200 p-4 shadow-md flex flex-col items-center justify-between">
          <Users userData={userTypes} />
          <div className="text-xl font-bold">Users</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
