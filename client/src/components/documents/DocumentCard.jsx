import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function DocumentCard({ proposal }) {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-lg transition">
      <CardHeader>
        <CardTitle className="text-lg">
          {proposal.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <p className="text-sm text-gray-600 line-clamp-3">
          {proposal.description}
        </p>

        <p className="text-xs text-gray-500">
          Submitted on{" "}
          {new Date(proposal.submittedAt).toLocaleDateString()}
        </p>

        <Button
          className="w-full mt-3"
          onClick={() => navigate(`/documents/${proposal._id}`)}
        >
          View Proposal
        </Button>
      </CardContent>
    </Card>
  );
}