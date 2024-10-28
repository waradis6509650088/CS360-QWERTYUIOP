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
        throw new Error('Error occur while fetching image.');
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
    return ids;
}
const imageUpload = async (image) => {
    const imageNames = []
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
        return imageNames
    }
    catch(err){
        console.error(err);
    }
};
//post to restaurant api
const postRestaurant = async (postData) => {
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
            alert(`error: ${data.error.message}`);
        }
        else{
            console.log(res);
            console.log('post success');
        }
    }
    catch(err){
        console.error(err);
    }
}

export { findImgIdByName, imageUpload, createImgIdArray, postRestaurant }
