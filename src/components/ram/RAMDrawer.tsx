import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";

interface RAMDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function RAMDrawer({ open, onClose, title, children, footer }: RAMDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent className="rounded-t-ram-3xl shadow-ram-lg max-h-[90vh]">
        <DrawerHeader className="text-center">
          <DrawerTitle className="text-text-lg font-extrabold text-foreground">
            {title}
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-ram-2xl py-ram-xl overflow-y-auto">{children}</div>
        {footer && (
          <DrawerFooter className="px-ram-2xl pb-ram-3xl">{footer}</DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
