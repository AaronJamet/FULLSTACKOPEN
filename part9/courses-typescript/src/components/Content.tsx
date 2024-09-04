import { CoursePart } from "../types";
import Part from "./Part";

const Content = ({ courseParts }: { courseParts: CoursePart[] }) => {
  return (
    <div>
      {courseParts.map((part, index) => (
        <Part key={index} coursePart={part} />
      ))}
    </div>
  )
};

export default Content;