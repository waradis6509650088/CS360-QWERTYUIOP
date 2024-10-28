import { randomBytes } from 'crypto';

const findImgIdByName = async (name) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/files?filters[name][$eq]=${escape(name)}`,{
        'method':"GET",
        'headers':{
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    const data = await res.json();
    if(!res.ok){
        console.log(res.message);
        throw new Error(data.error.message);
        return;
    }
    console.log(await data);
    return data[0].id
}
const createImgIdArray = async (array) => {
    const ids = [];
    for(name in array){
        ids.push(await findImgIdByName(array[name]));
    }
    if(ids.length == 0){ throw new Error('no image id found'); };
    return ids;
}
const imageUpload = async (image,restaurantName) => {
    const imageNames = []
    if(image.length == 0){ throw new Error('no image uploaded.'); };
    try{
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
            return;
        }
        return imageNames
    }
    catch(err){
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
            console.error(data.error?.message || data.message || 'post failed');
            throw new Error(data.error.message);
        }
        alert('Restaurant added!');
    }
    catch(err){
        throw new Error(err.message);
    }
}

export { findImgIdByName, imageUpload, createImgIdArray, postRestaurant }
