import React, { useState } from 'react';
import {
  Button,
  Input,
  FormControl,
  FormLabel,
  useToast,
} from '@chakra-ui/react';

const FileUploader = ({ onFileUpload }) => {
  const [file, setFile] = useState(null);
  const toast = useToast();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, выберите файл для загрузки.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:5000/recognize', {
        method: 'POST',
        body: formData,
        // Не устанавливайте заголовок Content-Type!
      });

      if (response.ok) {
        const data = await response.json();
        onFileUpload(data);
        toast({
          title: 'Успешно',
          description: 'Файл успешно загружен.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error('Ошибка при загрузке файла');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <FormControl>
      <FormLabel htmlFor='file'>Загрузить файл</FormLabel>
      <Input
        type='file'
        id='file'
        accept='.pdf,.doc,.docx'
        onChange={handleFileChange}
      />
      <Button mt={2} onClick={handleSubmit}>
        Отправить на сервер
      </Button>
    </FormControl>
  );
};

export default FileUploader;

