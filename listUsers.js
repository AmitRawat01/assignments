import { listUsers } from '../controllers/UserController';
import User from '../models/User';

jest.mock('../models/User');

describe("API: listUsers", () => {
  it("should list users successfully with pagination", async () => {
    const mockReq = { params: { page: "1" } };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockUsers = [
      { _id: "user1", username: "user1" },
      { _id: "user2", username: "user2" },
    ];

    User.find.mockResolvedValue(mockUsers);

    await listUsers(mockReq, mockRes);

    expect(User.find).toHaveBeenCalledWith();
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      data: mockUsers,
      message: "Users retrieved successfully",
    });
  });

  it("should handle errors when fetching users", async () => {
    const mockReq = { params: { page: "1" } };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    User.find.mockRejectedValue(new Error("Database error"));

    await listUsers(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      data: [],
      message: "Server error",
    });
  });
});
