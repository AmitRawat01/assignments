const { MongoClient } = require("mongodb");

// Mock MongoDB client
jest.mock("mongodb", () => {
  const mockCollection = {
    find: jest.fn().mockReturnValue({
      toArray: jest.fn(),
    }),
    deleteMany: jest.fn(),
  };
  const mockDb = {
    collection: jest.fn(() => mockCollection),
  };
  const mockClient = {
    connect: jest.fn(),
    db: jest.fn(() => mockDb),
    close: jest.fn(),
  };
  return { MongoClient: jest.fn(() => mockClient) };
});

// Import the deleteUserOlderThan25 function
const deleteUserOlderThan25 = async () => {
  const client = new MongoClient();
  await client.connect();
  const db = client.db("user1");
  const usersCollection = db.collection("Users");
  const usersProfileCollection = db.collection("UsersProfile");

  const currentDate = new Date();
  const thresholdDate = new Date(
    currentDate.getFullYear() - 25,
    currentDate.getMonth(),
    currentDate.getDate()
  );

  const profilesToDelete = await usersProfileCollection
    .find({ dob: { $lt: thresholdDate } })
    .toArray();

  const userIds = profilesToDelete.map((profile) => profile.user_id);

  if (userIds.length > 0) {
    await usersProfileCollection.deleteMany({ user_id: { $in: userIds } });
    await usersCollection.deleteMany({ _id: { $in: userIds } });
  }

  await client.close();
  return userIds;
};

describe("deleteUserOlderThan25", () => {
  it("should delete users older than 25 years", async () => {
    const mockProfiles = [
      { dob: "1995-03-18", user_id: "user1" },
      { dob: "1990-03-18", user_id: "user2" },
    ];
    MongoClient().db().collection().find().toArray.mockResolvedValue(
      mockProfiles
    );

    const mockDeletedProfiles = { acknowledged: true, deletedCount: 2 };
    MongoClient().db().collection().deleteMany.mockResolvedValue(
      mockDeletedProfiles
    );

    const result = await deleteUserOlderThan25();
    expect(result).toEqual(["user1", "user2"]);
    expect(
      MongoClient().db().collection().deleteMany
    ).toHaveBeenCalledWith({ user_id: { $in: ["user1", "user2"] } });
  });

  it("should return an empty array if no users are older than 25 years", async () => {
    MongoClient().db().collection().find().toArray.mockResolvedValue([]);

    const result = await deleteUserOlderThan25();
    expect(result).toEqual([]);
  });

  it("should handle database errors gracefully", async () => {
    MongoClient().db().collection().find().toArray.mockRejectedValue(
      new Error("Database error")
    );

    await expect(deleteUserOlderThan25()).rejects.toThrow("Database error");
  });
});
