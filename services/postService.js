import { supabase } from "../lib/supabase";
import { uploadFile } from "./imageService";

export const createOrUpdatePost = async (post) => {
    try {
        // upload 
        if (post.file && typeof post.file == 'object')//agar file h and vo object type ka h ya ni ki pakka gellary se liya gyaha and hame isse 
        {
            let isImage = post?.file?.type == 'image';
            let folderName = isImage ? 'postImages' : 'postVideos'// taki supabase mein pata chale image and video ko postimage and postvideo wale file mein dalan ah
            let fileResult = await uploadFile(folderName,post?.file?.uri,isImage);
            if(fileResult.success) post.file=fileResult.data;// agar success true  yani file uploaded post.file mein uploaded data ka path dedo ig mere hisab se 
            else{
                return fileResult;// it will show media was not uplaoded  kyu ki uplodfile banaya hi essa gya ha 
            }
                
        }   
        const {data,error} = await supabase
        .from('posts')//which table 
        .upsert(post)
        /* This is a combination of insert (add new data) and update (modify existing data).
        It checks if the post already exists in the table based on its primary key.
        If it exists, it updates the record.
        If it doesn’t exist, it inserts a new record. */
        .select()/* After performing the upsert, it retrieves the record so you can see what data was saved or updated in the table. */
        .single();/* Ensures that the result returned is a single object (not an array). This is used when you're only dealing with one record at a time. */

        if(error){
            console.log('create post error : ', error);
            return { success: false, msg: 'Could not creat your post' };
        }
        else{
            return {success:true,data:data};
        }
    } catch (error) {
        console.log('create post erro', error);
        return { success: false, msg: 'Could not creat your post' };
    }
}


export const fetchPost = async (limit = 10) => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select(  // notice here we are using backticks 
                `*,
                user:users(id,name,image)
            `
            )
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {

            console.log('fetch post erro', error);
            return { success: false, msg: 'Could not fetch the post' };
        }
        return { success:true,data:data};
    
    } catch (error) {
    console.log('fetch post erro', error);
    return { success: false, msg: 'Could not fetch the post' };
    }
}
