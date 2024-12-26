"use client"
import React, { useEffect, useState } from 'react';
import { Search, Moon, Sun, Upload, Users, PlusCircle, X, UserRoundPlus, UserRoundMinus, Pencil, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PreferencesServices from '../services/preferences-services/preferences_services';
import { useSession } from 'next-auth/react';
import ProfileImageAndPlaceHolder from '../components/profileImageWidget';
import { ConfirmActionDialog } from '../components/confirmActionDialog';
import { useToast } from '@/hooks/use-toast';
import { User } from '@prisma/client';
import { useTheme } from "@/app/providers/theme-provider"

const PreferencesPage = () => {
  // Shop Identity States
  const [shopDetails, setShopDetails] = useState({
    name: '',
    image: '',
    isEditing: false
  });
  const [tempShopDetails, setTempShopDetails] = useState({
    name: '',
    image: ''
  });
  const [newImageFile, setNewImageFile] = useState<File | null>(null);

  // Other States
    const [isAddingUser, setIsAddingUser] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [userSearchInput, setUserSearchInput] = useState<string | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [subAdmins, setSubAdmins] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
  
  const preferencesServices = new PreferencesServices();
  const { data: session } = useSession();
    const { toast } = useToast();
    const { theme, setTheme } = useTheme()
  
    const AUTH_USERS = ["ADMIN", "SUB_ADMIN", "DEVELOPER"];
    
    useEffect(() => {
        // Check theme after component mounts
        if (theme === "dark") {
          setIsDarkMode(true);
        } else if (theme === "light") {
          setIsDarkMode(false);
        } else {
          // System theme
          setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
        }
    
        // Listen for system theme changes
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (e: MediaQueryListEvent) => {
          if (theme === "system") {
            setIsDarkMode(e.matches);
          }
        };
    
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
      }, [theme]);
    
      const toggleTheme = (isDark: boolean) => {
        setTheme(isDark ? "dark" : "light");
      };
    

  // Shop Identity Functions
  const handleEditClick = () => {
    setTempShopDetails({
      name: shopDetails.name,
      image: shopDetails.image
    });
    setShopDetails(prev => ({ ...prev, isEditing: true }));
  };

  const handleCancelEdit = () => {
    setShopDetails(prev => ({
      ...prev,
      isEditing: false
    }));
    setNewImageFile(null);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewImageFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setTempShopDetails(prev => ({ ...prev, image: previewUrl }));
    }
  };

  const handleSaveShopDetails = async () => {
    setIsLoading(true);
    try {
      let imageUrl = shopDetails.image;
      
      if (newImageFile) {
        const uploadResponse = await preferencesServices.updateShopIcon(newImageFile);
        if (uploadResponse.success) {
          imageUrl = uploadResponse.data;
        }
      }

      const response = await preferencesServices.updateShopDetails({newName:tempShopDetails.name, newIcon:imageUrl});
      
      if (response.success) {
        setShopDetails({
          name: tempShopDetails.name,
          image: imageUrl,
          isEditing: false
        });
        toast({
          title: "Shop details updated successfully",
          description: "Your changes have been saved"
        });
      }
    } catch (error) {
      toast({
        title: "Error updating shop details",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
    };
    
    function handleUserSearch(e: string): void {
        setUserSearchInput(e)
        setLoadingUsers(true)
        
        // console.log(e)
    }

  // Sub-Admin Management Functions
  const addSubAdmin = async (userId: string, isSubAdmin: boolean) => {
    toast({
      title: "Adding SubAdmin..."
    });
    const response = await preferencesServices.updateUserStateInDb({ userId, isSubAdmin });
    if (response.success) {
      setSubAdmins(prev => [...prev, response.data]);
    }
    toast({
      title: response.message,
      description: response.success ? "Updated!" : response.data 
    });
  };

  const removeSubAdmin = async (userId: string, isSubAdmin: boolean) => {
    toast({
      title: "Removing SubAdmin..."
    });
    const response = await preferencesServices.updateUserStateInDb({ userId, isSubAdmin });
    if (response.success) {
      setSubAdmins(prev => prev.filter(item => item.id !== userId));
    }
    toast({
      title: response.message,
      description: response.success ? "Updated!" : response.data 
    });
  };

  const loadAuthUsers = async () => {
    if (session?.user.role && AUTH_USERS.includes(session.user.role)) {
      const response = await preferencesServices.getUsersListFromDb(null);
      if (response.success) {
        setSubAdmins(response.data);
      }
    }
  };

  const loadSearchedForUsers = async () => {
    if (session?.user.role && AUTH_USERS.includes(session.user.role)) {
      const response = await preferencesServices.getUsersListFromDb(userSearchInput);
      if (response.success) {
        const filteredData = response.data.filter((user: User) => !AUTH_USERS.includes(user.role));
        setAllUsers(filteredData);
      }
    }
    setLoadingUsers(false);
    };
    

    const getShopDetails = async () => {
        const response = await preferencesServices.loadShopDetailsInStart()
        if (response.success) {
            setShopDetails({
                image: response.data.shopIcon,
                name: response.data.shopName,
                isEditing: false
            })
        }
    }

    
    // Apply theme effect
//   useEffect(() => {
//     const root = window.document.documentElement;
//     root.classList.toggle('dark', isDarkMode);
//   }, [isDarkMode]);

  useEffect(() => {
      loadAuthUsers();
      getShopDetails()
  }, [session]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadSearchedForUsers();
    }, 500);
    return () => clearTimeout(timer);
  }, [userSearchInput]);

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Shop Preferences</h1>
          <p className="text-muted-foreground">
            Manage your shop settings and sub-admin permissions.
          </p>
        </div>

        <div className="grid gap-8">
          {/* Shop Identity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Shop Identity</CardTitle>
                <CardDescription>
                  Customize how your shop appears to customers
                </CardDescription>
              </div>
              {!shopDetails.isEditing ? (
                <Button 
                  onClick={handleEditClick}
                  variant="outline"
                  className="gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  Edit Details
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    onClick={handleCancelEdit}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveShopDetails}
                    className="gap-2"
                    disabled={isLoading}
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-6">
                <div className="relative w-40 h-40 border-2 border-dashed rounded-xl flex items-center justify-center bg-muted/50 hover:bg-muted transition-colors">
                  {(shopDetails.isEditing ? tempShopDetails.image : shopDetails.image) ? (
                    <img 
                      src={shopDetails.isEditing ? tempShopDetails.image : shopDetails.image}
                      alt="Shop logo" 
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto w-10 h-10 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mt-2">Upload Logo</p>
                      <p className="text-xs text-muted-foreground">SVG, PNG, JPG</p>
                    </div>
                  )}
                  {shopDetails.isEditing && (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="shopName">Shop Name</Label>
                  <Input
                    id="shopName"
                    value={shopDetails.isEditing ? tempShopDetails.name : shopDetails.name}
                    onChange={(e) => setTempShopDetails(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your shop name"
                    className="max-w-md"
                    disabled={!shopDetails.isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sub-Admins Management */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Sub-Admins</CardTitle>
                <CardDescription>
                  Manage users with administrative access
                </CardDescription>
              </div>
              <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
                <DialogTrigger asChild disabled={session?.user.role !== "ADMIN"}>
                  <Button className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Add Sub-Admin
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Sub-Admin</DialogTitle>
                    <DialogDescription>
                      Search and select a user to grant sub-admin privileges.
                    </DialogDescription>
                  </DialogHeader>
                                  <>
                                      <Input value={userSearchInput ?? ""} onChange={(e) => handleUserSearch(e.target.value)} />
                                      <Badge className='w-fit' variant={"outline"}> Users "{userSearchInput}" </Badge>
                                     
                                              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="flex items-center gap-1">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <ProfileImageAndPlaceHolder userName={user.name} userImage={user.image} />
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{user.addedAt}</TableCell>
                      <TableCell>
                              <Badge variant="secondary">{ user.role }</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                              <ConfirmActionDialog
                                  title={`Add ${user.name} As subAdmin?`}
                                  description={'be carful who you add, the users with sub admin state can edit, delete, and make changes to your shop'}
                                  action={() => {
                                      setIsAddingUser(false)
                                      addSubAdmin(user.id,false)
                                  }} trigger={ <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                            <UserRoundPlus />
                              </Button>} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

                                              
                  </>
                </DialogContent>
              </Dialog>
                         
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Added On</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subAdmins.map(admin => (
                    <TableRow key={admin.id}>
                      <TableCell className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <ProfileImageAndPlaceHolder userName={admin.name} userImage={admin.image} />
                        </div>
                        <div>
                          <p className="font-medium">{admin.name}</p>
                          <p className="text-sm text-muted-foreground">{admin.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{admin.addedAt}</TableCell>
                      <TableCell>
                              <Badge variant="secondary">{ admin.role }</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                              <ConfirmActionDialog
                                  title={`Remove ${admin.name} from access list?`}
                                  description={`${admin.name} will not be able to access this website unless you reset him back to the list`}
                                  action={() => removeSubAdmin(admin.id,true)} trigger={
                                (admin.role === "SUB_ADMIN" && session?.user.role === "ADMIN") && <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <UserRoundMinus className="h-4 w-4" />
                                  </Button>
                              } />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize your dashboard theme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  <div className="space-y-0.5">
                    <Label htmlFor="theme-mode">Theme Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark mode
                    </p>
                  </div>
                </div>
                <Switch
      id="theme-mode"
      checked={isDarkMode}
      onCheckedChange={toggleTheme}
    />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PreferencesPage;