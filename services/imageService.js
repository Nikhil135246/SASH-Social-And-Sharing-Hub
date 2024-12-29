import * as FileSystem from 'expo-file-system'


export const getUserImageSrc = imagePath => {

    if (imagePath) {
        return { uri: imagePath }//returning opbject if we found imagepath
    } else {
        return require('../assets/images/defaultUser.png');
    }
}

export const uploadFile = async (folderName, fileUri, isImage = true) => {
    try {
        let fileName = getFilePath(folderName, isImage);//! generating filename 
        const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
            /* await keyword is used with asynchronous functions. It tells JavaScript to pause execution at that point in the code until the Promise is resolved (either fulfilled or rejected). */
            encoding: FileSystem.EncodingType.Base64// we have base64 data 
        })
        // converting base64 into arraybuffer by decoding 
        let imageData = decode
    }
    catch (error) {
        console.log('file upload error: ', error);
        return { success: false, msg: 'Could not upload media' };
    }
}

export const getFilePath = (folderName, isImage) => {
    return `/${folderName}/${(new Date()).getTime()}${isImage ? '.png' : '.mp4'}`

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