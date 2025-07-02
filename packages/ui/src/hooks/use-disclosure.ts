import { useCallback, useRef, useState, type RefObject } from 'react';

export type UseDisclosure = {
  isOpen: any;
  onClose: () => void;
  onOpen: () => void;
  onToggle: () => void;
  setOpen: (value: boolean) => void;
  onOpenChange: (value: boolean) => void;
  isOpenRef: RefObject<boolean>;
};

interface UseDisclosureProps {
  defaultOpen?: boolean;
}

export function useDisclosure(
  props?: UseDisclosureProps & Partial<UseDisclosure>,
) {
  const [isOpen, setOpen] = useState(props?.defaultOpen ?? false);
  const isOpenRef = useRef(props?.defaultOpen);

  const onOpen = useCallback(() => {
    setOpen(() => true);
    isOpenRef.current = true;
    props?.onOpen?.();
  }, [props]);

  const onClose = useCallback(() => {
    setOpen(() => false);
    isOpenRef.current = false;
    props?.onClose?.();
  }, [props]);

  const onToggle = useCallback(() => {
    setOpen((old) => !old);
    isOpenRef.current = !isOpenRef.current;
  }, []);

  const setOpenFn = useCallback((value: boolean) => {
    setOpen(() => value);
    isOpenRef.current = value;
  }, []);

  const onOpenChange = useCallback(
    (value: boolean) => {
      if (!value) {
        onClose();
      } else {
        onOpen();
      }
    },
    [onClose, onOpen],
  );

  return Object.assign(
    {},
    {
      isOpen,
      onClose,
      onOpen,
      onToggle,
      setOpen: setOpenFn,
      onOpenChange,
      isOpenRef,
    },
    props,
  );
}
