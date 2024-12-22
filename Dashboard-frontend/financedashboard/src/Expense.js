import React, { useState } from 'react';
import './Expense.css';

function Expense() {
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [expenseList, setexpenseList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [deletevisible, setDeleteVisible] = useState(false);

  const handleAddexpense = () => {
    if (category && date && amount) {
      setexpenseList([...expenseList, { category, date, amount }]);
      setCategory('');
      setDate('');
      setAmount('');
    }
  };

  const handleDeleteexpense = (index) => {
    const updatedList = expenseList.filter((_, i) => i !== index);
    setexpenseList(updatedList);
    handleNotEditexpense(index);
  };

  const handleEditexpense = (index) => {
    const expenseToEdit = expenseList[index];
    setCategory(expenseToEdit.category);
    setDate(expenseToEdit.date);
    setAmount(expenseToEdit.amount);
    setIsEditing(true);
    setCurrentIndex(index);
    setDeleteVisible(true);
  };
  const handleNotEditexpense=(index)=>{
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
    <div className="expense-container">
      <div className="expense-left">
        <h2>Add Expense</h2>
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
        <button onClick={handleAddexpense}>{isEditing ? 'Update' : 'Add'}</button>
      </div>

      <div className="expense-right">
        <h2>Expense List</h2>
        <div classname="delete">
          {deletevisible &&(<button id="delete" onClick={()=>handleDeleteexpense(currentIndex)}>{'Delete'}</button>)}
        </div>
        {expenseList.length > 0 ? (
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
              {expenseList.map((expense, index) => (
                <tr key={index}>
                  <td>
                    <input type="checkbox" onChange={(e) =>e.target.checked ? handleEditexpense(index) : handleNotEditexpense(index)}/>
                  </td>
                  <td>{index+1}</td>
                  <td>{expense.category}</td>
                  <td>{expense.date}</td>
                  <td>₹{expense.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No Expense added yet.</p>
        )}
      </div>
    </div>
  );
}

export default Expense;
