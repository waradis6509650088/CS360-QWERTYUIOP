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
        <div className="profile">
            <div className="avatar">
                <div className="avatar-wrapper">
                    {avatarUrl ? (
                        <img
                            //src={`http://localhost:1337${user.picture.url}`}
                            src={avatarUrl}
                            //alt={`${user.username} avatar`}
                        />
                    ) : (
                        <IoPersonCircleOutline />
                    )}
                    <UploadAvatar
                        token={token}
                        //userId={user.id}
                        //username={user.username}
                        //email={user.email}
                        //job={user.job}
                        avatarUrl={avatarUrl}
                        setisUserUpdated={setisUserUpdated}
                    />
                </div>
            </div>
            <div className="body">
                <p>Name: {user.username}</p>
                <p>Email: {user.email}</p>
                <p>Job: {user.job}</p>
                
                <div className="reviews">
                    <h3>Reviews:</h3>
                    {user.reviews && user.reviews.length > 0 ? (
                        user.reviews.map((review) => (
                            <div key={review.id}>
                                <p>Content: {review.content}</p>
                                <p>Note: {review.note}</p>
                                <p>Locale: {review.locale}</p>
                            </div>
                        ))
                    ) : (
                        <p>No review</p>
                    )}
                </div>
            </div>

        </div>
    );
};

export default UserProfile;
