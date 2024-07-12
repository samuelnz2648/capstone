// backend/__tests__/models/User.test.js

const User = require("../../models/User");
const bcrypt = require("bcrypt");

describe("User Model", () => {
  it("should hash password before saving", async () => {
    const userData = { username: "testuser", password: "password123" };
    const user = await User.create(userData);
    expect(user.password).not.toBe(userData.password);
    expect(await bcrypt.compare(userData.password, user.password)).toBe(true);
  });

  it("should validate password correctly", async () => {
    const userData = { username: "testuser2", password: "password123" };
    const user = await User.create(userData);
    expect(await user.validPassword(userData.password)).toBe(true);
    expect(await user.validPassword("wrongpassword")).toBe(false);
  });
});
