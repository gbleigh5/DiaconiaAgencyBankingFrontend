import api from "@/lib/api/client";
import { tokenStorage } from '@/lib/storage';
import { AxiosRequestConfig } from "axios";

const config: AxiosRequestConfig = {
  headers: {
    Authorization: `Bearer ${tokenStorage.getAccessToken()}`
  }
}

export class CustomersClient {
  list() {
    return api.get("/customers/", config);
  }
  detail(id: string) {
    return api.get(`/customers/${id}/`, config);
  }
  createAccountOpening(payload: any) {
    return api.post("/customers/account-openings/", payload, config);
  }
}

export const customersClient = new CustomersClient();
