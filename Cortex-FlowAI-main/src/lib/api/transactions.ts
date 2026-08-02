import { supabase } from "../../integrations/supabase/client";

export async function getTransactions() {
  const { data, error } = await supabase.from("transactions").select("*");
  if (error) {
    console.error(error);
    return [];
  }
  return data;
}
