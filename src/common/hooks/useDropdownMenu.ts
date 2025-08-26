import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useUiStore, type DropdownId } from "../../lib/store/ui";
import { UI_MIN_SPACE_BELOW } from "../constants/ui";

export function useDropdownMenu(
  menuId: Exclude<DropdownId, null>,
  opts?: { minSpaceBelow?: number },
) {
  const [open, setOpen] = useState(false);
  const [flipUp, setFlipUp] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const openMenu = useUiStore((s) => s.openMenu);
  const setOpenMenu = useUiStore((s) => s.setOpenMenu);
  const minSpace = opts?.minSpaceBelow ?? UI_MIN_SPACE_BELOW;

  useLayoutEffect(() => {
    if (!open) {
      return;
    }
    const btn = buttonRef.current;
    if (!btn) {
      return;
    }
    const rect = btn.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    setFlipUp(spaceBelow < minSpace);
  }, [open, minSpace]);

  useEffect(() => {
    if (openMenu !== menuId && open) {
      setOpen(false);
    }
  }, [openMenu, menuId, open]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    setOpenMenu(next ? menuId : null);
  };

  const close = () => {
    setOpen(false);
    setOpenMenu(null);
  };

  return { open, toggle, close, buttonRef, flipUp } as const;
}

export default useDropdownMenu;
