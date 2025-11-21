import Contact, { IContact } from "../models/contact.model";

interface CreateContactData {
  name: string;
  email: string;
  message: string;
}

/**
 * Create a new contact message
 */
export async function createContactMessage(
  data: CreateContactData,
): Promise<IContact> {
  try {
    // Validate input
    if (!data.name || !data.email || !data.message) {
      throw new Error("All fields are required");
    }

    // Create contact message
    const contact = await Contact.create({
      name: data.name,
      email: data.email,
      message: data.message,
      status: "pending",
    });

    return contact;
  } catch (error: any) {
    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors)
        .map((err: any) => err.message)
        .join(", ");
      throw new Error(messages);
    }
    throw error;
  }
}

/**
 * Get all contact messages (for admin/agent use)
 */
export async function getAllContactMessages(): Promise<IContact[]> {
  return Contact.find().sort({ createdAt: -1 });
}

/**
 * Update contact message status
 */
export async function updateContactStatus(
  id: string,
  status: "pending" | "read" | "responded",
): Promise<IContact | null> {
  return Contact.findByIdAndUpdate(id, { status }, { new: true });
}
