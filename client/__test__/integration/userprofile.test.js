import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { UserProfile } from '../../../client/pages/userprofile/index.js';
import { toast } from 'react-toastify';

describe('UserProfile Integration', () => {
    const mockToken = 'test-integration-token';
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetches and displays user profile data from API', async () => {
        const mockUserData = {
            username: 'Testuser',
            email: 'Test@gmail.com',
            firstname: 'Testfirstname',
            lastname: 'Testlastname',
            job: 'Testjob',
            picture: { url: '/test-avatar.jpg' }
        };

        const axiosGetSpy = jest.spyOn(axios, 'get').mockResolvedValue({ 
            data: mockUserData 
        });

        render(<UserProfile token={mockToken} />);

        await waitFor(() => {
            expect(axiosGetSpy).toHaveBeenCalledWith(
                'http://localhost:1337/api/users/me?populate=*',
                {
                    headers: {
                        Authorization: `bearer ${mockToken}`,
                    },
                }
            );

            expect(screen.getByText(/Testuser/i)).toBeInTheDocument();
            expect(screen.getByText(/Test@gmail.com/i)).toBeInTheDocument();
        });
    });

    it('should updates user profile and handles successful API response', async () => {
        const initialUserData = {
            username: 'Updateuser',
            email: 'Update@gmail.com',
            firstname: 'Updatefirstname',
            lastname: 'Updatelastname',
            job: 'Updatejob',
            picture: { url: '/current-avatar.jpg' }
        };

        jest.spyOn(axios, 'get').mockResolvedValue({ 
            data: initialUserData 
        });
        const axiosPutSpy = jest.spyOn(axios, 'put').mockResolvedValue({});
        const toastSuccessSpy = jest.spyOn(toast, 'success');

        render(<UserProfile token={mockToken} />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Updatefirstname')).toBeInTheDocument();
        });

        const firstNameInput = screen.getByLabelText(/First Name:/i);
        const lastNameInput = screen.getByLabelText(/Last Name:/i);
        const emailInput = screen.getByLabelText(/Email:/i);

        fireEvent.change(firstNameInput, { target: { value: 'Updatedfirstname' } });
        fireEvent.change(lastNameInput, { target: { value: 'Updatedlastname' } });
        fireEvent.change(emailInput, { target: { value: 'updated@gmail.com' } });

        const updateButton = screen.getByText(/Edit/i);
        fireEvent.click(updateButton);

        await waitFor(() => {
            expect(axiosPutSpy).toHaveBeenCalledWith(
                'http://localhost:1337/api/users/me',
                {
                    firstname: 'Updatedfirstname',
                    lastname: 'Updatedlastname',
                    email: 'updated@gmail.com',
                    job: initialUserData.job,
                    gender: ''
                },
                expect.objectContaining({
                    headers: expect.any(Object)
                })
            );

            expect(toastSuccessSpy).toHaveBeenCalledWith('Profile updated successfully');
        });
    });

    it('should handles API error during profile fetch', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        jest.spyOn(axios, 'get').mockRejectedValue(new Error('Network Error'));

        render(<UserProfile token={mockToken} />);

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                expect.objectContaining({ error: expect.any(Error) })
            );
        });

        consoleErrorSpy.mockRestore();
    });
});