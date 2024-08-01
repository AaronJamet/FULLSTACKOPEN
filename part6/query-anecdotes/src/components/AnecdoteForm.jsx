import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createAnecdote } from "../../requests"
import { useMessageDispatch } from '../MessageContext'
import useNotify from "../useNotify"

const AnecdoteForm = () => {
  const dispatch = useMessageDispatch()
  const queryClient = useQueryClient()
  const notify = useNotify()

  const newAnecdoteMutation = useMutation({ 
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
    onError: () => {
      notify('too short anecdote, must have 5 length or more', 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    
    newAnecdoteMutation.mutate({ content, votes: 0 })

    // show notification through a dispatch to the Context state
    notify(`New note created: ${content}`, 5000)
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
