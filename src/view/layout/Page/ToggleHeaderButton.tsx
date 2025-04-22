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
      onClick={(e) => {
        e.stopPropagation();
        toggle();
      }}
      className="p-1 sm:p-2 hover:bg-blue-50 rounded-lg transition-colors"
      aria-label={collapsed ? 'Expandir cabeçalho' : 'Recolher cabeçalho'}
    >
      {collapsed ? (
        <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
      ) : (
        <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
      )}
    </button>
  );
}
