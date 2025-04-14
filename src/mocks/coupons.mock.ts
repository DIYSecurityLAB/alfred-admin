import { Coupon } from "../data/types";

export const mockCoupons: Coupon[] = [
  {
    id: "1",
    code: "VERAO2024",
    discount_type: "percentage",
    discountValue: 20,
    minPurchaseValue: 100,
    maxDiscountValue: 50,
    usageLimit: 1000,
    usedCount: 354,
    isActive: true,
    validFrom: "2024-01-01",
    validUntil: "2024-03-31"
  },
  {
    id: "2",
    code: "BEMVINDO10",
    discount_type: "percentage",
    discountValue: 10,
    minPurchaseValue: 0,
    maxDiscountValue: 30,
    usageLimit: 500,
    usedCount: 412,
    isActive: true,
    validFrom: "2023-06-01",
    validUntil: "2024-12-31"
  },
  {
    id: "3",
    code: "FRETEGRATIS",
    discount_type: "fixed",
    discountValue: 25,
    minPurchaseValue: 150,
    maxDiscountValue: 0,
    usageLimit: 200,
    usedCount: 198,
    isActive: false,
    validFrom: "2023-11-15",
    validUntil: "2024-02-15"
  },
  {
    id: "4",
    code: "BLACKFRIDAY",
    discount_type: "percentage",
    discountValue: 30,
    minPurchaseValue: 200,
    maxDiscountValue: 100,
    usageLimit: 300,
    usedCount: 287,
    isActive: false,
    validFrom: "2023-11-20",
    validUntil: "2023-11-30"
  },
  {
    id: "5",
    code: "ANIVERSARIO15",
    discount_type: "percentage",
    discountValue: 15,
    minPurchaseValue: 50,
    maxDiscountValue: 45,
    usageLimit: 500,
    usedCount: 112,
    isActive: true,
    validFrom: "2024-02-01",
    validUntil: "2024-12-31"
  }
];
