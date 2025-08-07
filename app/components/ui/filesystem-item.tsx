import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, File, Folder } from 'lucide-react';
import { useState } from 'react';

type Node = {
  name: string;
  isOpen?: boolean;
  nodes?: Node[];
};

interface FilesystemItemProps {
  node: Node;
  animated?: boolean;
}

export function FilesystemItem({
  node,
  animated = false,
}: FilesystemItemProps) {
  const [isOpen, setIsOpen] = useState(Boolean(node.isOpen));

  // Общий контент для обоих вариантов
  const ChevronIcon = () =>
    animated ? (
      <motion.span
        animate={{ rotate: isOpen ? 90 : 0 }}
        className="flex"
        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
      >
        <ChevronRight className="size-4 text-gray-500" />
      </motion.span>
    ) : (
      <ChevronRight
        className={`size-4 text-gray-500 ${isOpen ? 'rotate-90' : ''}`}
      />
    );

  const ChildrenList = () => {
    const children = node.nodes?.map((node) => (
      <FilesystemItem animated={animated} key={node.name} node={node} />
    ));

    if (animated) {
      return (
        <AnimatePresence>
          {isOpen && (
            <motion.ul
              animate={{ height: 'auto' }}
              className="flex flex-col justify-end overflow-hidden pl-6"
              exit={{ height: 0 }}
              initial={{ height: 0 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            >
              {children}
            </motion.ul>
          )}
        </AnimatePresence>
      );
    }

    return isOpen && <ul className="pl-6">{children}</ul>;
  };

  return (
    <li className="list-none" key={node.name}>
      <span className="flex items-center gap-1.5 py-1">
        {node.nodes && node.nodes.length > 0 && (
          <button
            className="-m-1 p-1"
            onClick={() => setIsOpen(!isOpen)}
            type="button"
          >
            <ChevronIcon />
          </button>
        )}

        {node.nodes ? (
          <Folder
            className={`size-6 fill-sky-500 text-sky-500 ${
              node.nodes.length === 0 ? 'ml-[22px]' : ''
            }`}
          />
        ) : (
          <File className="ml-[22px] size-6 text-gray-900" />
        )}
        {node.name}
      </span>

      <ChildrenList />
    </li>
  );
}
