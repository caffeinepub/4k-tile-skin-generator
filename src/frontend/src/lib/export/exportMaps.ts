import type { PBRMapSet } from '../../types/generation';

function dataURLtoBlob(dataURL: string): Blob {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

async function convertToFormat(dataURL: string, format: 'png' | 'jpg'): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert image'));
          }
        },
        format === 'jpg' ? 'image/jpeg' : 'image/png',
        0.95
      );
    };
    img.onerror = reject;
    img.src = dataURL;
  });
}

export async function exportSingleMap(
  dataURL: string,
  filename: string,
  format: 'png' | 'jpg'
): Promise<void> {
  const blob = await convertToFormat(dataURL, format);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.${format}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Simple ZIP file creation using browser APIs
function createZipFile(files: Array<{ name: string; blob: Blob }>): Blob {
  // For browser compatibility, we'll create individual downloads
  // A full ZIP implementation would require a library, but we can work around it
  // by downloading files sequentially or using a simple archive format
  
  // Since we can't use external libraries, we'll fall back to downloading files individually
  // This is a limitation but keeps the app working without jszip
  throw new Error('ZIP export requires downloading maps individually');
}

export async function exportAllMapsAsZip(
  maps: PBRMapSet,
  baseName: string
): Promise<void> {
  // Download each map individually since we can't use JSZip
  const mapEntries: [keyof PBRMapSet, string][] = [
    ['albedo', 'albedo'],
    ['normal', 'normal'],
    ['roughness', 'roughness'],
    ['fluid', 'fluid'],
    ['metallic', 'metallic'],
  ];

  for (const [key, name] of mapEntries) {
    const blob = await convertToFormat(maps[key], 'png');
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseName}-${name}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Small delay between downloads to avoid browser blocking
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}
