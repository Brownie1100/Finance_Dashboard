import React, { useState } from 'react';
import './Income.css';

function Income() {
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [incomeList, setIncomeList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [deletevisible, setDeleteVisible] = useState(false);

  const handleAddIncome = () => {
    if (category && date && amount) {
      setIncomeList([...incomeList, { category, date, amount }]);
      setCategory('');
      setDate('');
      setAmount('');
    }
  };

  const handleDeleteIncome = (index) => {
    const updatedList = incomeList.filter((_, i) => i !== index);
    setIncomeList(updatedList);
    handleNotEditIncome(index);
  };

  const handleEditIncome = (index) => {
    const incomeToEdit = incomeList[index];
    setCategory(incomeToEdit.category);
    setDate(incomeToEdit.date);
    setAmount(incomeToEdit.amount);
    setIsEditing(true);
    setCurrentIndex(index);
    setDeleteVisible(true);
  };
  const handleNotEditIncome=(index)=>{
    setCategory("");
    setDate("");
    setAmount("");
    setIsEditing(false);
    setDeleteVisible(false);
  };

  // if(!setDeleteVisible){
  //   const button = document.getElementById('delete');
  //   button.style.display = 'none';
  // }
  // else
  // {    
  //   const button = document.getElementById('delete');
  //   button.style.display = 'block';
  // }

  return (
    <div className="income-container">
      <div className="income-left">
        <h2>Add Income</h2>
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select Category</option>
            <option value="Salary">Salary</option>
            <option value="Bonus">Bonus</option>
            <option value="Investment">Investment</option>
            <option value="Freelance">Freelance</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)}/>
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount:</label>
          <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)}/>
        </div>
        <button onClick={handleAddIncome}>{isEditing ? 'Update' : 'Add'}</button>
      </div>

      <div className="income-right">
        <h2>Income List</h2>
        <div classname="delete">
          {deletevisible &&(<button id="delete" onClick={()=>handleDeleteIncome(currentIndex)}>{'Delete'}</button>)}
        </div>
        {incomeList.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th></th>
                <th>S.No.</th>
                <th>Category</th>
                <th>Date</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {incomeList.map((income, index) => (
                <tr key={index}>
                  <td>
                    <input type="checkbox" onChange={(e) =>e.target.checked ? handleEditIncome(index) : handleNotEditIncome(index)}/>
                  </td>
                  <td>{index+1}</td>
                  <td>{income.category}</td>
                  <td>{income.date}</td>
                  <td>₹{income.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No income added yet.</p>
        )}
      </div>
    </div>
  );
}

export default Income;
