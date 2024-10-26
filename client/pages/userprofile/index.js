import axios from "axios";
import React, {useState, useEffect} from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import UploadAvatar from "./UploadAvatar";

const UserProfile = ({ token = "your token"}) => {
   const [user, setUser] = useState({});
   const [isUserUpdated , setisUserUpdated] = useState(false);
    
   
   useEffect(() => {
    const getProfileData = async () => {
        try {
            const {data} = await axios.get(`http://localhost:1337/api/users/me`, {
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

   console.log({user})
   
   return (
        <div className="profile">
            <div className="avatar">
                <div className="avatar-wrapper">
                    {user.avatarUrl ? (
                        <img
                            src={`http://localhost:1337${user.avatarUrl}`}
                            alt={`${user.username} avatar`}
                        />
                    ) : (
                        <IoPersonCircleOutline />
                    )}
                    <UploadAvatar
                        token={token}
                        userId={user.id}
                        username={user.username}
                        //email={user.email}
                        //job={user.job}
                        avatarUrl={user.avatarUrl}
                        setisUserUpdated={setisUserUpdated}
                    />
                </div>
            </div>
            <div className="body">
                <p>Name: {user.username}</p>
                <p>Email: {user.email}</p>
                <p>Account: Not blocked</p>
            </div>

        </div>
    );
};

export default UserProfile;

/*import axios from "axios";
import React, { useState, useEffect } from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import UploadAvatar from "./UploadAvatar";

const UserProfile = ({ token }) => {
   const [user, setUser] = useState({
       avatarUrl: '',
       username: '',
       email: '',
       job: '',
       id: null,
   });
   const [isUserUpdated, setIsUserUpdated] = useState(false);

   useEffect(() => {
       const getProfileData = async () => {
           try {
               const { data } = await axios.get(`http://localhost:1337/api/users/me`, {
                   headers: {
                       Authorization: `bearer ${token}`,
                   },
               });
               setUser(data);
               setIsUserUpdated(false);
           } catch (error) {
               console.log({ error });
           }
       };
       getProfileData();
   }, [token, isUserUpdated]);

   return (
       <div className="profile">
           <div className="avatar">
               <div className="avatar-wrapper">
                   {user && user.avatarUrl ? (
                       <img
                           src={`http://localhost:1337${user.avatarUrl}`}
                           alt={`${user.username} avatar`}
                       />
                   ) : (
                       <IoPersonCircleOutline />
                   )}
                   <UploadAvatar
                       token={token}
                       userId={user.id}
                       username={user.username}
                       email={user.email}
                       job={user.job}
                       avatarUrl={user.avatarUrl}
                       setisUserUpdated={setIsUserUpdated}
                   />
               </div>
           </div>
           <div className="body">
               <p>Name: {user.username || "N/A"}</p>
               <p>Email: {user.email || "N/A"}</p>
               <p>Account: {user.isBlocked ? "Blocked" : "Not blocked"}</p>
           </div>
       </div>
   );
};

export default UserProfile;*/
