const Filter = ({nameFilter, handleFilterChange}) => {
  return (
    <div>
      filter show-only with: <input value={nameFilter} onChange={handleFilterChange} />
    </div>
  )
}

export default Filter