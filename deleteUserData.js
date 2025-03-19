import { deleteUserData } from '../controllers/UserController';
import User from '../models/User';

jest.mock('../models/User');

describe("API: deleteUserData", () => {
  it("should delete user data successfully", async () => {
    const mockReq = { user: { _id: "user123" } };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    User.findByIdAndDelete.mockResolvedValue(true);

    await deleteUserData(mockReq, mockRes);

    expect(User.findByIdAndDelete).toHaveBeenCalledWith("user123");
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      data: [],
      message: "User deleted successfully",
    });
  });

  it("should handle errors during user deletion", async () => {
    const mockReq = { user: { _id: "user123" } };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    User.findByIdAndDelete.mockRejectedValue(new Error("Database error"));

    await deleteUserData(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      data: [],
      message: "Server error",
    });
  });
});
