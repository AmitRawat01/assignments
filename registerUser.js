import { registerUser } from '../controllers/UserController';
import User from '../models/User';
import bcrypt from 'bcryptjs';

jest.mock('../models/User');

describe("API: registerUser", () => {
  it("should register a new user successfully", async () => {
    const mockReq = {
      body: {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        firstname: "John",
        lastname: "Doe",
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    User.findOne.mockResolvedValueOnce(null); // No existing username
    User.findOne.mockResolvedValueOnce(null); // No existing email
    const mockSave = jest.fn();
    User.mockImplementation(() => ({ save: mockSave }));

    await registerUser(mockReq, mockRes);

    expect(User.findOne).toHaveBeenCalledWith({ username: "testuser" });
    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(mockSave).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({ data: [], message: 'User registered successfully' });
  });

  it("should return error if username already exists", async () => {
    const mockReq = { body: { username: "testuser", email: "test@example.com", password: "password123" } };
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    User.findOne.mockResolvedValueOnce({ username: "testuser" }); // Username exists

    await registerUser(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ data: [], message: 'Username already exists' });
  });
});
