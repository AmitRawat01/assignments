import { loginUser } from '../controllers/UserController';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import AccessToken from '../models/AccessToken';

jest.mock('../models/User');
jest.mock('../models/AccessToken');

describe("API: loginUser", () => {
  it("should log in the user successfully and return access token", async () => {
    const mockReq = { body: { username: "testuser", password: "password123" } };
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    const mockUser = { _id: "user123", username: "testuser", password: "hashedpassword" };
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    AccessToken.create.mockResolvedValueOnce(true);

    await loginUser(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Login successful" }));
  });

  it("should return error if credentials are invalid", async () => {
    const mockReq = { body: { username: "wronguser", password: "password123" } };
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    User.findOne.mockResolvedValue(null);

    await loginUser(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ data: [], message: "Invalid credentials" });
  });
});
