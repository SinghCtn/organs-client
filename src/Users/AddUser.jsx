import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { toast } from "react-hot-toast";
import { BottomGradient, LabelInputContainer } from "./CreateAdmin";
import { Label } from "@radix-ui/react-label";
import { Input } from "../components/UI/Input";
import { Select } from "../components/UI/Select";
import { useNavigate } from "react-router-dom";
import { GET_ALL_USERS } from "./Users";

const ADD_USER = gql`
  mutation Mutation($input: UserInput) {
    addUser(input: $input) {
      id
      name
      dob
      gender
      bloodGroup
      phone
      email
      userType
      ... on Donor {
        donationOrgans {
          id
          organ
          donorId
          availabilityStatus
          dateOfDonation
          dateOfTransplant
          recipientId
        }
      }
      ... on Recipient {
        requestedOrgans {
          id
          organ
          recipientId
          urgencyLevel
          organId
        }
      }
    }
  }
`;

const organs = [
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

const urgencyLevels = ["LOW", "MODERATE", "HIGH", "EMERGENCY"];

const availabilityStatus = ["UNAVAILABLE", "AVAILABLE"];

function AddUser() {
  const navigate = useNavigate();
  const [addUser, { data, loading, error }] = useMutation(ADD_USER);

  const [userType, setUserType] = useState("");

  const [userData, setUserData] = useState({
    name: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState({});

  const [requestedOrgans, setRequestedOrgans] = useState({});

  const [donationOrgans, setDonationOrgans] = useState({});

  const handleSetUserData = (e) => {
    setUserData((prev) => {
      const { name, value } = e.target;
      return { ...prev, [name]: value };
    });
    setErrors((prev) => {
      const { name } = e.target;
      return {
        ...prev,
        [name]: "",
      };
    });
  };

  const handleSetUserType = (e) => {
    setUserType(e.target.value);
    setDonationOrgans({});
    setRequestedOrgans({});
    setErrors((prev) => ({ ...prev, userType: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!userData.name) newErrors.name = "Name is required";
    if (!userData.dob) newErrors.dob = "Date of Birth is required";
    if (!userData.gender) newErrors.gender = "Gender is required";
    if (!userData.bloodGroup) newErrors.bloodGroup = "Blood group is required";
    if (!userData.phone) {
      newErrors.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(userData.phone)) {
      newErrors.phone = "Phone number must be 10 digit number";
    }
    if (!userData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(userData.email)) {
      newErrors.email = "Email is not valid";
    }
    if (!userType) newErrors.userType = "User Type must be specified";
    if (userType === "DONOR") {
      // check because no organs for donation could be a case.
      if (Object.keys(donationOrgans).length > 0) {
        Object.keys(donationOrgans).map((organ) => {
          if (donationOrgans[organ] === "")
            newErrors.donations =
              "Availability status for all donated organs is required";
        });
      }
    }

    if (userType === "RECIPIENT") {
      // check because no organs for REQUEST could be a case.
      if (Object.keys(requestedOrgans).length > 0) {
        Object.keys(requestedOrgans).map((organ) => {
          if (requestedOrgans[organ] === "")
            newErrors.requests =
              "Urgency level for all requested organs is required";
        });
      }
    }

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      const MutationArguments = {
        name: userData.name,
        dob: userData.dob,
        gender: userData.gender,
        bloodGroup: userData.bloodGroup,
        phone: userData.phone,
        email: userData.email,
        userType,
      };

      if (MutationArguments.userType === "DONOR")
        MutationArguments.inputDonationOrgans = Object.keys(donationOrgans).map(
          (organ) => ({
            organ,
            availabilityStatus: donationOrgans[organ],
          })
        );

      if (MutationArguments.userType === "RECIPIENT")
        MutationArguments.inputRequestedOrgans = Object.keys(
          requestedOrgans
        ).map((organ) => ({
          organ,
          urgencyLevel: requestedOrgans[organ],
        }));

      try {
        const res = await addUser({
          variables: { input: MutationArguments },
          refetchQueries: [{ query: GET_ALL_USERS }],
        });
        if (res) {
          toast.success("User added successfully");
        }
        setUserData({
          name: "",
          dob: "",
          gender: "",
          bloodGroup: "",
          phone: "",
          email: "",
        });
        setUserType("");
        setDonationOrgans({});
        setRequestedOrgans({});
        navigate("/view_users");
      } catch (error) {
        console.log("Error: ", error);
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="flex items-center justify-center w-full text-sm">
      <div className="max-w-6xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-neutral-900">
        <h2 className="font-bold text-xl text-neutral-200">Add User</h2>
        <form className="text-neutral-200" onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-x-5">
            <LabelInputContainer>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Tyler"
                type="text"
                name="name"
                value={userData.name}
                onChange={handleSetUserData}
                className="h-8"
              />
              {errors.name && <ErrorBlock error={errors.name} />}
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                name="dob"
                value={userData.dob}
                onChange={handleSetUserData}
                className="h-8"
              />
              {errors.dob && <ErrorBlock error={errors.dob} />}
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="gender">Gender</Label>
              <Select
                id="gender"
                name="gender"
                value={userData.gender}
                onChange={handleSetUserData}
                className="h-8"
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Others</option>
              </Select>{" "}
              {errors.gender && <ErrorBlock error={errors.gender} />}
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="phone">Phone</Label>
              <div className="flex items-baseline">
                <div className="text-lg pr-3">+91</div>
                <div className="w-full">
                  <Input
                    id="phone"
                    placeholder="9876543210"
                    type="text"
                    name="phone"
                    value={userData.phone}
                    onChange={handleSetUserData}
                    className="h-8"
                  />
                </div>
              </div>

              {errors.phone && <ErrorBlock error={errors.phone} />}
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="email">Email </Label>
              <Input
                id="email"
                placeholder="projectmayhem@fc.com"
                type="email"
                name="email"
                value={userData.email}
                onChange={handleSetUserData}
                className="h-8"
              />{" "}
              {errors.email && <ErrorBlock error={errors.email} />}
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="bloodGroup">Blood Group</Label>
              <Select
                id="bloodGroup"
                name="bloodGroup"
                value={userData.bloodGroup}
                onChange={handleSetUserData}
                className="h-8"
              >
                <option value="" disabled>
                  Select a blood group
                </option>
                <option value="A_POSITIVE">A+</option>
                <option value="A_NEGATIVE">A-</option>
                <option value="B_POSITIVE">B+</option>
                <option value="B_NEGATIVE">B-</option>
                <option value="AB_POSITIVE">AB+</option>
                <option value="AB_NEGATIVE">AB-</option>
                <option value="O_POSITIVE">O+</option>
                <option value="O_NEGATIVE">O-</option>
              </Select>{" "}
              {errors.bloodGroup && <ErrorBlock error={errors.bloodGroup} />}
            </LabelInputContainer>
          </div>
          <div>
            <h2 className="my-2 text-lg font-bold">Specific Details</h2>
            <LabelInputContainer>
              <Label htmlFor="userType">User Type</Label>
              <Select
                id="userType"
                value={userType}
                name="userType"
                onChange={handleSetUserType}
                className="h-8"
              >
                <option value="" disabled>
                  Select user Type
                </option>
                <option vlaue="DONOR">DONOR</option>
                <option value="RECIPIENT">RECIPIENT</option>
              </Select>
              {errors.userType && <ErrorBlock error={errors.userType} />}
            </LabelInputContainer>
            {userType === "" ? null : userType === "DONOR" ? (
              <DonationOrgans
                setDonationOrgans={setDonationOrgans}
                donationOrgans={donationOrgans}
                error={errors.donations ? errors.donations : null}
                setErrors={setErrors}
              />
            ) : (
              <RequiredOrgans
                setRequestedOrgans={setRequestedOrgans}
                requestedOrgans={requestedOrgans}
                error={errors.requests ? errors.requests : null}
                setErrors={setErrors}
              />
            )}
          </div>

          <button
            className="mt-6 bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Add User
            <BottomGradient />
          </button>
        </form>
      </div>
    </div>
  );
}

function ErrorBlock({ error }) {
  return (
    <span className="inline-block h-6 text-xs text-red-400 font-semibold">
      {error}
    </span>
  );
}

function DonationOrgans({
  donationOrgans,
  setDonationOrgans,
  error,
  setErrors,
}) {
  const handleCheckboxChange = (e) => {
    const organ = e.target.value;
    const isChecked = e.target.checked;
    setErrors((prev) => ({
      ...prev,
      donations: "",
    }));

    setDonationOrgans((prev) => {
      if (isChecked) {
        return { ...prev, [organ]: "" };
      } else {
        const { [organ]: _, ...rest } = prev;
        return rest;
      }
    });
  };

  const handleSelectChange = (e, organ) => {
    const availability = e.target.value;
    setErrors((prev) => ({
      ...prev,
      donations: "",
    }));

    setDonationOrgans((prev) => ({
      ...prev,
      [organ]: availability,
    }));
  };

  return (
    <div>
      <LabelInputContainer>Donation Organs:</LabelInputContainer>
      <br />
      <div name="donations" className="grid grid-cols-3 gap-x-5 gap-y-3">
        {organs.map((organ) => (
          <div key={organ} className="">
            <Label className="p-2">
              <input
                type="checkbox"
                value={organ}
                checked={donationOrgans.hasOwnProperty(organ)}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <span className="inline-block w-40">{organ}</span>
            </Label>
            <Select
              name={organ}
              value={donationOrgans[organ] || ""}
              onChange={(e) => handleSelectChange(e, organ)}
              disabled={!donationOrgans.hasOwnProperty(organ)}
              className="h-8" // Disable the dropdown if the organ is not selected
            >
              <option value="" disabled>
                select
              </option>
              {availabilityStatus.map((status) => (
                <option value={status} key={status}>
                  {status}
                </option>
              ))}
            </Select>
          </div>
        ))}
      </div>
      {error && <ErrorBlock error={error} />}
    </div>
  );
}

function RequiredOrgans({
  setRequestedOrgans,
  requestedOrgans,
  error,
  setErrors,
}) {
  const handleCheckboxChange = (e) => {
    const organ = e.target.value;
    const isChecked = e.target.checked;

    setErrors((prev) => ({
      ...prev,
      requests: "",
    }));

    setRequestedOrgans((prev) => {
      if (isChecked) {
        return { ...prev, [organ]: "" };
      } else {
        const { [organ]: _, ...rest } = prev;
        return rest;
      }
    });
  };

  const handleSelectChange = (e, organ) => {
    const urgency = e.target.value;
    setRequestedOrgans((prev) => ({ ...prev, [organ]: urgency }));
    setErrors((prev) => ({
      ...prev,
      requests: "",
    }));
  };

  return (
    <div>
      <LabelInputContainer>Required Organs:</LabelInputContainer>
      <br />
      <div name="requests" className="grid grid-cols-3 gap-x-5 gap-y-3">
        {organs.map((organ) => (
          <div key={organ} className="">
            <Label className="p-2">
              <input
                type="checkbox"
                value={organ}
                checked={requestedOrgans.hasOwnProperty(organ)}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <span className="inline-block w-40">{organ}</span>
            </Label>

            <Select
              value={requestedOrgans[organ] || ""}
              disabled={!requestedOrgans.hasOwnProperty(organ)}
              onChange={(e) => handleSelectChange(e, organ)}
              className="h-8"
            >
              <option value="" disabled>
                select
              </option>
              {urgencyLevels.map((level) => (
                <option value={level} key={level}>
                  {level}
                </option>
              ))}
            </Select>
          </div>
        ))}
      </div>
      {error && <ErrorBlock error={error} />}
    </div>
  );
}

export default AddUser;
