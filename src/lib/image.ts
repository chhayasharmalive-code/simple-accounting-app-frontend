/**
 * Reads a File, crops it to a center square, resizes it to target size,
 * and outputs a base64 JPEG data URL under the specified maximum size.
 *
 * @param file The uploaded image file
 * @param targetSize The width/height of the square crop (default 400px)
 * @param maxSizeBytes The maximum size limit (default 500KB)
 */
export function processAvatarImage(
  file: File,
  targetSize = 400,
  maxSizeBytes = 500 * 1024
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Could not create canvas drawing context.'))
          return
        }

        // Calculate center crop square dimensions
        const sourceSize = Math.min(img.width, img.height)
        const sourceX = (img.width - sourceSize) / 2
        const sourceY = (img.height - sourceSize) / 2

        canvas.width = targetSize
        canvas.height = targetSize

        // Draw the cropped center portion of the image onto the square canvas
        ctx.drawImage(
          img,
          sourceX,
          sourceY,
          sourceSize,
          sourceSize,
          0,
          0,
          targetSize,
          targetSize
        )

        // Export as JPEG and dynamically adjust quality to stay below size threshold
        let quality = 0.9
        let base64 = canvas.toDataURL('image/jpeg', quality)

        // Base64 encoding size is roughly 4/3 of binary size
        while (base64.length * 0.75 > maxSizeBytes && quality > 0.1) {
          quality -= 0.1
          base64 = canvas.toDataURL('image/jpeg', quality)
        }

        resolve(base64)
      }
      img.onerror = () => reject(new Error('Error loading image source.'))
      img.src = e.target?.result as string
    }
    reader.onerror = () => reject(new Error('Error reading image file.'))
    reader.readAsDataURL(file)
  })
}
