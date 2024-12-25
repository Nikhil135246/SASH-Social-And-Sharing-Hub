import { supabase } from "../lib/supabase";

export const getUserData = async(userId)=>{
    try{
        // all api supabase api  (to fetch tha user table's data from supabase )
        // supabase.com/docs/reference/javascript/select
        // go to and can learn how easy it is , to extract data  from table 

        const {data,error} =await supabase
        .from('users')
        .select()
        .eq('id',userId)
        .single();
        if(error)
        {
            return{success:false,msg:error?.message};
        }
        return{success:true,data};
        // we are selecting users table,we select data,then checking wahi wali user jiske id userId ho , then extractign single item

        
        
    }
    catch(error){
        // aggar erorr mila tho show kardo , and return kar do success ko false , and msg mein error msg 
        console.log('got error:',error);
        return{success: false, msg: error.message};

    }
}