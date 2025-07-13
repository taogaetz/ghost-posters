import Compressor from 'compressorjs';

export async function compressImage(file: File): Promise<Blob> {
   return new Promise((resolve, reject) => {
     new Compressor(file, {
       convertSize: 2000000, // png over 2mb becomes jpg
       quality: 0.6, // Aggressive compression
       maxWidth: 1600, 
       maxHeight: 1600, 
       success(result) {
         resolve(result as Blob);
       },
       error(err) {
         console.error('Image compression failed:', err.message);
         reject(err);
       },
     });
   });
 }
