import { CoursePart } from "../types";

const Part = ({coursePart}: {coursePart: CoursePart}) => {
  let result = null;

  switch (coursePart.kind) {
    case "basic":
      result = <div>
                  <p><strong>{coursePart.name} {coursePart.exerciseCount}</strong></p>
                  <p>{coursePart.description}</p>
                  <br />
               </div>;
      break;
    case "group":
      result = <div>
                <p><strong>{coursePart.name} {coursePart.exerciseCount}</strong></p>
                <p>project exercises: {coursePart.groupProjectCount}</p>
                <br />
            </div>;
      break;
    case "background":
      result = <div>
                <p><strong>{coursePart.name} {coursePart.exerciseCount}</strong></p>
                <p>{coursePart.description}</p>
                <p>submit to: {coursePart.backgroundMaterial}</p>
                <br />
            </div>;
      break;
      case "special":
        result = <div>
                  <p><strong>{coursePart.name} {coursePart.exerciseCount}</strong></p>
                  <p>{coursePart.description}</p>
                  <p>required skills: {coursePart.requirements.join(', ')}</p>
                  <br />
              </div>;
        break;
      default: result = null;
  }

  return result;
}

export default Part