import { mockReq, mockRes, mockUsers } from './mocks';
import { deleteUser } from "../userController";


jest.mock('../../db', () => ({
    users: mockUsers,
}));


describe('DeleteUserByID', () => {
    it('should have response with code 204 after succcess deletion', () => {
        const id = '1';
        deleteUser(mockReq, mockRes, id);
        expect(mockRes.statusCode).toBe(204);
    });
});