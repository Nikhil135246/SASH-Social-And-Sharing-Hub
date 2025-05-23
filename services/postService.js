import { supabase } from "../lib/supabase";
import { uploadFile } from "./imageService";

export const createOrUpdatePost = async (post) => {
  try {
    // upload
    if (post.file && typeof post.file == "object") {
      //agar file h and vo object type ka h ya ni ki pakka gellary se liya gyaha and hame isse
      let isImage = post?.file?.type == "image";
      let folderName = isImage ? "postImages" : "postVideos"; // taki supabase mein pata chale image and video ko postimage and postvideo wale file mein dalan ah
      let fileResult = await uploadFile(folderName, post?.file?.uri, isImage);
      if (fileResult.success)
        post.file =
          fileResult.data; // agar success true  yani file uploaded post.file mein uploaded data ka path dedo ig mere hisab se
      else {
        return fileResult; // it will show media was not uplaoded  kyu ki uplodfile banaya hi essa gya ha
      }
    }

    const { data, error } = await supabase
      .from("posts") //which table
      .upsert(post)
      /* This is a combination of insert (add new data) and update (modify existing data).
            It checks if the post already exists in the table based on its primary key.
            If it exists, it updates the record.
            If it doesn’t exist, it inserts a new record. */
      .select() /* After performing the upsert, it retrieves the record so you can see what data was saved or updated in the table. */
      .single(); /* Ensures that the result returned is a single object (not an array). This is used when you're only dealing with one record at a time. */

    if (error) {
      console.log("create post error : ", error);
      return { success: false, msg: "Could not creat your post" };
    } else {
      return { success: true, data: data };
    }
  } catch (error) {
    console.log("create post erro", error);
    return { success: false, msg: "Could not creat your post" };
  }
};

export const fetchPosts = async (limit = 10, userId) => {
  try {
    if (userId) {
      const { data, error } = await supabase
        .from("posts")
        .select(
          ` 
            *,
            user:users(id, name, image),
            postlike (*),
            comments(count)
        `
        ) // notice here we are using backticks
        // ! and remember that never ever give comman in last like of selected items in .select(``)
        // postlike is liye fetch kiya ja raha ha taki jin user ne jisko like kiya h usko show bhi karna padega na
        .order("created_at", { ascending: false })
        .eq("userid", userId)
        .limit(limit);
        if (error) {
            console.log("fetch post erro", error);
            return { success: false, msg: "Could not fetch the post" };
          }
          return { success: true, data: data };

    } else {
      const { data, error } = await supabase
        .from("posts")
        .select(
          ` 
            *,
            user:users(id, name, image),
            postlike (*),
            comments(count)
        `
        ) // notice here we are using backticks
        // ! and remember that never ever give comman in last like of selected items in .select(``)
        // postlike is liye fetch kiya ja raha ha taki jin user ne jisko like kiya h usko show bhi karna padega na
        .order("created_at", { ascending: false })
        .limit(limit);
        if (error) {
          console.log("fetch post erro", error);
          return { success: false, msg: "Could not fetch the post" };
        }
        return { success: true, data: data };
    }


  } catch (error) {
    console.log("fetch post erro", error);
    return { success: false, msg: "Could not fetch the post" };
  }
};

export const fetchPostDetials = async (postId) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        ` 
                *,
                user:users(id, name, image),
                postlike (*),
                comments(*,  user: users(id,image,name))
            `
      )
      // notice here we are using backticks
      // ! and remember that never ever give comman in last like of selected items in .select(``)
      // postlike is liye fetch kiya ja raha ha taki jin user ne jisko like kiya h usko show bhi karna padega na
      .eq("id", postId) // vo post fetch karo jiske id = (postId = we passed)
      .order("created_at", { ascending: false, foreignTable: "comments" })
      .single();

    if (error) {
      console.log("fetchPostDetials error", error);
      return { success: false, msg: "Could not fetch the postDetials" };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("fetchPostDetials erro", error);
    return { success: false, msg: "Could not fetch the postDetials" };
  }
};

export const createPostLike = async (postLike) => {
  // this function recive postLike a object
  // console.log('Received postLike:', postLike); //check postLike ke ander dono present h ki ni ( postId,userid )
  try {
    const { data, error } = await supabase
      //fuck just because of await  my code dindt works sucess true but data is undefiend cause i its dint wait for promise to accept or reject and rest of lines just runs like syncronoun
      .from("postlike")
      .insert(postLike)
      .select()
      .single();

    if (error) {
      console.log("PostLike error", error);
      return { success: false, msg: "Could like the post" };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("PostLike error", error);
    return { success: false, msg: "Could like the post" };
  }
};

export const removePostLike = async (postId, userId) => {
  // this function recive postLike a object
  try {
    const { error } = await supabase
      .from("postlike")
      .delete()
      .eq("userid", userId) // supabase mein post table mein userId coloum ka naam mein i small ha is liye (userid likha here)
      .eq("postid", postId);

    if (error) {
      console.log("PostLike error", error);
      return { success: false, msg: "Could not remove the post " };
    }
    return { success: true };
  } catch (error) {
    console.log("PostLike error", error);
    return { success: false, msg: "Could not remove the post " };
  }
};
export const removeComment = async (commentId) => {
  // this function recive postLike a object
  try {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      console.log("remove comment error", error);
      return { success: false, msg: "Could not remove the comment " };
    }
    return { success: true, data: { commentId } };
  } catch (error) {
    console.log("PostLikeremove comment error", error);
    return { success: false, msg: "Could not remove the comment " };
  }
};
export const removePost = async (postId) => {
  // this function recive postLike a object
  try {
    const { error } = await supabase.from("posts").delete().eq("id", postId);

    if (error) {
      console.log("remove Post error", error);
      return { success: false, msg: "Could not remove the post " };
    }
    return { success: true, data: { postId } };
  } catch (error) {
    console.log("Post remove error", error);
    return { success: false, msg: "Could not remove the post " };
  }
};

export const createComment = async (comment) => {
  try {
    const { data, error } = await supabase
      .from("comments")
      .insert(comment)
      .select()
      .single();
    console.log("Comment Data:", data);
    if (error) {
      console.log("Comment error", error);
      return { success: false, msg: "Could not create comment" };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("Comment error", error);
    return { success: false, msg: "Could not create comment" };
  }
};
