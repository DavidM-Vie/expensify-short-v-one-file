import React, { useState, useEffect } from 'react';
import moment from 'moment'
import './App.css';

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import { DateRangePicker, SingleDatePicker  } from 'react-dates';


import './seedData'


function App() {

  // EXPENSES SET FROM LOCALSTORAGE ON MOUNT
  const [expenses, setExpenses] = useState([])

  // FILTERS DATA 
  const [filters, setFilters] = useState({
    text: '',
    sortBy: 'date',
    startDate: moment().startOf('month'),
    endDate: moment().endOf('month')
  })

  useEffect(() => {
    const expenses = JSON.parse(localStorage.getItem('expenses')); // synchronous..
    setExpenses(expenses)
  }, [])


  // FILTER STATE CHANGERS
  const onTextChange = (text) => {
    setFilters({
      ...filters,
      text
    })
  }

  const onSortByChange = (sortBy) => {
    setFilters({
      ...filters,
      sortBy
    })
  }

  const onDatesChange = (startDate, endDate) => {
    setFilters({
      ...filters,
      startDate,
      endDate
    })
  }



  return (
    <React.Fragment>
      <Header />
      <ExpensesDashboardPage 
        expenses={expenses} 
        filters={filters}
        onTextChange={onTextChange}
        onSortByChange={onSortByChange}
        onDatesChange={onDatesChange}  
      />
    </React.Fragment>
    
  )

}

export default App;


///////////////////////////////        

//////////////////////////////


  // HEADER COMPONENT
  const Header = (props) => {
    return (
      <header>
        <h1>Expensify</h1>
        <p>Stay in control of your expenses</p>
      </header>
    )
  }

  // EXPENSES DASHBOARD COMPONENT
  const ExpensesDashboardPage = (props) => {

    return (
      <React.Fragment>
        <h1>Dashboard</h1>
        <ExpensesSummary expenses={props.expenses} filters={props.filters} />
        <ExpenseListFilters expenses={props.expenses} filters={props.filters} onDatesChange={props.onDatesChange} onTextChange={props.onTextChange} onSortByChange={props.onSortByChange}/>
        <ExpensesList expenses={props.expenses} filters={props.filters}/>
      </React.Fragment>

    )
  }


  //EXPENSES SUMMARY COMPONENT

    const ExpensesSummary = (props) => {
      
      const visibleExpenses = getVisibleExpenses(props.expenses, props.filters);
      
      const total = visibleExpenses.reduce((acc, expense) => {
        return acc + expense.amount
      }, 0)

      const expensesWord = visibleExpenses.length === 1 ? 'expense' : 'expenses'

      return (
        <h3> Showing {visibleExpenses.length } { expensesWord } totalling £{ total / 100} </h3>
      )
    }


  // EXPENSES FILTERS COMPONENT
  const ExpenseListFilters = (props) => {
      const [focusedInput, setFocusedInput ] = useState(null)

      const onTextChange = (e) => {
        props.onTextChange(e.target.value)
      }

      const onSortByChange = (e) => {
        props.onSortByChange(e.target.value)
      }

      const onDatesChange = (startDate, endDate) => {
        props.onDatesChange(startDate, endDate)
      }

    return (
      <React.Fragment>
        <input 
          value={props.filters.text}
          onChange={onTextChange}
        />
        <select 
          value={props.filters.sortBy}
          onChange={onSortByChange}
        >
          <option value="date">Date</option>
          <option value="amount">Amount</option>
        </select>
        <DateRangePicker
          startDate={props.filters.startDate} // momentPropTypes.momentObj or null,
          startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
          endDate={props.filters.endDate} // momentPropTypes.momentObj or null,
          endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
          onDatesChange={({ startDate, endDate }) => onDatesChange(startDate, endDate )} // PropTypes.func.isRequired,
          focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
          onFocusChange={focusedInput => setFocusedInput(focusedInput)} // PropTypes.func.isRequired,
          numberOfMonths={1}
          isOutsideRange={() => false}
        />
      </React.Fragment>
    )
  }


  // EXPENSES LIST COMPONENT

  const ExpensesList = (props) => {

    const visibleExpenses = getVisibleExpenses(props.expenses, props.filters);
    



    return (
      <React.Fragment>
        <ul>
          <div>Expenses</div>
          {
            visibleExpenses.map((expense) => {
              return <ExpensesListItem key={expense.id} expense={expense} />
            })
          }
        </ul>

      </React.Fragment>

    )
  }



  // EXPENSES LIST ITEM COMPONENT
  const ExpensesListItem = (props) => {
    const expense = props.expense


    return (
      <li >
        <h4>{expense.description}</h4>
        <p>{moment(expense.createdAt).format('MMMM Do, YYYY')}</p>
        <p>£{expense.amount}</p>
      </li>
    )
  }


  // SELECTOR HELPER FUNCTIONS
  const getVisibleExpenses = (expenses, { startDate, endDate, text, sortBy}) => {

   return expenses
    .filter((expense) => {
      const createdAtMoment = moment(expense.createdAt)
      const startDateMatch = startDate ? startDate.isSameOrBefore(createdAtMoment, 'day')  : true;
      const endDateMatch = endDate ? endDate.isSameOrAfter(createdAtMoment, 'day') : true;
      const textMatch = text ? expense.description.toLowerCase().includes(text.toLowerCase()) : true

      return startDateMatch && endDateMatch && textMatch
    })
    .sort((a, b) => {
      if(sortBy === 'date') {
        return a.createdAt > b.createdAt ? -1 : 1;
      }else if(sortBy === 'amount') {
        return a.amount > b.amount ? -1 : 1;
      }
    })

  }

