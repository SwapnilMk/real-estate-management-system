import { useState } from "react";
import { useSelector } from "react-redux";
import { useGetUserWishlistQuery } from "@/services/propertyApi";
import { PropertyCard } from "@/components/property-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Loader, Heart, User, Mail, Shield, Phone, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { RootState } from "@/store/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InquiryList } from "./components/inquiry-list";
import { EditProfileDialog } from "./components/edit-profile-dialog";
import { ChangePasswordDialog } from "./components/change-password-dialog";
export default function ClientProfile() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] =
    useState(false);
  const {
    data: wishlist,
    isLoading,
    isError,
  } = useGetUserWishlistQuery(undefined, {
    skip: !user,
  });

  const initials = user?.name?.charAt(0)?.toUpperCase() || "U";

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header Background */}
      <div className="h-48 bg-muted relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5" />
      </div>

      <div className="container max-w-6xl mx-auto px-4 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          {/* Left Sidebar - Profile Info */}
          <div className="space-y-6">
            <Card className="overflow-hidden border-none shadow-lg">
              <CardContent className="p-6 flex flex-col items-center text-center pt-8">
                <Avatar className="h-24 w-24 mb-4 border-4 border-background shadow-sm">
                  <AvatarImage src={user.avatar || ""} />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <h2 className="text-xl font-bold mb-1">{user.name}</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  {user.email}
                </p>

                <div className="w-full space-y-3 text-left">
                  <div className="flex items-center gap-3 text-sm p-2 rounded-md hover:bg-muted/50 transition-colors">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Client Account</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm p-2 rounded-md hover:bg-muted/50 transition-colors">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  {user.phoneNumber && (
                    <div className="flex items-center gap-3 text-sm p-2 rounded-md hover:bg-muted/50 transition-colors">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{user.phoneNumber}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm p-2 rounded-md hover:bg-muted/50 transition-colors">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span>Verified User</span>
                  </div>
                </div>

                <Button
                  onClick={() => setIsEditDialogOpen(true)}
                  className="w-full mt-4"
                  variant="outline"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>

                <Button
                  onClick={() => setIsChangePasswordDialogOpen(true)}
                  className="w-full mt-2"
                  variant="outline"
                >
                  Change Password
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Content - Tabs */}
          <div className="space-y-6">
            <Tabs defaultValue="wishlist" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="wishlist">My Wishlist</TabsTrigger>
                <TabsTrigger value="inquiries">My Inquiries</TabsTrigger>
              </TabsList>

              <TabsContent value="wishlist" className="space-y-3 mt-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">My Wishlist</h1>
                  <div className="text-muted-foreground">
                    {wishlist?.length || 0} Saved Properties
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Loader className="h-8 w-8 animate-spin mb-4" />
                    <p>Loading your wishlist...</p>
                  </div>
                ) : isError ? (
                  <div className="text-center py-12 text-red-500">
                    <p>Failed to load wishlist. Please try again later.</p>
                  </div>
                ) : wishlist && wishlist.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6">
                    {wishlist.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        isInWishlist={true}
                      />
                    ))}
                  </div>
                ) : (
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Heart className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        Your wishlist is empty
                      </h3>
                      <p className="text-muted-foreground max-w-sm mb-6">
                        Start exploring properties and save your favorites to
                        keep track of them here.
                      </p>
                      <Button asChild>
                        <Link to="/map-search">Explore Properties</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="inquiries" className="space-y-3 mt-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">My Inquiries</h1>
                </div>
                <InquiryList />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      {user && (
        <>
          <EditProfileDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            user={user}
          />
          <ChangePasswordDialog
            open={isChangePasswordDialogOpen}
            onOpenChange={setIsChangePasswordDialogOpen}
          />
        </>
      )}
    </div>
  );
}
