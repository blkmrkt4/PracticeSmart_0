"use client";

import './globals.css'
import { usePathname } from 'next/navigation';
import { 
  Sidebar, 
  SidebarBody, 
  SidebarHeader, 
  SidebarLink, 
  SidebarDivider, 
  SidebarFooter,
  mainNavLinks,
  secondaryNavLinks
} from '@/components/ui/custom-sidebar';
import { Toaster } from "@/components/ui/toaster";
// Metadata is exported from metadata.ts

// Metadata is exported from metadata.ts

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  return (
    <html lang="en">
      <body>
        {isLandingPage ? (
          children
        ) : (
          <div className="flex min-h-screen bg-black">
            <Sidebar>
              <SidebarBody>
                <SidebarHeader />
                
                {/* Main navigation links */}
                <div className="space-y-1">
                  {mainNavLinks.map((link) => (
                    <SidebarLink 
                      key={link.href}
                      link={link}
                      isActive={link.href === '/'
                        ? pathname === '/'
                        : pathname.startsWith(link.href)}
                    />
                  ))}
                </div>
                
                <SidebarDivider />
                
                {/* Secondary navigation links */}
                <div className="space-y-1">
                  {secondaryNavLinks.map((link) => (
                    <SidebarLink 
                      key={link.href}
                      link={link}
                      isActive={pathname.startsWith(link.href)}
                    />
                  ))}
                </div>
                
                <SidebarFooter>
                  &copy; {new Date().getFullYear()} PracticeSmart
                </SidebarFooter>
              </SidebarBody>
              
              {/* Main content */}
              <div className="flex-1 overflow-auto bg-black text-white">
                {children}
              </div>
            </Sidebar>
          </div>
        )}
        <Toaster />
      </body>
    </html>
  )
}
