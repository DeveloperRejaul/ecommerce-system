import { BASE_URL } from "@/core/constant/constant";

export const urlToFile = async (url: string): Promise<File> => {
    const finalUrl = `${BASE_URL}/file/${url}`;

    const response = await fetch(finalUrl);
    const blob = await response.blob();

    const fileName = url.split('.').shift() || 'file';
    return new File([blob], fileName, { type: blob.type });
};