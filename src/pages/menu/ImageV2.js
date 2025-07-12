import Image from 'next/image';
import {useState} from 'react';

const RetryableImage = ({src, alt, ...props}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const handleError = () => {
    if (retryCount < MAX_RETRIES) {
      // Add a cache buster to force reload
      const newSrc = `${src}?reload=${Date.now()}`;
      setImgSrc(newSrc);
      setRetryCount(retryCount + 1);
    } else {
      console.warn('Image failed to load after retries:', src);
    }
  };

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={handleError}
    />
  );
};

export default RetryableImage;
