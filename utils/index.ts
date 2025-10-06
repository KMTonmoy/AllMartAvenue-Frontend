import axios from 'axios';

export interface ImageUploadResponse {
  data: {
    display_url: string;
  };
}

export interface ImgBBResponse {
  data: {
    id: string;
    title: string;
    url_viewer: string;
    url: string;
    display_url: string;
    width: string;
    height: string;
    size: string;
    time: string;
    expiration: string;
    image: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    thumb: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    delete_url: string;
  };
  success: boolean;
  status: number;
}

export const imageUpload = async (image: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', image);

  const { data } = await axios.post<ImgBBResponse>(
    'https://api.imgbb.com/1/upload?key=19c9072b07556f7849d6dea75b7e834d',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return data.data.display_url;
};