import {
  useGetAgentInterestsQuery,
  useUpdateInterestStatusMutation,
} from "@/services/interestApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink, Mail, Phone } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function InterestList() {
  const { data: interests, isLoading, isError } = useGetAgentInterestsQuery();
  const [updateStatus] = useUpdateInterestStatusMutation();

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      toast.success("Status updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[400px] items-center justify-center text-red-500">
        Error loading inquiries. Please try again.
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 sm:gap-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Inquiries</h2>
          <p className="text-muted-foreground">
            Manage client interests and leads for your properties
          </p>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!interests || interests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No inquiries found.
                </TableCell>
              </TableRow>
            ) : (
              interests.map((interest) => (
                <TableRow key={interest._id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="truncate max-w-[200px]">
                        {interest.propertyId.properties.street_address}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {interest.propertyId.properties.city}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {interest.clientId.name}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" /> {interest.clientId.email}
                      </div>
                      {interest.clientId.phoneNumber && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" />{" "}
                          {interest.clientId.phoneNumber}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className="max-w-[300px] truncate"
                      title={interest.message}
                    >
                      {interest.message || "—"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(interest.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Select
                      defaultValue={interest.status}
                      onValueChange={(value) =>
                        handleStatusChange(interest._id, value)
                      }
                    >
                      <SelectTrigger className="w-[130px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">
                          <Badge variant="outline" className="mr-2">
                            Pending
                          </Badge>
                          Pending
                        </SelectItem>
                        <SelectItem value="contacted">
                          <Badge variant="default" className="mr-2">
                            Contacted
                          </Badge>
                          Contacted
                        </SelectItem>
                        <SelectItem value="closed">
                          <Badge variant="secondary" className="mr-2">
                            Closed
                          </Badge>
                          Closed
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/listings/${interest.propertyId._id}`}>
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
