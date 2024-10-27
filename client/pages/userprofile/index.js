import axios from "axios";
import React, {useState, useEffect} from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import UploadAvatar from "./UploadAvatar";
import { FormGroup, Input, Label } from "reactstrap";

const UserProfile = ({ token = "your token"}) => {
   const [user, setUser] = useState({});
   const [isUserUpdated , setisUserUpdated] = useState(false);
   const [firstName, setFirstName] = useState(user.firstName || "");
   const [lastName, setLastName] = useState(user.lastName || "");
   const [email, setEmail] = useState(user.setEmail || "");
   const [job, setJob] = useState(user.setJob || "");
   const [gender, setGender] = useState(user.setGender || "");
    
   
   useEffect(() => {
    const getProfileData = async () => {
        try {
            const {data} = await axios.get(`http://localhost:1337/api/users/1?populate=*`, {
                headers: {
                    Authorization: `bearer ${token}`,
                },
            });
            setUser(data);
            setisUserUpdated(false);
        } catch (error){
            console.log({error});
        }
       };
       getProfileData()
   },[token, isUserUpdated])

   const avatarUrl = user.picture?.url ? `http://localhost:1337${user.picture.url}` : null;

   //console.log({user})   

   return (
    <div className="profile p-5 ml-10 mb-5 mt-2">
        <div className="flex">
            <div className="avatar">
                <h1 className="User-profile text-2xl text-[#e27d60] font-bold ml-2">User Profile</h1>
                <div className="avatar-wrapper mt-5">
                    {avatarUrl ? (
                        <img className="user-avatar rounded-full w-40 h-40 ml-2 -mt-5"
                            src={avatarUrl}
                        />
                    ) : (
                        <IoPersonCircleOutline />
                    )}
                    <UploadAvatar
                        token={token}
                        avatarUrl={avatarUrl}
                        setisUserUpdated={setisUserUpdated}
                    />
                </div>
            </div>

            <div className="user-information ml-5 mt-5 flex flex-col justify-center">
                <p><strong>Name:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Job:</strong> {user.job}</p>
            </div>
        </div>

        
        <div className="edit-user-information form-group-section mt-5 shadow-2xl p-4">
            <FormGroup className="flex space-x-4">
                <div className="flex-1">
                    <Label for="firstName">First Name:</Label>
                    <Input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="flex-1">
                    <Label for="lastName">Last Name:</Label>
                    <Input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
            </FormGroup>

            <FormGroup className="flex space-x-4">
                <div className="flex-1">        
                    <Label for="email">Email:</Label>
                    <Input type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="flex-1">
                <Label for="job">Job:</Label>
                <Input type="text" id="job" value={job} onChange={(e) => setJob(e.target.value)} />
                </div>
            </FormGroup>

            <FormGroup className="flex">
                <div className="w-1/2">
                    <Label for="gender">Gender:</Label>
                    <Input type="text" id="gender" value={gender} onChange={(e) => setGender(e.target.value)} />
                </div>
            </FormGroup>
        </div>
    </div>

    );
};

export default UserProfile;
