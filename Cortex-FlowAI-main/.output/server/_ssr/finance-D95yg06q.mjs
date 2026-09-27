import { t as supabase } from "./client-j4Rv7MKA.mjs";
import { t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/finance-D95yg06q.js
function useProfile() {
	return useQuery({
		queryKey: ["profile"],
		queryFn: async () => {
			const { data: u } = await supabase.auth.getUser();
			if (!u.user) return null;
			const { data } = await supabase.from("profiles").select("*").eq("id", u.user.id).maybeSingle();
			return data ?? {
				id: u.user.id,
				name: u.user.email?.split("@")[0] ?? "",
				email: u.user.email ?? "",
				avatar_url: null
			};
		}
	});
}
function useTransactions() {
	return useQuery({
		queryKey: ["transactions"],
		queryFn: async () => {
			const { data, error } = await supabase.from("transactions").select("*").order("occurred_on", { ascending: false }).limit(500);
			if (error) throw error;
			return data ?? [];
		}
	});
}
function formatCurrency(n) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0
	}).format(n);
}
//#endregion
export { useProfile as n, useTransactions as r, formatCurrency as t };
