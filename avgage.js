const { MongoClient } = require("mongodb");

// Mock MongoDB client
jest.mock("mongodb", () => {
  const mockCollection = {
    find: jest.fn().mockReturnValue({
      toArray: jest.fn(),
    }),
  };
  const mockDb = {
    collection: jest.fn(() => mockCollection),
  };
  const mockClient = {
    connect: jest.fn(),
    db: jest.fn(() => mockDb),
  };
  return { MongoClient: jest.fn(() => mockClient) };
});

// Import the calculateAverageAge function
const calculateAverageAge = async () => {
  const client = new MongoClient();
  await client.connect();
  const db = client.db("user1");
  const usersProfileCollection = db.collection("UsersProfile");

  const usersProfiles = await usersProfileCollection.find().toArray();
  const currentDate = new Date();
  let totalAge = 0;

  for (let i = 0; i < usersProfiles.length; i++) {
    const dob = new Date(usersProfiles[i].dob);
    const ageInMilliseconds = currentDate - dob;
    const ageInYears =
      new Date(ageInMilliseconds).getUTCFullYear() - 1970;
    totalAge += ageInYears;
  }
  const averageAge = totalAge / usersProfiles.length;
  return averageAge;
};

describe("calculateAverageAge", () => {
  it("should calculate the average age correctly", async () => {
    const mockProfiles = [
      { dob: "1990-01-01" },
      { dob: "1985-01-01" },
      { dob: "2000-01-01" },
    ];
    MongoClient().db().collection().find().toArray.mockResolvedValue(
      mockProfiles
    );

    const averageAge = await calculateAverageAge();
    const currentYear = new Date().getFullYear();
    const expectedAge =
      ((currentYear - 1990) +
        (currentYear - 1985) +
        (currentYear - 2000)) /
      3;

    expect(averageAge).toBeCloseTo(expectedAge);
  });

  it("should return NaN if there are no user profiles", async () => {
    MongoClient().db().collection().find().toArray.mockResolvedValue([]);

    const averageAge = await calculateAverageAge();
    expect(averageAge).toBe(NaN);
  });

  it("should handle invalid DOB values gracefully", async () => {
    const mockProfiles = [
      { dob: "invalid-date" },
      { dob: "2000-01-01" },
    ];
    MongoClient().db().collection().find().toArray.mockResolvedValue(
      mockProfiles
    );

    const averageAge = await calculateAverageAge();
    const currentYear = new Date().getFullYear();
    const expectedAge = currentYear - 2000; // Only valid DOB is considered

    expect(averageAge).toBeCloseTo(expectedAge);
  });
});
