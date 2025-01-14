import * as FileSystem from 'expo-file-system'
import { supabase } from '../lib/supabase';
import { decode } from 'base64-arraybuffer';
import { supabaseUrl } from '../constants';


export const getUserImageSrc = imagePath => {  // note that imagePath is parameter here we passing to function

    if (imagePath) {
        return getSupabaseFileUrl(imagePath);
    } else {
        return require('../assets/images/defaultUser2.jpeg');
    }
}

export  const getSupabaseFileUrl= filePath =>{
    if(filePath)
    {
        // we have to do this 👇
        // return {uri: `https://ktbvfpxzwcceqhjjlscz.supabase.co/storage/v1/object/public/uploads/${filePath}`}
        // per kyu ki "https://ktbvfpxzwcceqhjjlscz.supabase.co" part is same as we save in supabaseUrl in constant so we jsut replace it 


        return {uri: `${supabaseUrl}/storage/v1/object/public/uploads/${filePath}`}

    }
    return null;
}

export const uploadFile = async (folderName, fileUri, isImage = true) => {
    try {
        let fileName = getFilePath(folderName, isImage);//! generating filename 
        const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
            /* await keyword is used with asynchronous functions. It tells JavaScript to pause execution at that point in the code until the Promise is resolved (either fulfilled or rejected). */
            encoding: FileSystem.EncodingType.Base64// we have base64 data 
        })
        // converting base64 into arraybuffer by decoding 
        let imageData = decode(fileBase64);//give us arraybuffer of that file
        let { data, error } = await supabase
            .storage
            .from('uploads')//Refers to the storage bucket named 'uploads   ' in Supabase.
            .upload(fileName, imageData,
                // filename(jo fileName: The name of the file in the storage.
                //imageData: The actual file content to be uploaded.)
                {
                    cacheControl: '3600',
                    // Sets how long (in seconds) the file can be cached by browsers or CDNs. Here, it's cached for 3600 seconds (1 hour
                    upsert: false,// Prevents overwriting if a file with the same name already exists in the bucket.
                    contentType: isImage ? 'image/*' : 'video/*'
                    // /* mane upload of multiple formate, subtypes (image/* = image/jpeg , image/png....)
                });
        if (error) {

            console.log('file upload error: ', error);
            return { success: false, msg: 'Could not upload media' };
        }
        return {success:true,data:data.path}//supabase mein that data ka ek path property hota ha vo apan return lenge
        /* 
        any doubt about data.path juar check
        https://supabase.com/docs/reference/javascript/storage-from-upload  under response*/


    }
    catch (error) {
        console.log('file upload error: ', error);
        return { success: false, msg: 'Could not upload media' };
    }
}


export const downloadFile = async (url)=>
{
    try {
        const {uri} = await FileSystem.downloadAsync(url,getLocalFilePath(url)) 
        // local getLocalFIlePath give path where be downloaded file is going to save
        // FileSystem is module of expo-file-system to download file 
        // downloadAsync returns a promise, and once the file is downloaded, it provides the file's local URI (local path on the device).
        // u can say u are usein downlaodAsync module form fileSystem ( url , path to sotre the downloaded file)
        
        return uri;
    } catch (error) {
        return null;
    }
}
export const getLocalFilePath = filePath=>{
    let fileName = filePath.split('/').pop(); 
    // url ko thod dega jahan jahan (/ ayage) then pop() is liye taki last split mil jay like(https://home/file/image.png) = image.png

    return `${FileSystem.documentDirectory}${fileName}`;
    // fileSystem.documentDirecotry = is already predifide pathe  (/data/data/com.yourappname/files/.) iykyk 
}

export const getFilePath = (folderName, isImage) => {
    return `${folderName}/${(new Date()).getTime()}${isImage ? '.png' : '.mp4'}`

    //! String Interpolation `` : It allows you to insert variables or expressions directly inside a string without needing to concatenate them with +.
    //its will return below if we adding anything inside profiles folder 
    //profiles/576765457.png
    //its will return below if we adding anything inside images folder 
    //images/576765454.png
}




// ! supabase uploadin files in folder ( for react native)
/* 1. Base64
What is it?
Base64 is a way to encode binary data (like images or files) into text, using a set of 64 different characters. It turns binary data into a string that can be easily transferred over text-based protocols like HTTP.

Why use it?
It’s helpful for sending files over networks, such as uploading an image or document. However, the downside is that the file becomes larger (around 33% larger than the original).

2. decode() Function
What is it?
The decode() function is used to convert a Base64-encoded string back into its original binary format (which is called an ArrayBuffer in JavaScript). This is necessary for uploading the file as actual data.

Why use it?
We need the original binary data (as an ArrayBuffer) to send it to a server, like Supabase, because the server expects the raw data (not just a Base64 string).

3. ArrayBuffer
What is it?
An ArrayBuffer is a data type in JavaScript used to represent a fixed-length sequence of binary data. It's a way of storing raw binary data like images, audio files, etc.

Why use it?
When uploading files, especially images or videos, the server needs to handle the data in binary form (not text). ArrayBuffer is the format that lets you store and send that binary data.

4. .upload() Method
What is it?
.upload() is a function from Supabase’s storage system. It allows you to upload files to a specific "bucket" (a place to store files). This method needs the file data, the bucket name, and the path (where the file will be saved).

Why use it?
It’s the method that actually sends the data (in this case, the ArrayBuffer) to Supabase’s storage and stores it under a specified path, like avatars/avatar.png.

5. Content Type (contentType)
What is it?
The contentType is a header used to tell the server what kind of file you're uploading. For example, if you're uploading a PNG image, the content type is image/png.

Why use it?
The server needs to know what type of file it’s receiving (image, video, text, etc.), so it can handle it correctly. It helps to process the file properly when it's received.

Simple Example
Imagine you have an image you want to upload:

The image is encoded into Base64 so it can be sent as text over the internet.
You then decode the Base64 string back to its original form (binary data) using decode().
This binary data is then stored in an ArrayBuffer, which is like a container for raw binary data.
You use .upload() to send this binary data to Supabase’s storage.
You also specify that the file is an image with the content type (image/png), so the server knows how to handle it.
Why is this important?
Base64: Makes it easy to transfer files as text.
decode(): Converts Base64 back to a file.
ArrayBuffer: Stores the actual file data in a binary format.
.upload(): Sends the file to Supabase.
Content Type: Informs the server what type of file you're sending, ensuring it's processed correctly.













 */