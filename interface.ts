type UserRole = "admin" | "member";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  token: string;
}

interface EquipmentItem {
  _id: string;
  name: string;
  category: string;
  description: string;
  quantity: number;
  rentalRate: number;
  isActive: boolean;
}

interface RentalUser {
  _id: string;
  name: string;
  email: string;
  tel: string;
  role: UserRole;
}

interface RentalItem {
  _id: string;
  equipment: EquipmentItem | null;
  user: RentalUser | null;
  quantity: number;
  startDate: string;
  returnDate: string;
}

interface RegisterInput {
  name: string;
  email: string;
  tel: string;
  role: UserRole;
  password: string;
}

interface EquipmentInput {
  name: string;
  category: string;
  description: string;
  quantity: number;
  rentalRate: number;
}

interface RentalInput {
  equipment: string;
  quantity: number;
  startDate: string;
  returnDate: string;
}

type BackendResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; error: string };

interface ActionResult {
  error: string | null;
}
