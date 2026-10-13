import React, { useState } from 'react';
import { PROFILE_PHOTO, PERSONAL_INFO } from '../data/profile';

interface ProfileImageProps {
  className?: string;
  rounded?: string;
  alt?: string;
}

/**
 * Menampilkan foto pribadi Rizka dari public/assets/rizka.png.
 * Bila file belum tersedia (404 / gagal load), otomatis menampilkan
 * avatar inisial "RFD" bernuansa biru sebagai cadangan.
 */
export const ProfileImage: React.FC<ProfileImageProps> = ({
  className = '',
  rounded = 'rounded-3xl',
  alt = `Foto ${PERSONAL_INFO.name}`,
}) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden ${rounded} ${className}`}
        style={{
          background:
            'linear-gradient(150deg, var(--accent-soft) 0%, var(--accent) 55%, var(--accent-strong) 100%)',
        }}
      >
        <span className="font-heading font-extrabold text-white/95 tracking-tight text-[clamp(1.75rem,7vw,3.5rem)]">
          {PERSONAL_INFO.initials}
        </span>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/15 blur-md" />
      </div>
    );
  }

  return (
    <img
      src={PROFILE_PHOTO}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={`object-cover object-top ${rounded} ${className}`}
    />
  );
};
