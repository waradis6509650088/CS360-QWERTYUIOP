const { findImgIdByName, imageUpload, createImgIdArray, postRestaurant } = require('../../../client/pages/restaurants/add/submit.js');

describe('Add restaurant function Unit Test',() => {
    afterEach(() => {
        jest.clearAllMocks(); 
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });
        
    describe('function: findImgIdByName',() => {
        global.fetch = jest.fn(() => {
            return Promise.resolve({
                json: () => Promise.resolve({
                    //value to return when fetch
                    'ok': true
                });
            });
        });

        global.localStorage.getItem = jest.fn((e) => {
            if(e == 'token'){ 
                return "mockTokenReturn";
            }
            return null
        });

        it('should throw error when name not found', () => {
            expect(findImgIdByName('example_non_existing_restaurant_image')).toThrow();
        });
    });
});
