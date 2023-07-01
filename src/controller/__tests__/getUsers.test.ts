import { mockReq, mockRes, mockUsers } from './mocks';
import { getUsers } from "../userController";


jest.mock('../../db', () => ({
    users: mockUsers,
}));


describe('GetUsers', () => {
    it('should return all users from db', () => {
        getUsers(mockReq, mockRes);
        expect(mockRes.write).toHaveBeenCalledWith(JSON.stringify(mockUsers));
    });
});
