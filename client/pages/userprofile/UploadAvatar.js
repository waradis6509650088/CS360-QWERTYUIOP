import React, {useState, useEffect} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const UploadAvatar = ({ userId, token, username, setisUserUpdated }) => {
    const [modal, setModal] = useState(false);
    const [file, setFile] = useState(null);

    const toggle = () => {
        setModal(!modal);
    };

    const handleFileChange = ({ target: { files }}) => {
        if (files?.length){
            const { type } = files[0];
            if(type === "image/png" || type === "image/jpg"){
                setFile(files[0]);
            } else{
                toast.error("Accept only png and jpeg image types",{
                    hideprogessBar: true,
                });
                
            }
        }
    };

    const updaterUserProfile = async (pictureId) => {
        try {
            await axios.put(
                //`http://localhost:1337/api/users/1`,
                `http://localhost:1337/api/users/${userId}`,
                { picture: pictureId}, //ส่ง ID ของ media
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `bearer ${token}`,
                    },
                }
            );
            setisUserUpdated(true);
        } catch (error) {
            console.log( "Error updating user profile:" ,error );
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            toast.error("File is required", {
                hideprogessBar: true,
            });
            return;
        }

        try {
            const files = new FormData();
            files.append("files", file);
            files.append("name", `${username} avatar`);

            const {
                data: [{ id }],
            } = await axios.post(`http://localhost:1337/api/upload`, files, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `bearer ${token}`,
                },
            });
            await updaterUserProfile(id); //Update field picture ของ user
            setFile(null);
            setModal(false);

        } catch (error) {
            console.log({ error });
        }
    };

    const[isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    return ( 
    <div className="Change-picture mt-2 ml-6 ">
        {isClient && (
            <Button size="sm" onClick={toggle} style={{ backgroundColor:'#e27d60', color: 'white', border: 'none'}}>
                Change picture
            </Button>
        )}  
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Upload your picture </ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="exampleFile">File</Label>
                            <Input
                                type="file"
                                name="file"
                                id="exampleFile"
                                onChange={handleFileChange}
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter >
                    <Button onClick={handleSubmit}>
                        Upload
                    </Button>{" "}
                    <Button onClick={toggle}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
    </div>
    );
};

export default UploadAvatar;