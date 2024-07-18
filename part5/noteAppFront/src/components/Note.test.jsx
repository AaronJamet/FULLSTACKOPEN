import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Note from './Note'
import { expect } from 'vitest'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const { container } = render(<Note note={note} />)

  const div = container.querySelector('.note')
  expect(div).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
})

test('clicking the button calls event handler once', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const mockHandler = vi.fn() // controladore de eventos mockeado

  render(
    <Note note={note} toggleImportance={mockHandler} />
  )

  // se inicia sesion para interactuar con componentes renderizados, y se clickea
  const user = userEvent.setup()
  const button = screen.getByText('make not important')
  await user.click(button)

  // verificar que se ha llamado 1 vez a la funcion
  expect(mockHandler.mock.calls).toHaveLength(1)
})