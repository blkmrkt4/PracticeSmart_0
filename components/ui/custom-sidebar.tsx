"use client";

import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Menu, 
  X,
  LayoutDashboard,
  Calendar,
  Activity,
  Users,
  FileText,
  Home,
  LogIn,
  Settings,
  UserPlus,
} from "lucide-react";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-screen px-4 py-4 hidden md:flex md:flex-col bg-black border-r border-white/10 w-[300px] flex-shrink-0",
        className
      )}
      animate={{
        width: animate ? (open ? "300px" : "60px") : "300px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-16 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-black border-b border-white/10 w-full"
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <Menu
            className="text-white cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 bg-black p-10 z-[100] flex flex-col justify-between",
                className
              )}
            >
              <div
                className="absolute right-10 top-10 z-50 text-white cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                <X />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  isActive,
  className,
  ...props
}: {
  link: Links;
  isActive?: boolean;
  className?: string;
  props?: LinkProps;
}) => {
  const { open, animate } = useSidebar();
  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar py-3 px-2 rounded-lg transition-colors",
        isActive 
          ? "bg-primary/10 text-white" 
          : "text-gray-200 hover:text-white hover:bg-white/5",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-black/30">
        {link.icon}
      </div>
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-inherit text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </motion.span>
    </Link>
  );
};

export const SidebarHeader = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div 
      className={cn(
        "flex items-center mb-6",
        className
      )}
      {...props}
    >
      <div className="size-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
        PS
      </div>
    </div>
  );
};

export const SidebarFooter = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div 
      className={cn(
        "mt-auto pt-4 text-xs text-gray-500",
        className
      )}
      {...props}
    />
  );
};

export const SidebarDivider = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div 
      className={cn(
        "border-t border-white/10 my-4",
        className
      )}
      {...props}
    />
  );
};

// Predefined navigation links with colorful icons
export const mainNavLinks: Links[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5 text-blue-400" />,
  },
  {
    label: "Training Plans",
    href: "/build",
    icon: <Calendar className="h-5 w-5 text-green-400" />,
  },
  {
    label: "Activities",
    href: "/activities/new",
    icon: <Activity className="h-5 w-5 text-yellow-400" />,
  },
  {
    label: "Teams",
    href: "/teams",
    icon: <Users className="h-5 w-5 text-purple-400" />,
  },
  {
    label: "Plan Exports",
    href: "/export",
    icon: <FileText className="h-5 w-5 text-pink-400" />,
  },
  {
    label: "Back to Landing Page",
    href: "/",
    icon: <Home className="h-5 w-5 text-teal-400" />,
  },
];

export const secondaryNavLinks: Links[] = [
  {
    label: "Log in/Out",
    href: "/auth",
    icon: <LogIn className="h-5 w-5 text-orange-400" />,
  },
  {
    label: "Manage Account",
    href: "/account",
    icon: <Settings className="h-5 w-5 text-cyan-400" />,
  },
  {
    label: "Invite new Users",
    href: "/invite",
    icon: <UserPlus className="h-5 w-5 text-lime-400" />,
  },
];
