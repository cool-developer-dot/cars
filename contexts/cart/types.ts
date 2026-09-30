/**
 * Order payload types — the shape the order backend expects
 * (`/api/validate-config`, `/api/checkout`, `/api/addleadtodb`).
 * Field names, including their spelling, are the backend's: don't rename.
 */

export type PlateConfig = {
  plate_type: string;
  text: string;
  legal_type: "road_legal" | "show_only";
  plate_size: string;
  front_plate_size: string;
  rear_plate_size: string;
  rear_plate_extra_fee: number;
  sides: "both" | "front" | "rear";
  effects: Record<string, boolean>;
  border: { borderSelected: boolean; borderColor: string };
  style: string;
  customSpacing: { enabled: boolean; spacing: number };
  hexPlate: boolean;
  badge: string;
  freeKit: { pads: boolean; screws: boolean };
  pricing_breakdown: {
    base: number;
    additionPrice: number;
    total: number;
    unitPrice: number;
  };
  fQuantity: number;
  rQuantity: number;
  cartPrice: number;
  total: number;
};

export type Product = { plate_config: PlateConfig };

export type Customer = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  postcode: string;
  country: string;
};

/** What the backend receives at checkout (plus `product_id`) */
export type FinishProduct = {
  customer: Customer;
  quantity: number;
  plate_config: PlateConfig;
  preview_base64: string | null;
  promo_code?: string;
};

/**
 * One configured set of plates in the basket. `builder` is our own
 * snapshot of the builder state so the plates can be re-rendered and
 * edited; it is never sent to the backend.
 */
export type BasketItem<B = unknown> = Product & {
  quantity: number;
  preview_base64: string | null;
  builder: B;
  addedAt: number;
};

export type Result = { ok: true } | { ok: false; message: string };

export type CheckoutResult =
  | { ok: true; redirectUrl?: string; orderRef?: string; raw: unknown }
  | { ok: false; message: string };
