/* eslint-disable @typescript-eslint/no-explicit-any */
import { TouchableOpacity, View, Platform } from 'react-native';
import React, { createRef, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { animatedAlert } from './AnimatedAlert';
import Avatar from './avatar';

interface IAvatarImagePackerProps {
  src: string;
  onChange?: (value:any) => void;
}

export default function AvatarImagePacker(props: IAvatarImagePackerProps) {
  const { src, onChange } = props;
  const fileInputRef = createRef<HTMLInputElement>();
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [files, setFiles] = useState<ImagePicker.ImagePickerResult | File | null>(null);

  const getFileUrl = ():string | null => {
    if (files instanceof File) {
      return URL.createObjectURL(files);
    }
    if (files?.assets && files?.assets[0]) {
      return files?.assets[0].uri;
    }
    if (src) return src;
    return null;
  };

  const pickImage = async () => {
    let isPermitted = status?.granted;
    if (!isPermitted) {
      const { granted } = await requestPermission();
      isPermitted = granted;
    }

    if (isPermitted) {
      const image = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!image.canceled) {
        setFiles(image);
        onChange?.(image);
      }
      return;
    }
    animatedAlert.show({ message: 'Need permission' });
  };

  const handleClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  return (
    <View>
      {Platform.OS === 'web' ? (
        <TouchableOpacity onPress={handleClick}>
          <input
            id="picture"
            accept="image/*"
            ref={fileInputRef}
            type="file"
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            onChange={(e) => { onChange?.(e.target.files[0]); setFiles(e.target.files[0]); }}
            style={{ display: 'none', height: '100%', width: '100%' }}
          />
          <Avatar src={getFileUrl()} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={pickImage}>
          <Avatar src={getFileUrl()} />
        </TouchableOpacity>
      )}
    </View>
  );
}
