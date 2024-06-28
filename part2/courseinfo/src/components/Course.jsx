const Header = (props) => {
  return (
    <>
      <h1>{props.course}</h1>
    </>
  )
}

const Part = (props) => {
  return (
    <>
      <p>
        {props.partTitle} {props.numExercises}
      </p>
    </>
  )
}

const Content = ({parts}) => {
  return (
    <>
      {parts.map(part =>
        <Part key={part.id} partTitle={part.name} 
              numExercises={part.exercises} />
      )}
    </>
  )
}

const Total = ({parts}) => {
  const sum = 
    parts.reduce((x, part) => x + part.exercises, 0)

  return (
    <>
      <p><b>Total of {sum} exercises</b></p>
    </>
  )
}

const Course = ({course}) => {
  return (
    <>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </>
  )
}

export default Course