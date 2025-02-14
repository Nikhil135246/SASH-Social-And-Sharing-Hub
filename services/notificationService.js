import { supabase } from "../lib/supabase";

export const createNotification = async (notification) => {
  // this function recive postLike a object
  // console.log('Received postLike:', postLike); //check postLike ke ander dono present h ki ni ( postId,userid )
  try {
    const { data, error } = await supabase
      //fuck just because of await  my code dindt works sucess true but data is undefiend cause i its dint wait for promise to accept or reject and rest of lines just runs like syncronoun
      .from("notifications")
      .insert(notification)
      .select()
      .single();

    if (error) {
      console.log("Notification error", error);
      return { success: false, msg: "Could not Notified!" };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("Notification error", error);
    return { success: false, msg: "Could not Notified!" };
  }
};


// api to fetch all the notifications 
export const fetchNotifications = async (receiverId) => {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select(
          ` 
                  *,
                 sender:senderid(id,name,image)
              `
        )
        // ! and remember that never ever give comman in last like of selected items in .select(``)
        .eq("receiverid", receiverId) // vo notification fetch karo jiske id = (reciverid = we passed)
        .order("created_at", { ascending: false})
  
      if (error) {
        console.log("fetchPostNotification error", error);
        return { success: false, msg: "Could not fetch the Notification" };
      }
      return { success: true, data: data };
    } catch (error) {
      console.log("fetchPostNotification error", error);
      return { success: false, msg: "Could not fetch the Notification" }; 
    }
  };


  
  // export const removeNotification = async (notificationId) => {
  //   // this function recive postLike a object
  //   try {
  //     const { error } = await supabase
  //       .from("notifications")
  //       .delete()
  //       .eq("id", notificationId) // supabase mein post table mein userId coloum ka naam mein i small ha is liye (userid likha here)
        
  
  //     if (error) {
  //       console.log("Notification Remove error", error);
  //       return { success: false, msg: "Could not remove the Notifications" };
  //     }
  //     return { success: true };
  //   } catch (error) {
  //     console.log("Notification Remove error", error);
  //     return { success: false, msg: "Could not remove the Notifications" };
  //   }
  // };