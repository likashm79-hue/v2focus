import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("enquiries.submit", () => {
  it("should accept valid enquiry data", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const validEnquiry = {
      name: "John Doe",
      phone: "+91 98765 43210",
      email: "john@example.com",
      eventType: "wedding",
      eventDate: "2026-12-25",
      message: "We would like to book for our wedding",
    };

    const result = await caller.enquiries.submit(validEnquiry);

    expect(result).toEqual({
      success: true,
      message: "Enquiry submitted successfully",
    });
  });

  it("should reject enquiry without name", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const invalidEnquiry = {
      name: "",
      phone: "+91 98765 43210",
      email: "john@example.com",
      eventType: "wedding",
      eventDate: "2026-12-25",
      message: "Test",
    };

    try {
      await caller.enquiries.submit(invalidEnquiry);
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("BAD_REQUEST");
    }
  });

  it("should reject enquiry with invalid email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const invalidEnquiry = {
      name: "John Doe",
      phone: "+91 98765 43210",
      email: "invalid-email",
      eventType: "wedding",
      eventDate: "2026-12-25",
      message: "Test",
    };

    try {
      await caller.enquiries.submit(invalidEnquiry);
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("BAD_REQUEST");
    }
  });

  it("should accept enquiry without optional fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const enquiry = {
      name: "Jane Doe",
      phone: "+91 98765 43210",
      email: "jane@example.com",
      eventType: "maternity",
    };

    const result = await caller.enquiries.submit(enquiry);

    expect(result).toEqual({
      success: true,
      message: "Enquiry submitted successfully",
    });
  });
});
