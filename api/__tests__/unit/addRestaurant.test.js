const { findImgIdByName, imageUpload, createImgIdArray, postRestaurant } = require('../../../client/pages/restaurants/add/submit.js');

describe('Add restaurant function Unit Test', () => {
    afterEach(() => {
        jest.clearAllMocks(); 
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    global.fetch = jest.fn((api, header) => {
        if(!api.includes(escape('wrong_image_name'))){
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    //value to return when fetch
                    0:{
                        'id': 123
                    }
                })
            });
        }
        return Promise.reject({
            json: () => Promise.reject({
                //value to return when fetch
                ok: false,
                message:'image not found'
            })
        });
    });

    global.localStorage = {
        'getItem': jest.fn((e) => {
            if(e == 'token'){ 
                return "mockToken";
            }
            return null
        })
    }
        
    describe('function: findImgIdByName', () => {

        it('should throw error when name not found', async () => {
            const name = 'wrong_image_name';
            await expect(async () => await findImgIdByName(name)).rejects.toThrow();
        });

        it('should return image id when name is found', async () => {
            const name = 'correct_image_name';
            const correctId = 123
            const imageId = await findImgIdByName(name);
            expect(imageId).toBe(correctId);
        });
    });
    
    describe('function: createImgIdArray', () => {
        it('should return array of image id when input is array of image names', async () => {
            const imgNameArray = ['name1','name2','name3']
            const correctIdArray = [123,123,123]
            const imgIdArray = await createImgIdArray(imgNameArray);
            expect(imgIdArray).toEqual(correctIdArray);
        });

        it('should throw error when input array length = 0', async () => {
            const imgNameArray = []
            await expect(async () => await createImgIdArray(imgNameArray)).rejects.toThrow();
        });
    });

    describe('function: imageUpload', () => {
    });
});
