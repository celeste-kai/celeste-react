import React, { ReactNode } from 'react';

type IconButtonProps = {
  title?: string;
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
};

function IconButton({ title, onClick, className = '', children }: IconButtonProps) {
  return (
    <button className={className} onClick={onClick} title={title} type="button">
      {children}
    </button>
  );
}

export default IconButton;
