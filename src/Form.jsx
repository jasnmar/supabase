import { useState, useEffect } from 'react'
import supabaseClient from './supabase-client'

export default function Form( { metrics }) {
  const [ newDeal, setNewDeal ] = useState({})

  useEffect(() => {
    if(metrics && metrics.length > 0) {
      setNewDeal({
        name: metrics[0].name,
        value: 0
      })
    }
  },[metrics])

  const handleSubmit = (e) => {
    e.preventDefault()
    addDeal()
    setNewDeal({
      name: metrics[0].name,
      value: 0
    })
  }

  async function addDeal() {
    try{
      const { error } = await supabaseClient
        .from('sales_deals')
        .insert([newDeal])
      if (error) {
        throw new Error(error)
      }

    } catch (error) {
      console.error(error)
    }
  }

  const handleChange = (e) => {
    const eventName = e.target.name
    const eventValue = e.target.value
    
    setNewDeal((prevState => ({...prevState, [eventName]: eventValue})))
  }

  const generateOptions = () => {
    return metrics.map((m) => (
      <option key={m.name} value={m.name}>
        {m.name}
      </option>
    ))
  }

  return (
    <>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <label>Name:
            <select value={newDeal.name} onChange={handleChange} name="name">
              {generateOptions()}
            </select>
          </label>
          <label>Amount: $
            <input
              value={newDeal.value}
              type="number"
              name="value"
              onChange={handleChange}
              className="amount-input"
              min="0"
              step="10"
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>

    </>
  )
}