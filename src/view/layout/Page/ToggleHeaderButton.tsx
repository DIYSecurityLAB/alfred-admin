import { ChevronDown, ChevronUp } from 'lucide-react';

type ToggleHeaderButtonProps = {
  toggle: () => void;
  collapsed: boolean;
};

export function ToggleHeaderButton({
  collapsed,
  toggle,
}: ToggleHeaderButtonProps) {
  return (
    <button
      onClick={toggle}
      className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
    >
      {collapsed ? (
        <ChevronDown className="h-5 w-5 text-blue-500" />
      ) : (
        <ChevronUp className="h-5 w-5 text-blue-500" />
      )}
    </button>
  );
}
