"use client"

import Link from "next/link"
import { redirect, usePathname, useRouter } from "next/navigation"
import { ReactNode, useEffect, useState } from "react"
import { ChartColumn, DoorOpen, LogOut, Menu, NotebookText, Package, Tags, Wrench, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { signIn, signOut, useSession } from "next-auth/react"
import ProfileImageAndPlaceHolder from "./profileImageWidget"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function SideBarWrapper({ children }: { children: ReactNode }) {
    // managing state vars
    const [isSideBarCollapsed, setSideBarCollapsedState] = useState(true)
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [windowWidth, setWindowWidth] = useState(0)
    
    // Get current path for active state
    const pathname = usePathname()

    // Get the current user session on page load
    const { data: session } = useSession()

    // Handle window resize
    useEffect(() => {
        // Set initial width
        setWindowWidth(window.innerWidth)
    
        const handleResize = () => {
            setWindowWidth(window.innerWidth)
            if (window.innerWidth >= 1024) {
                setMobileMenuOpen(false)
            }
        }
    
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])


    // handle page change
    const onPageChange = () => { 
        setMobileMenuOpen(false)
        setSideBarCollapsedState(true)
    }


    // side bar tabs
    const sideBarItems = [
        {
            icon: ChartColumn,
            title: "Admin Panel",
            link: "/admin"
        },
        {
            icon: NotebookText,
            title: "Orders Record",
            link: "/orders",
            
        },
        {
            icon: Package,
            title: "Products Section",
            link: "/products"
        },
        {
            icon: Tags,
            title: "Products Categories",
            link: "/categories"
        },
        {
            icon: Wrench,
            title: "Preferences",
            link: "/preferences"
        },
    ]

    //* profile details widget
    const ProfileWidget = () => {
        //* in case no user is signed in
        if (!session?.user) return (
            <div className="border-b px-1 py-2 flex justify-between">
                <Button
                    onClick={() => signIn("google",{callbackUrl:"/"})}
                    className=""> 
                    {isSideBarCollapsed ? <DoorOpen size={25} /> : 
                    <h1>Sign In first</h1>}
                </Button>
            </div>
        )
        
        // already signed in user
        return (
            <div className="flex items-center border-b pb-2 bg-background">
                {/* user profile image */}
                <div className="w-38 h-38 flex-shrink-0">
                    <ProfileImageAndPlaceHolder 
                        userImage={session?.user.image ?? undefined} 
                        userName={session?.user.name ?? ''} 
                    />
                </div>
                {/* user profile details */}
                <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    animate={{ 
                        opacity: isSideBarCollapsed ? 0 : 1, 
                        width: isSideBarCollapsed ? 0 : "auto" 
                    }}
                    className="text-sm font-medium pt-2 line-clamp-1 ml-2 whitespace-nowrap"
                >
                    {/* user name and role badge*/}
                    <div className="flex gap-1 px-2">
                        <h1>{session?.user.name}</h1>
                        <Badge 
                            variant="destructive" 
                            className="text-xs font-light px-1 bg-blue-600"
                        >
                            {session?.user.role}
                        </Badge> 
                    </div>
                    {/* user email */}
                    <h1 className="text-xs font-medium text-gray-600 line-clamp-1">
                        {session?.user.email}
                    </h1>
                </motion.div>
            </div>
        )
    }

    async function handleSignOut() {
        await signOut({ callbackUrl: "/sign-in" })
    }

    return (
        <div className="flex h-screen overflow-hidden">
            <AnimatePresence>
                {/* Mobile backdrop */}
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileMenuOpen(false)}
                        className="fixed inset-0 bg-black lg:hidden z-30"
                    />
                )}

                {/* side bar */}
                <motion.div 
                    className={`fixed lg:relative h-screen overflow-x-hidden z-40 bg-background
                        ${isMobileMenuOpen ? 'block' : 'hidden'} lg:block`}
                    initial={{ width: "56px", x: -200 }}
                    animate={{ 
                        width: isSideBarCollapsed ? "56px" : "250px",
                        x: isMobileMenuOpen || windowWidth >= 1024 ? 0 : -200 
                    }}
                    onHoverStart={() => !isMobileMenuOpen && setSideBarCollapsedState(false)}
                    onHoverEnd={() => !isMobileMenuOpen && setSideBarCollapsedState(true)}
                    transition={{ duration: 0.4 }}
                >
                    <aside>
                        <div>
                            {/* user profile widget */}
                            <ProfileWidget />
                            {/* other stuff */}
                            <nav className="space-y-2 pt-2">
                                {sideBarItems.map((tab,index) => {
                                    const isActive = pathname === tab.link
                                    return (
                                        <Link
                                            key={tab.link + index}
                                            href={tab.link}
                                            onClick={() => onPageChange()}
                                            className={`flex items-center gap-3 p-3 transition-colors 
                                                ${isActive 
                                                    ? "bg-blue-400/10 text-blue-600" 
                                                    : "hover:bg-blue-400/5"
                                                }`}
                                        >
                                            <div className="w-5 h-5">
                                                <tab.icon 
                                                    className={`w-5 h-5 ${
                                                        isActive ? "text-blue-600" : ""
                                                    }`} 
                                                />
                                            </div>
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                animate={{ opacity: isSideBarCollapsed ? 0 : 1 }}
                                            >
                                                {!isSideBarCollapsed && (
                                                    <span className={`${
                                                        isActive ? "font-medium" : ""
                                                    } line-clamp-1 whitespace-nowrap`}>
                                                        <h1 className="text-sm font-medium">
                                                            {tab.title}
                                                        </h1>
                                                    </span>
                                                )}
                                            </motion.div>
                                        </Link>
                                    )
                                })}

                                {/* sign out */}
                                {session && <div
                                    onClick={() => handleSignOut()}
                                    className="text-red-900 flex hover:bg-blue-200/10 px-4 py-2 gap-2 cursor-pointer">
                                    <LogOut />
                                    {!isSideBarCollapsed && (
                                                    <span className={`line-clamp-1 whitespace-nowrap`}>
                                                        <h1 className="text-sm font-medium">
                                                            Sign out
                                                        </h1>
                                                    </span>
                                                )}
                                </div>}
                            </nav>
                        </div>
                    </aside>
                </motion.div>
            </AnimatePresence>

            {/* main content */}
            <main className="flex-1 overflow-y-auto border-l">
                {/* Mobile menu toggle button */}
                <button 
                    onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                    className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-background shadow-sm"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                
                <div className="">
                    {children}
                </div>
            </main>
        </div>
    )
}