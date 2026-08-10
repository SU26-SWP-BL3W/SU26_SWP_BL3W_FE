import type { AppRole } from "@/viewModels/useUserRole";

export interface NavLink {
  href: string;
  label: string;
}

// Gom quyết định "role nào thấy link nào" về 1 chỗ duy nhất, thay vì rải if(isAdmin)
// khắp các component. Mỗi feature thêm link của mình vào đây khi được build, KHÔNG
// tự ý check role riêng trong component của feature đó.
const NAV_LINKS: Record<NonNullable<AppRole> | "guest", NavLink[]> = {
  guest: [],
  student: [],
  admin: [],
};

export function getNavLinksFor(role: AppRole): NavLink[] {
  return NAV_LINKS[role ?? "guest"];
}
