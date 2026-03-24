import api from "@/lib/api/client";

export class AuditClient {
  list() {
    return api.get("/audit/");
  }
}
export const auditClient = new AuditClient();
