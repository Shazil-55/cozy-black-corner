
import api from "./api";

export const fileService = {
  // Upload file
  uploadFile: async (fileToUpload: File) => {
    try {
      const formData = new FormData();
      formData.append('fileToUpload', fileToUpload);
      
      const response = await api.post(
        '/common/upload-file',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to upload file:', error);
      throw error;
    }
  }
};
