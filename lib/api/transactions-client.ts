import api from "@/lib/api/client";

export class TransactionsClient {
  list() {
    return api.get("/transactions/");
  }
  sendOtp(customerAccountNumber: string) {
    return api.post("/transactions/send-otp/", { customer_account_number: customerAccountNumber });
  }
  deposit(payload: Record<string, unknown>) {
    return api.post("/transactions/deposit/", payload);
  }
  withdraw(payload: Record<string, unknown>) {
    return api.post("/transactions/withdraw/", payload);
  }
  transfer(payload: Record<string, unknown>) {
    return api.post("/transactions/transfer/", payload);
  }
}

export const transactionsClient = new TransactionsClient();
