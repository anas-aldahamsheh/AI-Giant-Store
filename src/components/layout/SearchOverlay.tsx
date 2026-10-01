"use client";

import { CommandMenu, type CommandMenuItem } from "@/components/ui/CommandMenu";
import { Modal } from "@/components/ui/Modal";

export type SearchOverlayProps = {
  isOpen: boolean;
  query: string;
  items: CommandMenuItem[];
  onQueryChange: (query: string) => void;
  onSelect: (item: CommandMenuItem) => void;
  onClose: () => void;
};

export function SearchOverlay({
  isOpen,
  query,
  items,
  onQueryChange,
  onSelect,
  onClose,
}: SearchOverlayProps) {
  return (
    <Modal
      isOpen={isOpen}
      title="Search Giant Store"
      description="Find products, categories, and help topics."
      onClose={onClose}
    >
      <CommandMenu
        query={query}
        onQueryChange={onQueryChange}
        items={items}
        onSelect={onSelect}
      />
    </Modal>
  );
}
