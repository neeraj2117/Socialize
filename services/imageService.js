import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../lib/supabase';
import { supabaseUrl } from '../constants';


export const getUserImageSrc = imagePath => {
    if (imagePath){
        return getSupabaseFileUrl(imagePath);
    }else{
        return require('../assets/images/defaultUser.png')
    }
}

export const getSupabaseFileUrl = filePath => {
    if (filePath){
        return {uri: `${supabaseUrl}/storage/v1/object/public/uploads/${filePath}`};
    }   
    return null;
}

export const downloadFile = async (url) =>{
    try {
        const {uri} = await FileSystem.downloadAsync(url, getLocalFilePath(url));
        return uri;
    } catch (error) {
        return null;
    }
}

export const getLocalFilePath = filePath =>{
    let fileName = filePath.split('/').pop();
    return `${FileSystem.documentDirectory}${fileName}`;
}


export const uploadFile = async(folderName, fileUri, isImage=true) => {
    try {        
        let fileName = getFilePath(folderName, isImage);
        console.log('Generated file name:', fileName);
        
        // Read the file as a Base64 encoded string
        const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.Base64
        });

        // Decode the Base64 string to binary data
        let imageData = decode(fileBase64);

        // Upload the file to Supabase storage
        let {data, error} = await supabase
            .storage
            .from('uploads')
            .upload(fileName, imageData, {
                contentType: isImage ? 'image/*' : 'video/*',
                cacheControl: '3600',
                upsert: false
            });

        if (error) {  
            console.log('Error uploading file:', error);
            return {success: false, msg: 'Could not upload media'};
        }
        
        return {success: true, data: data.path};
    } catch (error) {
        console.log('File upload error -', error);
        return {success: false, msg: 'Could not upload media'};
    }
};

export const getFilePath = (folderName, isImage) => {
    return `/${folderName}/${(new Date()).getTime()}${isImage ? '.png' : '.mp4'}`;
};


