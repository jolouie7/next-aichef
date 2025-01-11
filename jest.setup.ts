import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import "whatwg-fetch";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock next/auth
jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: null, status: "unauthenticated" }),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));
