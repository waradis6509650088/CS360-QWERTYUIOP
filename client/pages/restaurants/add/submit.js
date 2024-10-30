const { randomBytes } = require('crypto');

const findImgIdByName = async (name) => {
    try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/files?filters[name][$eq]=${escape(name)}`,{
            'method':"GET",
            'headers':{
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        if(!res.ok){
            throw new Error(JSON.stringify(res.message));
        }
        const data = await res.json();
        return data[0].id
    }
    catch(err){
        throw new Error(err);
    }
}

const createImgIdArray = async (array) => {
    //array = array of unique image name on server
    const ids = [];
    try{
        if(array.length == 0){ throw new Error('no image id found'); };
        for(let i = 0; i < array.length; i++){
            ids.push(await findImgIdByName(array[i]));
        }
    }
    catch(err){
        throw new Error(err.message);
    }
    return ids;
}

const imageUpload = async (image, restaurantName) => {
    // image is html file input array
    const imageNames = []
    try{
        if(image.length == 0){ throw new Error('no image uploaded.'); };
        const form = new FormData();
        for(let i = 0; i < image.length && i < 5; i++){
            const randomStr = randomBytes(10).toString('hex');
            const fileName = `${restaurantName}_image_${randomStr}_${image[i].name.split(".").filter(Boolean).slice(1).join(".")}`
            form.append('files', image[i], fileName);
            imageNames.push(fileName);
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`,{
            method: 'POST',
            contentType: "image",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: form
        });
        if(!res.ok){
            throw new Error('Error occur while uploading images.');
        }
        return imageNames
    }
    catch(err){
        //console.log(err.message);
        throw new Error(err.message);
    }
};
//post to restaurant api
const postRestaurant = async (postData) => {
    if (!postData.data.name) {
        throw new Error('missing request data "name".');
    }
    if (!postData.data.price) {
        throw new Error('missing request data "price".');
    }
    if (!postData.data.category) {
        throw new Error('missing request data "category".');
    }
    if (!postData.data.place) {
        throw new Error('missing request data "place".');
    }
    if (!postData.data.information) {
        throw new Error('missing request data "information".');
    }
    if (!postData.data.information.description) {
        throw new Error('missing request data "information.description".');
    }
    if (!postData.data.information.opening_hours || postData.data.information.opening_hours.length === 0) {
        throw new Error('missing request data "information.opening_hours".');
    }
    if (!postData.data.information.location) {
        throw new Error('missing request data "information.location".');
    }
    if (!postData.data.information.location.address) {
        throw new Error('missing request data "information.location.address".');
    }
    if (!postData.data.information.location.website) {
        throw new Error('missing request data "information.location.website".');
    }
    if (!postData.data.information.location.phone) {
        throw new Error('missing request data "information.location.phone".');
    }
    if (!postData.data.socialNetworks || postData.data.socialNetworks.length === 0) {
        throw new Error('missing request data "socialNetworks".');
    }

    // call add restaurant api
    try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(postData)
        });

        const data = await res.json();
        if(!res.ok){
            throw new Error(`API Error:${data.error.message}`);
        }
        alert('Restaurant added!');
    }
    catch(err){
        //console.error(err.message);
        throw new Error(err.message);
    }
}

module.exports = { findImgIdByName, imageUpload, postRestaurant, createImgIdArray };
