// capstone/backend/__tests__/models/User.test.js

const User = require("../../models/User");
const bcrypt = require("bcrypt");
const { sequelize } = require("../../config/database");

describe("User Model", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a new user with hashed password", async () => {
    const userData = { username: "testuser", password: "password123" };
    const user = await User.create(userData);

    expect(user.username).toBe(userData.username);
    expect(user.password).not.toBe(userData.password);
    expect(await bcrypt.compare(userData.password, user.password)).toBe(true);
  });

  it("should not create a user with an existing username", async () => {
    const userData = { username: "existinguser", password: "password123" };
    await User.create(userData);

    await expect(User.create(userData)).rejects.toThrow();
  });

  it("should not create a user with a short username", async () => {
    const userData = { username: "ab", password: "password123" };
    await expect(User.create(userData)).rejects.toThrow();
  });

  it("should not create a user with a short password", async () => {
    const userData = { username: "validuser", password: "short" };
    await expect(User.create(userData)).rejects.toThrow();
  });

  it("should validate correct password", async () => {
    const userData = { username: "validateuser", password: "correctpassword" };
    const user = await User.create(userData);

    const isValid = await user.validPassword("correctpassword");
    expect(isValid).toBe(true);
  });

  it("should not validate incorrect password", async () => {
    const userData = { username: "validateuser2", password: "correctpassword" };
    const user = await User.create(userData);

    const isValid = await user.validPassword("wrongpassword");
    expect(isValid).toBe(false);
  });

  it("should update user information", async () => {
    const userData = { username: "updateuser", password: "initialpassword" };
    const user = await User.create(userData);

    user.username = "updateduser";
    await user.save();

    const updatedUser = await User.findOne({
      where: { username: "updateduser" },
    });
    expect(updatedUser).not.toBeNull();
    expect(updatedUser.username).toBe("updateduser");
  });
});
