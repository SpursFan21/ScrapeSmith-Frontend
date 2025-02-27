import type { AdapterUser as BaseAdapterUser } from "next-auth/adapters";

declare module "next-auth/adapters" {
  // Extend the default AdapterUser type to include isAdmin.
  interface AdapterUser extends BaseAdapterUser {
    isAdmin: boolean;
  }
}
