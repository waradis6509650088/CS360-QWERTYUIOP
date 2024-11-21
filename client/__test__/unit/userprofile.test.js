import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { UserProfile } from '../../../client/pages/userprofile/index.js';
import { toast } from 'react-toastify';

// Mock dependencies
jest.mock('axios');
jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
    },
}));

describe('UserProfile Component', () => {
    const mockToken = 'test-token';
    const mockUserData = {
        username: 'testuser',
        email: 'test@gmail.com',
        firstname: 'Testfirstname',
        lastname: 'Testlastname',
        job: 'Testjob',
        gender: 'Testgender',
        picture: {
            url: '/profile.jpg'
        }
    };

    beforeEach(() => {
        axios.get.mockResolvedValue({ data: mockUserData });
        axios.put.mockResolvedValue({});
    });

    it('should renders user profile information', async () => {
        render(<UserProfile token={mockToken} />);

        await waitFor(() => {
            const nameElement = screen.getByText((content, element) => {
                return element.tagName.toLowerCase() === 'p' && 
                       content.includes(mockUserData.username);
            });
            const emailElement = screen.getByText((content, element) => {
                return element.tagName.toLowerCase() === 'p' && 
                       content.includes(mockUserData.email);
            });

            expect(nameElement).toBeInTheDocument();
            expect(emailElement).toBeInTheDocument();
        });
    });

    it('should updates user profile information', async () => {
        render(<UserProfile token={mockToken} />);

        // Wait for initial data to load
        await waitFor(() => {
            expect(screen.getByDisplayValue(mockUserData.firstname)).toBeInTheDocument();
        });

        // Change input values
        const firstNameInput = screen.getByLabelText(/First Name:/i);
        const lastNameInput = screen.getByLabelText(/Last Name:/i);
        const emailInput = screen.getByLabelText(/Email:/i);
        
        fireEvent.change(firstNameInput, { target: { value: 'Firstname' } });
        fireEvent.change(lastNameInput, { target: { value: 'Lastname' } });
        fireEvent.change(emailInput, { target: { value: 'Example@gmail.com' } });

        // Click update button
        const updateButton = screen.getByText(/Edit/i);
        fireEvent.click(updateButton);

        // Assert axios put was called with correct data
        await waitFor(() => {
            expect(axios.put).toHaveBeenCalledWith(
                'http://localhost:1337/api/users/me', 
                {
                    firstname: 'Firstname',
                    lastname: 'Lastname',
                    email: 'Example@gmail.com',
                    job: mockUserData.job,
                    gender: mockUserData.gender
                },
                expect.objectContaining({
                    headers: expect.any(Object)
                })
            );

            // Check toast success was called
            expect(toast.success).toHaveBeenCalledWith('Profile updated successfully');
        });
    });

    it('should handles API error ', async () => {
        // Mock console.log to prevent error output in test
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        
        axios.get.mockRejectedValue(new Error('API Error'));

        render(<UserProfile token={mockToken} />);

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith(expect.objectContaining({
                error: expect.any(Error)
            }));
        });

        consoleSpy.mockRestore();
    });
});