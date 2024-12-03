import delve from 'dlv';
import { useState } from 'react';
import { useQuery } from 'react-query';
import Layout from '../../../components/layout';
import NoResults from '../../../components/no-results';
import RestaurantCard from '../../../components/pages/restaurant/RestaurantCard';
import BlockManager from '../../../components/shared/BlockManager';
import Container from '../../../components/shared/Container';
import Header from '../../../components/shared/Header';
import { getData, getRestaurants, getStrapiURL } from '../../../utils';
import { getLocalizedParams } from '../../../utils/localize';
import { findImgIdByName, imageUpload, createImgIdArray, postRestaurant } from '../../../utils/submit.js'
import slugify from 'slugify';
import Router from 'next/router'

const AddRestaurants = ({
    global,
    initialData,
    pageData,
    categories,
    places,
    locale,
    perPage,
    preview,
}) => {
    const [placeId, setPlaceId] = useState(null);
    const [categoryId, setCategoryId] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const blocks = delve(pageData, 'attributes.blocks');
    const header = delve(pageData, 'attributes.header');
    const placeText = delve(pageData, 'attributes.placeText');
    const categoryText = delve(pageData, 'attributes.categoryText');

    const [restaurantName, setRestaurantName] = useState("");
    const [priceRange, setPriceRange] = useState("");
    const [foodCategory, setFoodCategory] = useState("");
    const [restaurantDesc, setRestaurantDesc] = useState("");
    const [resAddress, setResAddress] = useState("");
    const [resWebsite, setResWebsite] = useState("");
    const [resPhone, setResPhone] = useState("");
    const [openDay, setOpenDay] = useState("");
    const [openHour, setOpenHour] = useState("");
    const [closeHour, setCloseHour] = useState("");
    const [facebook, setFacebook] = useState("");
    const [instagram, setInstagram] = useState("");
    const [image, setImage] = useState(null);

    const { data, status } = useQuery(
        [
            'restaurants',
            { category: categoryId },
            { place: placeId },
            { locale: locale },
            { page: pageNumber },
            { perPage },
        ],
        getRestaurants,
        {
            initialData,
        }
    );

    // need permission => restaurant/create, upload/upload, upload/find
    //
    // TODO: 
    // - display checkmark on upload field after file was uploaded; 
    // - enable user to upload up to 5 images; 
    // - display preview of uploaded images;
    // - add landing page after the form was submitted;
    // - enable user to add more opening times;
    // - enable user to add more social medias;
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            if(image.length == null){
                alert('please add at least 1 image of your restaurant');
                return;
            }
            const imageNames = await imageUpload(image,slugify(restaurantName.toLowerCase()));
            const imgIdArray = await createImgIdArray(imageNames);
            // form request json
            const postData = {
                "data":{
                    "images": imgIdArray,
                    "name":restaurantName,
                    "slug":slugify(restaurantName.toLowerCase()),
                    "price":priceRange,
                    "category":foodCategory,
                    "place": 1,
                    "information":{
                        "description": restaurantDesc,
                        "opening_hours":[
                            {
                                "day_interval":openDay,
                                "opening_hour":openHour,
                                "closing_hour":closeHour
                            }
                        ],
                        "location":{
                            "address":resAddress,
                            "website":resWebsite,
                            "phone":resPhone
                        }
                    },
                    "socialNetworks":[
                        {
                            "platform":"Instagram",
                            "url":instagram
                        },
                        {
                            "platform":"Facebook",
                            "url":facebook
                        }
                    ],
                    "blocks":[
                    ],
                    "seo":{
                        "metaTitle": restaurantName,
                        "metaDescription": restaurantDesc
                    }


                }
            }
            await postRestaurant(postData);
            Router.push('/restaurants/');

        }
        catch(err){
            alert(err.message);
        }
    };

    return (
        <Layout
            global={global}
            pageData={pageData}
            type="restaurant-page"
            preview={preview}
        >
        <Container>
        <br/>
        <form id="restaurantForm" onSubmit={handleSubmit}>
        <header className="block text-3xl">Add a restaurant</header>
        <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
        <div className="grid md:grid-cols-3 md:gap-6"> 
            <div>
                <label htmlFor="restaurantName" className="ml-1 text-1xl">Name</label>
                <input
                type="text"
                id="restaurantName"
                name="restaurantName"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="What is the name of your restaurant?"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                required
                /> 
            </div> 
            <div>
            <label htmlFor="priceRange" className="ml-1 text-1xl">Price</label>
            <select
                id="priceRange"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
            >
                <option value="" defaultValue disabled>Choose your price range</option>
                <option value="p1">Inexpensive</option>
                <option value="p2">Average</option>
                <option value="p3">Expensive</option>
                <option value="p4">Very expensive</option>
            </select>
            </div> 
            <div>
            <label htmlFor="foodCategory" className="ml-1 text-1xl">Category</label>
            <select
                id="foodCategory"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={foodCategory}
                onChange={(e) => setFoodCategory(e.target.value)}
            >
                <option value="" defaultValue disabled>What kind of food do you have?</option>
                <option value="5">American</option>
                <option value="13">Chinese</option>
                <option value="12">Dinner Bar</option>
                <option value="4">European</option>
                <option value="11">French</option>
                <option value="3">International</option>
                <option value="10">Lebanese</option>
                <option value="6">Michelin</option>
                <option value="9">Russian</option>
                <option value="8">Vietnamese</option>
            </select>
            </div> 
        </div> 
        <br/>
        <div className="grid md:grid-cols-2 md:gap-6">
        <div>
        <label htmlFor="restaurantDesc" className="ml-1 text-1xl">Description</label>
        <textarea
            id="restaurantDesc"
            rows="3"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Tell us more about your restaurant..."
            value={restaurantDesc}
            onChange={(e) => setRestaurantDesc(e.target.value)}
        />
        <br/>
        <label htmlFor="resAddress" className="mt-4 ml-1 text-1xl">Address</label>
        <div className="grid md:grid-cols-3 md:gap-4">
            <input
                type="text"
                id="resAddress"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Your restaurant address"
                value={resAddress}
                onChange={(e) => setResAddress(e.target.value)}
                required
            /> 
            <input
                type="text"
                id="resWebsite"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Website"
                value={resWebsite}
                onChange={(e) => setResWebsite(e.target.value)}
            /> 
            <input
                type="text"
                id="resPhone"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Phone"
                value={resPhone}
                onChange={(e) => setResPhone(e.target.value)}
                required
            /> 
            </div>
            <br/>
            <label htmlFor="openDay" className="ml-1 text-1xl">Opening hours</label>
            <div className="grid md:grid-cols-3 md:gap-4">
            <input
                type="text"
                id="openDay"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Which day of the week?"
                value={openDay}
                onChange={(e) => setOpenDay(e.target.value)}
                required
            /> 
            <input
                type="text"
                id="openHour"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="When do you open?"
                value={openHour}
                onChange={(e) => setOpenHour(e.target.value)}
            /> 
            <input
                type="text"
                id="closeHour"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="When do you close?"
                value={closeHour}
                onChange={(e) => setCloseHour(e.target.value)}
                required
            /> 
            </div>
            <br/>
            <label className="ml-1 text-1xl">Social media</label>
            <div className="grid md:grid-cols-2 md:gap-3">
            <input
                type="text"
                id="facebook"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Facebook"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
            /> 
            <input
                type="text"
                id="instagram"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Instagram"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                required
            /> 
            </div>
        </div> 
        <div className="items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="ml-1 text-1xl">Upload an image</label>
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-96 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <label className="text-3xl text-gray-500">Show us your restaurant!</label>
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-10 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, or JPG</p>
                </div>
                <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    onChange={(e)=>{setImage(e.target.files)}}
                />
                </label>
            </div> 
        </div>
        <button type="submit" className="py-2 px-6 bg-primary hover:bg-primary-darker text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md rounded-full hidden lg:flex">Submit</button>
        <br/>
        </form>
        </Container>
        <BlockManager
            blocks={blocks}
            type="singleType"
            contentType="restaurant-page"
            pageData={pageData}
        />
        </Layout>
    );
}

// This gets called on every request
export async function getServerSideProps(context) {
    const { locale } = getLocalizedParams(context.query);

    const data = getData(
        null,
        locale,
        'restaurant-page',
        'singleType',
        context.preview
    );

    try {
        const resRestaurantPage = await fetch(delve(data, 'data'));
        const restaurantPage = await resRestaurantPage.json();
        const perPage = delve(restaurantPage, 'restaurantsPerPage') || 12;

        const resRestaurants = await fetch(
            getStrapiURL(
                `/restaurants?pagination[limit]=${perPage}&locale=${locale}&pagination[withCount]=true&populate=images,place,category,header`
            )
        );
        const restaurants = await resRestaurants.json();

        const resCategories = await fetch(
            getStrapiURL(`/categories?pagination[limit]=99`)
        );
        const categories = await resCategories.json();

        const resPlaces = await fetch(getStrapiURL(`/places?pagination[limit]=99`));
        const places = await resPlaces.json();

        if (
            !restaurants.data.length ||
            !categories.data.length ||
            !places.data.length
        ) {
            return handleRedirection(slug, context.preview, '');
        }

        return {
            props: {
                initialData: {
                    restaurants: restaurants.data,
                    count: restaurants.meta.pagination.total,
                },
                pageData: restaurantPage.data,
                categories: categories.data,
                places: places.data,
                locale,
                perPage,
                preview: context.preview || null,
            },
        };
    } catch (error) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }
}

export default AddRestaurants;
