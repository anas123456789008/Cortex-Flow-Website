import { supabase } from "../../integrations/supabase/client";
async function getData() {
 const { data, error } = await supabase.from('transactions').select('*')
 console.log(data)
}

