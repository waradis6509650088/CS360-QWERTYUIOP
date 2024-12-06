const { findImgIdByName, imageUpload, createImgIdArray, postRestaurant } = require('../../utils/submit.js');

describe('Add restaurant function Unit Test', () => {

    describe('function: findImgIdByName', () => {
        afterAll(() => {
            jest.clearAllMocks();
            jest.restoreAllMocks();
        });

        beforeAll(() => {
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
        });

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
        afterAll(() => {
            jest.clearAllMocks();
            jest.restoreAllMocks();
        });
        beforeAll(() => {
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
        });
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

    describe('imageUpload', () => {
        afterAll(() => {
            jest.clearAllMocks();
            jest.restoreAllMocks();
        });
        beforeAll(() => {
            global.fetch = jest.fn();
            global.localStorage = {
                getItem: jest.fn(() => 'mockedToken')
            };

            global.File = class MockFile {
                constructor(chunks, filename, options) {
                    this.chunks = chunks;
                    this.name = filename;
                    this.type = options.type;
                    this.size = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
                }
            };
            global.FormData = class {
                constructor() {
                    this.entries = [];
                }

                append(key, value) {
                    this.entries.push([key, value]);
                }
            };
        });
        const restaurantName = 'TestRestaurant';

        beforeEach(() => {
            fetch.mockClear();
            global.localStorage.getItem.mockClear();
        });

        test('should throw an error if no image is uploaded', async () => {
            await expect(imageUpload([], restaurantName)).rejects.toThrow('no image uploaded.');
        });

        test('should upload up to 5 images with correctly formatted names', async () => {
            const images = Array.from({ length: 5 }, (_, i) => new File(['content'], `test${i + 1}.jpg`, { type: 'image/jpeg' }));
            const formAppendMock = jest.spyOn(FormData.prototype, 'append');
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true })
            });

            const result = await imageUpload(images, restaurantName);

            expect(formAppendMock).toHaveBeenCalledTimes(5);
            expect(fetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, expect.objectContaining({
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer mockedToken'
                },
                body: expect.any(FormData)
            }));
            expect(result).toHaveLength(5);
            result.forEach((fileName, index) => {
                expect(fileName).toEqual(expect.stringContaining('TestRestaurant_image_'));
            });
        });

        test('should limit image uploads to 5 files', async () => {
            const images = Array.from({ length: 7 }, (_, i) => new File(['content'], `test${i + 1}.jpg`, { type: 'image/jpeg' }));
            const formAppendMock = jest.spyOn(FormData.prototype, 'append');
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true })
            });

            const result = await imageUpload(images, restaurantName);

            expect(result).toHaveLength(5);
        });

        test('should throw an error if the API response is not ok', async () => {
            const images = [new File(['content'], 'test.jpg', { type: 'image/jpeg' })];
            fetch.mockResolvedValueOnce({
                ok: false,
                json: async () => ({ message: 'Upload failed' })
            });

            await expect(imageUpload(images, restaurantName)).rejects.toThrow('Error occur while uploading images.');
        });

        test('should handle unexpected errors gracefully', async () => {
            const images = [new File(['content'], 'test.jpg', { type: 'image/jpeg' })];
            fetch.mockImplementationOnce(() => { throw new Error('Unexpected error'); });

            await expect(imageUpload(images, restaurantName)).rejects.toThrow('Unexpected error');
        });
    });

    describe('function postRestaurant', () => {
        beforeAll(() => {
            global.alert = jest.fn();
            global.fetch = jest.fn();
            global.localStorage = {
                getItem: jest.fn(() => 'mockedToken')
            };
        });
        afterAll(() => {
            jest.clearAllMocks();
            jest.restoreAllMocks();
        });
        const validPostData = {
            data: {
                name: 'Test Restaurant',
                price: '$$',
                category: 'Italian',
                place: 1,
                information: {
                    description: 'A nice place to eat.',
                    opening_hours: [
                        {
                            day_interval: 'Mon-Fri',
                            opening_hour: '08:00',
                            closing_hour: '22:00'
                        }
                    ],
                    location: {
                        address: '123 Test St',
                        website: 'https://testrestaurant.com',
                        phone: '123-456-7890'
                    }
                },
                socialNetworks: [
                    {
                        platform: 'Instagram',
                        url: 'https://instagram.com/testrestaurant'
                    }
                ]
            }
        };

        beforeEach(() => {
            fetch.mockClear();
        });

        test('should throw an error if "name" is missing', async () => {
            const invalidData = { ...validPostData, data: { ...validPostData.data, name: undefined } };
            await expect(postRestaurant(invalidData)).rejects.toThrow('missing request data "name".');
        });

        test('should throw an error if "price" is missing', async () => {
            const invalidData = { ...validPostData, data: { ...validPostData.data, price: undefined } };
            await expect(postRestaurant(invalidData)).rejects.toThrow('missing request data "price".');
        });

        test('should throw an error if "category" is missing', async () => {
            const invalidData = { ...validPostData, data: { ...validPostData.data, category: undefined } };
            await expect(postRestaurant(invalidData)).rejects.toThrow('missing request data "category".');
        });

        test('should throw an error if "place" is missing', async () => {
            const invalidData = { ...validPostData, data: { ...validPostData.data, place: undefined } };
            await expect(postRestaurant(invalidData)).rejects.toThrow('missing request data "place".');
        });

        test('should throw an error if "information.description" is missing', async () => {
            const invalidData = {
                ...validPostData,
                data: { ...validPostData.data, information: { ...validPostData.data.information, description: undefined } }
            };
            await expect(postRestaurant(invalidData)).rejects.toThrow('missing request data "information.description".');
        });

        test('should throw an error if "information.opening_hours" is empty', async () => {
            const invalidData = {
                ...validPostData,
                data: { ...validPostData.data, information: { ...validPostData.data.information, opening_hours: [] } }
            };
            await expect(postRestaurant(invalidData)).rejects.toThrow('missing request data "information.opening_hours".');
        });

        test('should throw an error if "socialNetworks" is empty', async () => {
            const invalidData = { ...validPostData, data: { ...validPostData.data, socialNetworks: [] } };
            await expect(postRestaurant(invalidData)).rejects.toThrow('missing request data "socialNetworks".');
        });

        test('should call the API with correct data', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true })
            });

            await postRestaurant(validPostData);

            expect(fetch).toHaveBeenCalled();

        });

        test('should throw an error if API response is not ok', async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                json: async () => ({ error: { message: 'API Error' } })
            });

            await expect(postRestaurant(validPostData)).rejects.toThrow();
        });
    });

});
