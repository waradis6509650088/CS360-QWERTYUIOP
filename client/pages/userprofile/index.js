import axios from "axios";
import React, {useState, useEffect} from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import UploadAvatar from "./UploadAvatar";
import { Button, FormGroup, Input, Label } from "reactstrap";
import { toast } from "react-toastify";
//import Layout from '../../components/layout';


const UserProfile = ({ token }) => {
   const [user, setUser] = useState({});
   const [isUserUpdated , setisUserUpdated] = useState(false);
   const [firstName, setFirstName] = useState(user.setfirstname || "");
   const [lastName, setLastName] = useState(user.setlastname || "");
   const [email, setEmail] = useState(user.setemail || "");
   const [job, setJob] = useState(user.setjob || "");
   const [gender, setGender] = useState(user.setgender || "");
   
   useEffect(() => {
    const getProfileData = async () => {
        try {                              //http:localhost:1337/api/users/me http://localhost:1337/api/users/1?populate=*
            const {data} = await axios.get(`http://localhost:1337/api/users/me?populate=*`, {
                headers: {
                    Authorization: `bearer ${token}`,
                },
            });
            setUser(data);
            setFirstName(data.firstname || "");
            setLastName(data.lastname || "");
            setEmail(data.email || "");
            setJob(data.job || "");
            setGender(data.gender || "");
            setisUserUpdated(false);
        } catch (error){
            console.log({error});
        }
       };
       getProfileData()
   },[token, isUserUpdated])

   const avatarUrl = user.picture?.url ? `http://localhost:1337${user.picture.url}` : null;

   const handleUpdateInfo = async () => {
    try {
        const updateInfo = {
            firstname: firstName,
            lastname: lastName,
            email: email,
            job: job,
            gender: gender,
        };              //http:localhost:1337/api/users/me
        await axios.put(`http://localhost:1337/api/users/me`, updateInfo, {
            headers: {
                Authorization: `Bearer ${token},`
            },
        });
        toast.success("Profile updated successfully");
        setisUserUpdated(true);
    } catch (error){
        console.log({ error });
    }
   } 

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

                <Button onClick={handleUpdateInfo} style={{ backgroundColor: '#e27d60', color: 'white', border: 'none'}} className="mt-4">
                    Edit
                </Button>
            </div>
        </div>
    );
};

export default UserProfile;
export { UserProfile };