import { IconMenu2, IconX } from '@tabler/icons-react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'motion/react';
import React, { useRef, useState } from 'react';
import { Link } from 'react-router';
import { cn } from '~/lib/utils';

interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface NavItemsProps {
  items: {
    name: string;
    link: string;
  }[];
  className?: string;
  onItemClick?: () => void;
}

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface MobileNavHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface MobileNavMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Navbar = ({ children, className }: NavbarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState<boolean>(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (latest > 50) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  return (
    <motion.div
      className={cn('sticky inset-x-0 top-0 z-50 w-full', className)}
      ref={ref}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{ visible?: boolean }>,
              { visible }
            )
          : child
      )}
    </motion.div>
  );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
  return (
    <motion.div
      animate={{
        opacity: visible ? 1 : 0.98,
        scale: visible ? 0.95 : 1,
        y: visible ? 8 : 0,
      }}
      className={cn(
        'relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-2xl px-6 py-4 lg:flex',
        visible ? 'tinted-blur border border-border-strong' : 'bg-transparent',
        className
      )}
      style={{
        minWidth: '800px',
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
    >
      {children}
    </motion.div>
  );
};

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);

  return (
    <nav 
      className={cn(
        'absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 font-medium text-sm text-text-primary transition duration-150 lg:flex lg:space-x-2',
        className
      )}
      onMouseLeave={() => setHovered(null)}
      role="navigation"
      aria-label="Main navigation"
    >
      {items.map((item, idx) => (
        <Link
          className="relative px-4 py-2.5 text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 rounded-full transition-colors duration-150"
          key={`link-${idx.toString()}`}
          onClick={onItemClick}
          onMouseEnter={() => setHovered(idx)}
          onFocus={() => setFocused(idx)}
          onBlur={() => setFocused(null)}
          to={item.link}
        >
          {(hovered === idx || focused === idx) && (
            <motion.div
              className="absolute inset-0 h-full w-full rounded-full bg-white/10 border border-border-hairline"
              layoutId={focused === idx ? 'focused' : 'hovered'}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            />
          )}
          <span className="relative z-20">{item.name}</span>
        </Link>
      ))}
    </nav>
  );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
  return (
    <motion.div
      animate={{
        opacity: visible ? 1 : 0.98,
        scale: visible ? 0.95 : 1,
        y: visible ? 4 : 0,
      }}
      className={cn(
        'relative z-50 mx-auto flex w-full max-w-[calc(100vw-1rem)] flex-col items-center justify-between px-4 py-4 lg:hidden rounded-2xl',
        visible ? 'tinted-blur border border-border-strong' : 'bg-transparent',
        className
      )}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
    >
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({
  children,
  className,
}: MobileNavHeaderProps) => {
  return (
    <div
      className={cn(
        'flex w-full flex-row items-center justify-between',
        className
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavMenu = React.forwardRef<HTMLElement, MobileNavMenuProps>(({ children, className, isOpen }, ref) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.section
          ref={ref}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className={cn(
            'absolute inset-x-0 top-20 z-50 flex w-full flex-col items-start justify-start gap-6 glass-card-strong text-text-primary',
            className
          )}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          role="region"
          aria-label="Mobile navigation menu"
        >
          {children}
        </motion.section>
      )}
    </AnimatePresence>
  );
});

MobileNavMenu.displayName = 'MobileNavMenu';

export const MobileNavToggle = React.forwardRef<HTMLButtonElement, {
  isOpen: boolean;
  onClick: () => void;
}>(({ isOpen, onClick }, ref) => {
  return (
    <motion.button
      ref={ref}
      className="inline-flex items-center justify-center size-11 rounded-full bg-white/5 border border-border-hairline hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 active:translate-y-[1px] transition-all duration-150"
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      aria-expanded={isOpen}
      aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
      type="button"
    >
      {isOpen ? (
        <IconX className="text-text-primary size-5" aria-hidden="true" />
      ) : (
        <IconMenu2 className="text-text-primary size-5" aria-hidden="true" />
      )}
    </motion.button>
  );
});

MobileNavToggle.displayName = 'MobileNavToggle';

export const NavbarLogo = () => {
  return (
    <Link
      className="relative z-20 mr-4 flex items-center space-x-3 px-3 py-2 rounded-full hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 transition-all duration-150 group"
      to="/"
      aria-label="Go to homepage"
    >
      <div className="size-8 rounded-full bg-gradient-to-br from-accent to-accent-alt flex items-center justify-center" role="img" aria-hidden="true">
        <img
          alt=""
          height={20}
          src="https://assets.aceternity.com/logo-dark.png"
          width={20}
          className="filter invert"
          role="presentation"
        />
      </div>
      <span className="font-medium text-text-primary text-base group-hover:text-accent transition-colors duration-150">Genii</span>
    </Link>
  );
};

export const NavbarButton = ({
  href,
  as: Tag = 'a',
  children,
  className,
  variant = 'primary',
  ...props
}: {
  href?: string;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary';
} & (
  | React.ComponentPropsWithoutRef<'a'>
  | React.ComponentPropsWithoutRef<'button'>
)) => {
  const variantStyles = {
    primary: 'btn-primary',
    secondary: 'btn-ghost',
  };

  return (
    <Tag
      className={cn(variantStyles[variant], className)}
      href={href || undefined}
      {...props}
    >
      {children}
    </Tag>
  );
};
