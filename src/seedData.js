import { v4 as uuidv4 } from 'uuid';
import moment from 'moment'

const expenses = [
  {
    id: uuidv4(),
    description: 'Pack of beer',
    amount: 550,
    createdAt: moment().subtract(3, 'days').valueOf()
  },
  {
    id: uuidv4(),
    description: 'A cake',
    amount: 599,
    createdAt: moment().subtract(14, 'days').valueOf()
  },
  {
    id: uuidv4(),
    description: 'Bacon mmm',
    amount: 299,
    createdAt: moment().subtract(12, 'days').valueOf()
  },
  {
    id: uuidv4(),
    description: 'A small dragon',
    amount: 14999,
    createdAt: moment().subtract(1, 'days').valueOf()
  }
]


localStorage.setItem('expenses', JSON.stringify(expenses))