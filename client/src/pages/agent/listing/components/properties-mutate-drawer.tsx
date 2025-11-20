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
  image: z.any().optional(),
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
        street_address: editingProperty.properties.street_address,
        city: editingProperty.properties.city,
        province: editingProperty.properties.province,
        postal_code: editingProperty.properties.postal_code || "",
        price: editingProperty.properties.price,
        type: editingProperty.properties.type,
        transaction_type: editingProperty.properties.transaction_type,
        bedrooms_total: editingProperty.properties.bedrooms_total || "",
        bathroom_total: editingProperty.properties.bathroom_total || "",
        sizeInterior: editingProperty.properties.sizeInterior || "",
        year_built: editingProperty.properties.year_built || "",
        description: editingProperty.properties.description || "",
        latitude: String(editingProperty.properties.latitude),
        longitude: String(editingProperty.properties.longitude),
      });
      if (editingProperty.properties.photo_url) {
        setImagePreview(editingProperty.properties.photo_url);
      }
    }
  }, [editingProperty, form]);

  const onSubmit = async (data: PropertyForm) => {
    try {
      const formData = new FormData();

      // Add all form fields
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "image" && value) {
          formData.append(key, value);
        }
      });

      // Add image if selected
      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
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
      setImagePreview(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save property");
    }
  };

  const handleClose = () => {
    setEditingProperty(null);
    setIsAddingProperty(false);
    form.reset();
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
              name="image"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Property Image</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          onChange(e.target.files);
                          handleImageChange(e);
                        }}
                        {...field}
                      />
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-32 w-full rounded-md object-cover"
                        />
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

            {/* Coordinates */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="any"
                        placeholder="43.6532"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="any"
                        placeholder="-79.3832"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
