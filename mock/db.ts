import { faker } from "@faker-js/faker";

// Store fake users in memory
export const fakeUsers = [
  {
    id: faker.string.uuid(),
    username: "testuser",
    email: "test@example.com",
    password: "123456", // ✅ Simulating stored password
    token: faker.string.uuid(),
  },
];

// Function to find user by credentials
export const findUser = (username: string, password: string) =>
  fakeUsers.find((user) => user.username === username && user.password === password);

// Function to validate token
export const validateToken = (token: string) => fakeUsers.find((user) => user.token === token);
