import { getUserData } from '../controllers/UserController';
import User from '../models/User';
import AccessToken from '../models/AccessToken';

jest.mock('../models/User');
jest.mock('../models/AccessToken');

describe("API: getUserData", () => {
  it("should retrieve user data successfully with valid access token", async () => {
    const mockReq = {
      params: { id: "user123" },
      headers: { access_token: "validtoken" },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    AccessToken.findOne.mockResolvedValue({
      user_id: "user123",
      access_token: "validtoken",
      expiry: new Date(Date.now() + 1000 * 60 * 10), // Not expired
    });

    User.findById.mockResolvedValue({
      _id: "user123",
      username: "testuser",
      addresses: [],
    });

    await getUserData(mockReq, mockRes);

    expect(AccessToken.findOne).toHaveBeenCalledWith({
      user_id: "user123",
      access_token: "validtoken",
    });
    expect(User.findById).toHaveBeenCalledWith("user123");
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      data: expect.objectContaining({ _id: "user123", username: "testuser" }),
      message: "User data retrieved successfully",
    });
  });

  it("should return 401 for invalid or expired access token", async () => {
    const mockReq = {
      params: { id: "user123" },
      headers: { access_token: "invalidtoken" },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    AccessToken.findOne.mockResolvedValue(null);

    await getUserData(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      data: [],
      message: "Invalid access token",
    });
  });
});
