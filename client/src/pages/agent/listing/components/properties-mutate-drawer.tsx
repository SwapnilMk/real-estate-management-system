import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SelectDropdown } from "@/components/select-dropdown";
import { useProperties } from "./properties-provider.tsx";
import {
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
} from "@/services/agentApi";
import { toast } from "sonner";
import { LocationPicker } from "@/components/location-picker";

const formSchema = z.object({
  street_address: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  postal_code: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  type: z.string().min(1, "Property type is required"),
  transaction_type: z.string().min(1, "Transaction type is required"),
  bedrooms_total: z.string().optional(),
  bathroom_total: z.string().optional(),
  sizeInterior: z.string().optional(),
  year_built: z.string().optional(),
  description: z.string().optional(),
  latitude: z.string().min(1, "Latitude is required"),
  longitude: z.string().min(1, "Longitude is required"),
  images: z.any().optional(),
});

type PropertyForm = z.infer<typeof formSchema>;

export function PropertiesMutateDrawer() {
  const {
    editingProperty,
    setEditingProperty,
    isAddingProperty,
    setIsAddingProperty,
  } = useProperties();
  const [createProperty, { isLoading: isCreating }] =
    useCreatePropertyMutation();
  const [updateProperty, { isLoading: isUpdating }] =
    useUpdatePropertyMutation();
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const isUpdate = !!editingProperty;
  const open = isAddingProperty || isUpdate;

  const form = useForm<PropertyForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      street_address: "",
      city: "",
      province: "",
      postal_code: "",
      price: "",
      type: "",
      transaction_type: "",
      bedrooms_total: "",
      bathroom_total: "",
      sizeInterior: "",
      year_built: "",
      description: "",
      latitude: "",
      longitude: "",
    },
  });

  useEffect(() => {
    if (editingProperty) {
      form.reset({
        street_address: editingProperty.street_address,
        city: editingProperty.city,
        province: editingProperty.province,
        postal_code: editingProperty.postal_code || "",
        price: String(editingProperty.price),
        type: editingProperty.type,
        transaction_type: editingProperty.transaction_type,
        bedrooms_total: editingProperty.bedrooms_total?.toString() || "",
        bathroom_total: editingProperty.bathroom_total?.toString() || "",
        sizeInterior: editingProperty.sizeInterior || "",
        year_built: editingProperty.year_built || "",
        description: editingProperty.description || "",
        latitude: String(editingProperty.latitude),
        longitude: String(editingProperty.longitude),
      });
      // Load existing images
      if (editingProperty.photo_url) {
        const images = [editingProperty.photo_url];
        // Add additional photos from all_photos if available
        if (editingProperty.all_photos) {
          const additionalPhotos = Object.values(editingProperty.all_photos);
          images.push(
            ...additionalPhotos.filter(
              (url) => url !== editingProperty.photo_url,
            ),
          );
        }
        setExistingImages(images);
      }
    }
  }, [editingProperty, form]);

  const onSubmit = async (data: PropertyForm) => {
    try {
      const formData = new FormData();

      // Add all form fields
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "images" && value) {
          formData.append(key, value);
        }
      });

      // Add multiple images if selected
      if (data.images && data.images.length > 0) {
        Array.from(data.images as FileList).forEach((file: File) => {
          formData.append("images", file);
        });
      }

      if (isUpdate && editingProperty) {
        await updateProperty({ id: editingProperty._id, formData }).unwrap();
        toast.success("Property updated successfully");
        setEditingProperty(null);
      } else {
        await createProperty(formData).unwrap();
        toast.success("Property created successfully");
        setIsAddingProperty(false);
      }

      form.reset();
      setImagePreviews([]);
      setExistingImages([]);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save property");
    }
  };

  const handleClose = () => {
    setEditingProperty(null);
    setIsAddingProperty(false);
    form.reset();
    setImagePreviews([]);
    setExistingImages([]);
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const previews: string[] = [];

      fileArray.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result as string);
          if (previews.length === fileArray.length) {
            setImagePreviews(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImagePreview = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && handleClose()}>
      <SheetContent className="flex flex-col sm:max-w-xl">
        <SheetHeader className="text-start">
          <SheetTitle>{isUpdate ? "Update" : "Create"} Property</SheetTitle>
          <SheetDescription>
            {isUpdate
              ? "Update the property by providing necessary info."
              : "Add a new property by providing necessary info."}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            id="properties-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 space-y-4 overflow-y-auto px-1"
          >
            {/* Image Upload */}
            <FormField
              control={form.control}
              name="images"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Property Images (Max 5)</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-3">
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          onChange(e.target.files);
                          handleImagesChange(e);
                        }}
                        {...field}
                      />

                      {/* Existing Images */}
                      {existingImages.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Existing Images
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {existingImages.map((url, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={url}
                                  alt={`Existing ${index + 1}`}
                                  className="h-32 w-full rounded-md object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeExistingImage(index)}
                                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* New Image Previews */}
                      {imagePreviews.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            New Images ({imagePreviews.length}/5)
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {imagePreviews.map((preview, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={preview}
                                  alt={`Preview ${index + 1}`}
                                  className="h-32 w-full rounded-md object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImagePreview(index)}
                                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address Fields */}
            <FormField
              control={form.control}
              name="street_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="123 Main St" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Toronto" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Province</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="ON" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="postal_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="M5H 2N2" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Property Details */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" placeholder="500000" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select type"
                      items={[
                        { label: "House", value: "House" },
                        { label: "Condo", value: "Condo" },
                        { label: "Townhouse", value: "Townhouse" },
                        { label: "Apartment", value: "Apartment" },
                        { label: "Land", value: "Land" },
                      ]}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="transaction_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Type</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select type"
                      items={[
                        { label: "For Sale", value: "Sale" },
                        { label: "For Rent", value: "Rent" },
                        { label: "For Lease", value: "Lease" },
                      ]}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bedrooms_total"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bedrooms</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="3" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bathroom_total"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathrooms</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="2" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sizeInterior"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size (sq ft)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="2000" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year_built"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year Built</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="2020" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Location Picker */}
            <div className="space-y-2">
              <LocationPicker
                latitude={form.watch("latitude")}
                longitude={form.watch("longitude")}
                onLocationChange={(
                  lat: number,
                  lng: number,
                  address?: string,
                ) => {
                  form.setValue("latitude", lat.toString());
                  form.setValue("longitude", lng.toString());

                  // Optionally update address fields if they're empty
                  if (address && !form.getValues("street_address")) {
                    // Parse address components
                    const geocoder = new google.maps.Geocoder();
                    geocoder.geocode({ address }, (results, status) => {
                      if (status === "OK" && results && results[0]) {
                        const addressComponents = results[0].address_components;

                        // Extract street address
                        const streetNumber =
                          addressComponents.find((c) =>
                            c.types.includes("street_number"),
                          )?.long_name || "";
                        const route =
                          addressComponents.find((c) =>
                            c.types.includes("route"),
                          )?.long_name || "";

                        if (streetNumber && route) {
                          form.setValue(
                            "street_address",
                            `${streetNumber} ${route}`,
                          );
                        }

                        // Extract city
                        const city = addressComponents.find((c) =>
                          c.types.includes("locality"),
                        )?.long_name;
                        if (city && !form.getValues("city")) {
                          form.setValue("city", city);
                        }

                        // Extract province
                        const province = addressComponents.find((c) =>
                          c.types.includes("administrative_area_level_1"),
                        )?.short_name;
                        if (province && !form.getValues("province")) {
                          form.setValue("province", province);
                        }

                        // Extract postal code
                        const postalCode = addressComponents.find((c) =>
                          c.types.includes("postal_code"),
                        )?.long_name;
                        if (postalCode && !form.getValues("postal_code")) {
                          form.setValue("postal_code", postalCode);
                        }
                      }
                    });
                  }
                }}
              />
              {(form.formState.errors.latitude ||
                form.formState.errors.longitude) && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.latitude?.message ||
                    form.formState.errors.longitude?.message}
                </p>
              )}
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Beautiful property with..."
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <SheetFooter className="gap-2">
          <SheetClose asChild>
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
          </SheetClose>
          <Button
            form="properties-form"
            type="submit"
            disabled={isCreating || isUpdating}
          >
            {isCreating || isUpdating ? "Saving..." : "Save changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
