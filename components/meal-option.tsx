import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface MealOptionProps {
  title: string;
  description: string;
  handleClick: ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => void;
}

export default function MealOption({
  title,
  description,
  handleClick,
}: MealOptionProps) {
  return (
    <>
      <Card
        className="hover:cursor-pointer hover:bg-accent"
        onClick={() => handleClick({ title, description })}
      >
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </>
  );
}
