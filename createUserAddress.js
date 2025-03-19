import { createUserAddress } from '../controllers/UserController';
import Address from '../models/Address';
import AccessToken from '../models/AccessToken';
import User from '../models/User';

jest.mock('../models/Address');
jest.mock('../models/AccessToken');
jest.mock('../models/User');

describe("API: createUserAddress", () => {
  it("should add a new address successfully", async () => {
    const mockReq = {
      body: { user_id: "user123", address: "123 St", city: "City", state: "State", pinCode: "123456", phoneNo: "9876543210" },
      headers: { access_token: "validtoken" },
    };
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    AccessToken.findOne.mockResolvedValue({ expiry: new Date(Date.now() + 1000 * 60 * 10) });
    Address.mockImplementation(() => ({ save: jest.fn() }));

    await createUserAddress(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({ data: [], message: "Address added successfully" });
  });
});
