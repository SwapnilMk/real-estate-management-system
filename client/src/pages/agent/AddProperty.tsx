import React, { useState, useEffect } from "react";
import {
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useGetAgentPropertiesQuery,
} from "@/services/agentApi";
import { useNavigate, useParams } from "react-router-dom";

const AddProperty: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // If ID is present, it's edit mode
  const isEditMode = !!id;

  const [createProperty, { isLoading: isCreating }] =
    useCreatePropertyMutation();
  const [updateProperty, { isLoading: isUpdating }] =
    useUpdatePropertyMutation();
  const { data: properties } = useGetAgentPropertiesQuery(undefined, {
    skip: !isEditMode,
  });

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    street_address: "",
    city: "",
    province: "",
    postal_code: "",
    price: "",
    bedrooms_total: "",
    bathroom_total: "",
    type: "House",
    transaction_type: "For Sale",
    description: "",
    sizeInterior: "",
    year_built: "",
    latitude: "",
    longitude: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Populate form if in edit mode
  useEffect(() => {
    if (isEditMode && properties) {
      const property = properties.find((p: any) => p._id === id);
      if (property) {
        setFormData({
          street_address: property.properties.street_address || "",
          city: property.properties.city || "",
          province: property.properties.province || "",
          postal_code: property.properties.postal_code || "",
          price: property.properties.price || "",
          bedrooms_total: property.properties.bedrooms_total || "",
          bathroom_total: property.properties.bathroom_total || "",
          type: property.properties.type || "House",
          transaction_type: property.properties.transaction_type || "For Sale",
          description: property.properties.description || "",
          sizeInterior: property.properties.sizeInterior || "",
          year_built: property.properties.year_built || "",
          latitude: property.properties.latitude || "",
          longitude: property.properties.longitude || "",
        });
        if (property.properties.photo_url) {
          setPreview(property.properties.photo_url);
        }
      }
    }
  }, [isEditMode, properties, id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    if (image) {
      data.append("image", image);
    }

    try {
      if (isEditMode && id) {
        await updateProperty({ id, formData: data }).unwrap();
        alert("Property updated successfully!");
      } else {
        await createProperty(data).unwrap();
        alert("Property added successfully!");
      }
      navigate("/dashboard/listings");
    } catch (error) {
      console.error("Failed to save property:", error);
      alert("Failed to save property.");
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6">
        {isEditMode ? "Edit Property" : "Add New Property"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Street Address
            </label>
            <input
              type="text"
              name="street_address"
              value={formData.street_address}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Province
            </label>
            <input
              type="text"
              name="province"
              value={formData.province}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Postal Code
            </label>
            <input
              type="text"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="text" // keeping as text as per schema seems to be string
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            >
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Condo">Condo</option>
              <option value="Townhouse">Townhouse</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bedrooms
            </label>
            <input
              type="number"
              name="bedrooms_total"
              value={formData.bedrooms_total}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bathrooms
            </label>
            <input
              type="number"
              name="bathroom_total"
              value={formData.bathroom_total}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Latitude
            </label>
            <input
              type="text"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Longitude
            </label>
            <input
              type="text"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Property Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {preview && (
            <div className="mt-4">
              <img
                src={preview}
                alt="Preview"
                className="h-48 w-full object-cover rounded-md"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isLoading
              ? "Saving..."
              : isEditMode
                ? "Update Property"
                : "Add Property"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProperty;
