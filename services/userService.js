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

export const updateUser = async(userId,data)=>{
    try{
        // all api supabase api  (to fetch tha user table's data from supabase )
        // supabase.com/docs/reference/javascript/select
        // go to and can learn how easy it is , to extract data  from table 

        const {error} =await supabase//error pass karega 
        //! abe ek bar pls video me ja ke ye dekh lo 2:37:16
        .from('users')//selecting table 
        .update(data)//what we r doin updating but data which we passed above ye (updateUser = async(userId,data)=>)
        .eq('id',userId);
        //update data where id is perticular user id

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