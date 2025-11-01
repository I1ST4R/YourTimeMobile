// encryptionUtils.ts
import { Buffer } from 'buffer';

// Простая реализация без crypto модуля
export const encryptData = (data: any, key: string): string => {
  try {
    const dataString = JSON.stringify(data);
    
    // Простое кодирование base64 с ключом
    const combined = key + dataString;
    const encoded = Buffer.from(combined).toString('base64');
    
    return encoded;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Ошибка при шифровании данных');
  }
};

export const decryptData = (encryptedData: string, key: string): any => {
  try {
    // Декодируем base64
    const decoded = Buffer.from(encryptedData, 'base64').toString('utf8');
    
    // Проверяем что данные начинаются с ключа
    if (!decoded.startsWith(key)) {
      throw new Error('Неверный ключ');
    }
    
    // Убираем ключ и парсим JSON
    const dataString = decoded.slice(key.length);
    return dataString;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Ошибка при расшифровке данных. Проверьте ключ.');
  }
};