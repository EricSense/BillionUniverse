import { describe, expect, it } from "vitest";
import { compilePreview } from "./preview";
import { templateOrb } from "./templates";
import { createJob } from "./jobs";

describe("preview + jobs", () => {
  it("compiles the unifying orb graph to HTML", () => {
    const u = templateOrb();
    const html = compilePreview(u);
    expect(html).toContain("Orb One");
    expect(html).toContain("workshop-printer");
    expect(html).toContain("hardware node");
  });

  it("records where a job was directed from", () => {
    const u = templateOrb();
    const job = createJob("workshop-printer", u, {
      id: "you",
      name: "Lyra-7",
      color: "#d6ff4b",
      device: "phone",
    });
    expect(job.status).toBe("queued");
    expect(job.directedFrom).toContain("phone");
    expect(job.backendId).toBe("workshop-printer");
  });
});
